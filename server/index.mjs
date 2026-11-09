/**
 * CC · Captain Class 백엔드
 * - Node 22.13+ / 24 (내장 node:sqlite 사용, 네이티브 빌드 불필요)
 * - Express 5 + CORS
 * - 공유 데이터: P난처 사례·솔루션·도움돼요, 커뮤니티 글, 익명 브릿지 고충·답변
 * - 사용자: 이름 + 4자리 PIN 로그인(없으면 자동 가입), 사용자별 기록 상태 동기화, 랭킹
 * - 프론트 빌드(dist/)가 있으면 같은 포트에서 정적으로 서빙한다.
 *
 * 환경 변수
 *   PORT            기본 8787
 *   HOST            기본 0.0.0.0 (공용 서버에서는 127.0.0.1 권장)
 *   DATABASE_PATH   기본 server/data/cc.sqlite
 *   CORS_ORIGIN     기본 * (예: https://dgucse-geonlee22.github.io)
 *   ADMIN_KEY       설정 시 POST /api/admin/reset 허용 (x-admin-key 헤더)
 */
import express from 'express'
import cors from 'cors'
import { DatabaseSync } from 'node:sqlite'
import { randomBytes, scryptSync, timingSafeEqual, randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { classifyReply, coachingCheck, tokenize } from './rules.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const PORT = Number(process.env.PORT ?? 8787)
const HOST = process.env.HOST ?? '0.0.0.0'
const DB_PATH = process.env.DATABASE_PATH ?? join(here, 'data', 'cc.sqlite')
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*'
const ADMIN_KEY = process.env.ADMIN_KEY ?? ''
const VERSION = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version ?? '0.0.0'

mkdirSync(dirname(DB_PATH), { recursive: true })
const db = new DatabaseSync(DB_PATH)
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')

// ───────────────────────── 스키마 ─────────────────────────
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, display TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'captain', rank TEXT NOT NULL DEFAULT '',
  pin_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS user_state (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, state_json TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, situation TEXT NOT NULL, solution TEXT NOT NULL DEFAULT '',
  author_rank TEXT NOT NULL DEFAULT '', helpful INTEGER NOT NULL DEFAULT 0, keywords_json TEXT NOT NULL DEFAULT '[]',
  lens_preset_id TEXT, scenario_id TEXT, origin TEXT NOT NULL DEFAULT 'seed', author_id TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS case_votes (case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, PRIMARY KEY (case_id, user_id));
CREATE TABLE IF NOT EXISTS solutions (
  id TEXT PRIMARY KEY, case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE, author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL, author_rank TEXT NOT NULL, text TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY, dept TEXT NOT NULL, author TEXT NOT NULL, title TEXT NOT NULL, excerpt TEXT NOT NULL,
  replies INTEGER NOT NULL DEFAULT 0, origin TEXT NOT NULL DEFAULT 'seed', author_id TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS grievances (
  id TEXT PRIMARY KEY, source TEXT NOT NULL, from_label TEXT NOT NULL, dept TEXT NOT NULL, content TEXT NOT NULL,
  env_json TEXT, received_at TEXT NOT NULL, origin TEXT NOT NULL DEFAULT 'seed', author_id TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS answers (
  id TEXT PRIMARY KEY, grievance_id TEXT NOT NULL REFERENCES grievances(id) ON DELETE CASCADE, author_id TEXT,
  text TEXT NOT NULL, check_json TEXT, created_at TEXT NOT NULL
);
`)

// ───────────────────────── 시드 ─────────────────────────
const seed = JSON.parse(readFileSync(join(here, 'seed.json'), 'utf8'))
const demoAccounts = [
  { name: '이하영', display: '이하영 과장', role: 'captain', rank: '신임 공사 A파트장', pin: '0000' },
  { name: '정소장', display: '정○○ 소장', role: 'leader', rank: 'B현장 현장소장 (리더 수료)', pin: '0000' },
  { name: '윤팀장', display: '윤○○ 팀장', role: 'leader', rank: '본사 스마트안전팀장 (리더 수료)', pin: '0000' },
  { name: '한팀장', display: '한○○ 팀장', role: 'leader', rank: '본사 공무팀장 (리더 수료)', pin: '0000' },
]
const nowIso = () => new Date().toISOString()
const hashPin = (pin, salt) => scryptSync(String(pin), salt, 32).toString('hex')

function seedAll() {
  const insUser = db.prepare('INSERT OR IGNORE INTO users (id,name,display,role,rank,pin_hash,salt,created_at) VALUES (?,?,?,?,?,?,?,?)')
  for (const a of demoAccounts) {
    const salt = randomBytes(8).toString('hex')
    insUser.run(randomUUID(), a.name, a.display, a.role, a.rank, hashPin(a.pin, salt), salt, nowIso())
  }
  const insCase = db.prepare('INSERT OR IGNORE INTO cases (id,title,situation,solution,author_rank,helpful,keywords_json,lens_preset_id,scenario_id,origin,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
  for (const c of seed.cases) insCase.run(c.id, c.title, c.situation, c.solution, c.authorRank, c.helpful, JSON.stringify(c.keywords), c.lensPresetId ?? null, c.scenarioId ?? null, 'seed', nowIso())
  const insPost = db.prepare('INSERT OR IGNORE INTO posts (id,dept,author,title,excerpt,replies,origin,created_at) VALUES (?,?,?,?,?,?,?,?)')
  for (const p of seed.communityPosts) insPost.run(p.id, p.dept, p.author, p.title, p.excerpt, p.replies, 'seed', nowIso())
  const insG = db.prepare('INSERT OR IGNORE INTO grievances (id,source,from_label,dept,content,env_json,received_at,origin,created_at) VALUES (?,?,?,?,?,?,?,?,?)')
  for (const g of seed.grievances) insG.run(g.id, g.source, g.from, g.dept, g.content, g.envData ? JSON.stringify(g.envData) : null, g.receivedAt, 'seed', nowIso())
}
seedAll()

// ───────────────────────── 유틸 ─────────────────────────
const app = express()
app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map((s) => s.trim()), credentials: false }))
app.use(express.json({ limit: '2mb' }))

const q = {
  userByName: db.prepare('SELECT * FROM users WHERE name = ?'),
  userById: db.prepare('SELECT * FROM users WHERE id = ?'),
  session: db.prepare('SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?'),
  stateOf: db.prepare('SELECT state_json, updated_at FROM user_state WHERE user_id = ?'),
}
const publicUser = (u) => ({ id: u.id, name: u.name, display: u.display, role: u.role, rank: u.rank })
const bearer = (req) => (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '') || null
function currentUser(req) {
  const t = bearer(req)
  return t ? (q.session.get(t) ?? null) : null
}
function requireAuth(req, res, next) {
  const u = currentUser(req)
  if (!u) return res.status(401).json({ error: '로그인이 필요합니다.' })
  req.user = u
  next()
}
function requireLeader(req, res, next) {
  if (req.user.role !== 'leader') return res.status(403).json({ error: "'리더' 직급(수료자)만 할 수 있습니다." })
  next()
}
const relTime = (iso) => {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0')
  return `${mm}/${dd} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
const looksLikePersonalInfo = (t) => /(\d{2,3}-\d{3,4}-\d{4})|(\d{6}-\d{7})|(@[\w.-]+\.\w+)/.test(t)

// ───────────────────────── 헬스 ─────────────────────────
app.get('/api/health', (_req, res) => {
  const users = db.prepare('SELECT COUNT(*) AS n FROM users').get().n
  const cases = db.prepare('SELECT COUNT(*) AS n FROM cases').get().n
  const grievances = db.prepare('SELECT COUNT(*) AS n FROM grievances').get().n
  res.json({ ok: true, name: 'captain-class-api', version: VERSION, time: nowIso(), counts: { users, cases, grievances } })
})

// ───────────────────────── 인증 ─────────────────────────
app.post('/api/auth/login', (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  const pin = String(req.body?.pin ?? '').trim()
  const display = String(req.body?.display ?? '').trim()
  if (name.length < 2 || name.length > 20) return res.status(400).json({ error: '이름은 2~20자로 입력하세요.' })
  if (!/^\d{4}$/.test(pin)) return res.status(400).json({ error: 'PIN은 숫자 4자리입니다.' })
  let user = q.userByName.get(name)
  let created = false
  if (!user) {
    const salt = randomBytes(8).toString('hex')
    const id = randomUUID()
    db.prepare('INSERT INTO users (id,name,display,role,rank,pin_hash,salt,created_at) VALUES (?,?,?,?,?,?,?,?)').run(id, name, display || `${name} 캡틴`, 'captain', '신임 리더', hashPin(pin, salt), salt, nowIso())
    user = q.userById.get(id)
    created = true
    if (req.body?.initialState && typeof req.body.initialState === 'object') {
      db.prepare('INSERT INTO user_state (user_id,state_json,updated_at) VALUES (?,?,?)').run(id, JSON.stringify(req.body.initialState), nowIso())
    }
  } else {
    const ok = timingSafeEqual(Buffer.from(hashPin(pin, user.salt), 'hex'), Buffer.from(user.pin_hash, 'hex'))
    if (!ok) return res.status(401).json({ error: 'PIN이 맞지 않습니다.' })
  }
  const token = randomBytes(24).toString('hex')
  db.prepare('INSERT INTO sessions (token,user_id,created_at) VALUES (?,?,?)').run(token, user.id, nowIso())
  const st = q.stateOf.get(user.id)
  res.json({ token, user: publicUser(user), created, state: st ? JSON.parse(st.state_json) : null, stateUpdatedAt: st?.updated_at ?? null })
})

app.post('/api/auth/logout', requireAuth, (req, res) => {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(bearer(req))
  res.json({ ok: true })
})

app.get('/api/me', requireAuth, (req, res) => {
  const st = q.stateOf.get(req.user.id)
  res.json({ user: publicUser(req.user), state: st ? JSON.parse(st.state_json) : null, stateUpdatedAt: st?.updated_at ?? null })
})

app.put('/api/me/state', requireAuth, (req, res) => {
  const state = req.body?.state
  if (!state || typeof state !== 'object') return res.status(400).json({ error: 'state 객체가 필요합니다.' })
  const json = JSON.stringify(state)
  if (json.length > 1_500_000) return res.status(413).json({ error: '상태가 너무 큽니다.' })
  const at = nowIso()
  db.prepare('INSERT INTO user_state (user_id,state_json,updated_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET state_json=excluded.state_json, updated_at=excluded.updated_at').run(req.user.id, json, at)
  res.json({ updatedAt: at })
})

// ───────────────────────── P난처 ─────────────────────────
function caseRow(c, me) {
  const solutions = db.prepare('SELECT id, author_name AS authorName, author_rank AS authorRank, text, created_at AS createdAt FROM solutions WHERE case_id = ? ORDER BY created_at ASC').all(c.id)
  const voted = me ? !!db.prepare('SELECT 1 FROM case_votes WHERE case_id = ? AND user_id = ?').get(c.id, me.id) : false
  return {
    id: c.id, title: c.title, situation: c.situation, solution: c.solution, authorRank: c.author_rank, helpful: c.helpful,
    keywords: JSON.parse(c.keywords_json), lensPresetId: c.lens_preset_id ?? undefined, scenarioId: c.scenario_id ?? undefined,
    origin: c.origin, createdAt: c.created_at, solutions, votedByMe: voted, mine: !!(me && c.author_id === me.id),
  }
}
app.get('/api/cases', (req, res) => {
  const me = currentUser(req)
  const rows = db.prepare("SELECT * FROM cases ORDER BY origin = 'seed' DESC, created_at DESC").all()
  res.json({ cases: rows.map((c) => caseRow(c, me)) })
})
app.post('/api/cases', requireAuth, (req, res) => {
  const text = String(req.body?.text ?? '').trim()
  if (text.length < 5) return res.status(400).json({ error: '상황을 5자 이상 적어 주세요.' })
  if (looksLikePersonalInfo(text)) return res.status(400).json({ error: '연락처·이메일로 보이는 문자열이 있습니다. 개인정보를 지워 주세요.' })
  const id = `uc-${randomUUID().slice(0, 8)}`
  const title = text.length > 28 ? text.slice(0, 28).trim() + '…' : text
  const keywords = [...new Set(tokenize(text))].slice(0, 12)
  db.prepare('INSERT INTO cases (id,title,situation,solution,author_rank,helpful,keywords_json,lens_preset_id,scenario_id,origin,author_id,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(id, title, text, '', `${req.user.display} (솔루션 대기)`, 0, JSON.stringify(keywords), null, null, 'user', req.user.id, nowIso())
  res.status(201).json({ case: caseRow(db.prepare('SELECT * FROM cases WHERE id = ?').get(id), req.user) })
})
app.post('/api/cases/:id/helpful', requireAuth, (req, res) => {
  const c = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id)
  if (!c) return res.status(404).json({ error: '사례가 없습니다.' })
  const has = db.prepare('SELECT 1 FROM case_votes WHERE case_id = ? AND user_id = ?').get(c.id, req.user.id)
  if (has) {
    db.prepare('DELETE FROM case_votes WHERE case_id = ? AND user_id = ?').run(c.id, req.user.id)
    db.prepare('UPDATE cases SET helpful = MAX(0, helpful - 1) WHERE id = ?').run(c.id)
  } else {
    db.prepare('INSERT INTO case_votes (case_id,user_id) VALUES (?,?)').run(c.id, req.user.id)
    db.prepare('UPDATE cases SET helpful = helpful + 1 WHERE id = ?').run(c.id)
  }
  const after = db.prepare('SELECT helpful FROM cases WHERE id = ?').get(c.id)
  res.json({ helpful: after.helpful, votedByMe: !has })
})
app.post('/api/cases/:id/solutions', requireAuth, requireLeader, (req, res) => {
  const c = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id)
  if (!c) return res.status(404).json({ error: '사례가 없습니다.' })
  const text = String(req.body?.text ?? '').trim()
  if (text.length < 10) return res.status(400).json({ error: '솔루션은 10자 이상 적어 주세요.' })
  const id = `sol-${randomUUID().slice(0, 8)}`
  db.prepare('INSERT INTO solutions (id,case_id,author_id,author_name,author_rank,text,created_at) VALUES (?,?,?,?,?,?,?)').run(id, c.id, req.user.id, req.user.display, req.user.rank, text, nowIso())
  if (c.origin === 'user' && !c.solution) db.prepare('UPDATE cases SET author_rank = ? WHERE id = ?').run(`${req.user.display} 솔루션`, c.id)
  res.status(201).json({ case: caseRow(db.prepare('SELECT * FROM cases WHERE id = ?').get(c.id), req.user) })
})

app.get('/api/posts', (_req, res) => {
  const rows = db.prepare("SELECT id, dept, author, title, excerpt, replies, origin, created_at AS createdAt FROM posts ORDER BY origin = 'seed' DESC, created_at DESC").all()
  res.json({ posts: rows })
})
app.post('/api/posts', requireAuth, requireLeader, (req, res) => {
  const title = String(req.body?.title ?? '').trim(), excerpt = String(req.body?.excerpt ?? '').trim()
  if (title.length < 3 || excerpt.length < 5) return res.status(400).json({ error: '제목 3자, 내용 5자 이상 적어 주세요.' })
  const id = `up-${randomUUID().slice(0, 8)}`
  db.prepare('INSERT INTO posts (id,dept,author,title,excerpt,replies,origin,author_id,created_at) VALUES (?,?,?,?,?,?,?,?,?)').run(id, req.user.rank.split(' ')[0] || '리더', req.user.display, title, excerpt, 0, 'user', req.user.id, nowIso())
  res.status(201).json({ post: db.prepare('SELECT id, dept, author, title, excerpt, replies, origin, created_at AS createdAt FROM posts WHERE id = ?').get(id) })
})

// ───────────────────────── 익명 브릿지 ─────────────────────────
function grievanceRow(g, me) {
  const answers = db.prepare('SELECT id, text, check_json, created_at AS createdAt, author_id FROM answers WHERE grievance_id = ? ORDER BY created_at ASC').all(g.id)
  return {
    id: g.id, source: g.source, from: g.from_label, dept: g.dept, content: g.content,
    envData: g.env_json ? JSON.parse(g.env_json) : undefined, receivedAt: g.received_at, origin: g.origin,
    mine: !!(me && g.author_id === me.id),
    answers: answers.map((a) => ({ id: a.id, text: a.text, check: a.check_json ? JSON.parse(a.check_json) : undefined, createdAt: a.createdAt, mine: !!(me && a.author_id === me.id) })),
  }
}
app.get('/api/grievances', (req, res) => {
  const me = currentUser(req)
  const rows = db.prepare('SELECT * FROM grievances ORDER BY created_at DESC').all()
  res.json({ grievances: rows.map((g) => grievanceRow(g, me)) })
})
app.post('/api/grievances', requireAuth, (req, res) => {
  const content = String(req.body?.content ?? '').trim()
  const dept = String(req.body?.dept ?? '').trim() || '소속 비공개'
  const source = req.body?.source === 'voice' ? 'voice' : 'text'
  if (content.length < 10) return res.status(400).json({ error: '고충은 10자 이상 적어 주세요.' })
  if (looksLikePersonalInfo(content)) return res.status(400).json({ error: '연락처·이메일로 보이는 문자열이 있습니다. 익명성을 위해 지워 주세요.' })
  const id = `ug-${randomUUID().slice(0, 8)}`
  const env = req.body?.envData && typeof req.body.envData === 'object' ? JSON.stringify(req.body.envData) : null
  db.prepare('INSERT INTO grievances (id,source,from_label,dept,content,env_json,received_at,origin,author_id,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .run(id, source, source === 'voice' ? '작업자 (익명)' : '구성원 (익명)', dept, content, env, relTime(nowIso()), 'user', req.user.id, nowIso())
  res.status(201).json({ grievance: grievanceRow(db.prepare('SELECT * FROM grievances WHERE id = ?').get(id), req.user) })
})
app.post('/api/grievances/:id/answers', requireAuth, (req, res) => {
  const g = db.prepare('SELECT * FROM grievances WHERE id = ?').get(req.params.id)
  if (!g) return res.status(404).json({ error: '고충이 없습니다.' })
  if (g.author_id === req.user.id) return res.status(400).json({ error: '본인이 보낸 고충에는 답할 수 없습니다.' })
  const text = String(req.body?.text ?? '').trim()
  if (text.length < 10) return res.status(400).json({ error: '답변은 10자 이상 적어 주세요.' })
  const check = coachingCheck(text)
  const id = `ans-${randomUUID().slice(0, 8)}`
  db.prepare('INSERT INTO answers (id,grievance_id,author_id,text,check_json,created_at) VALUES (?,?,?,?,?,?)').run(id, g.id, req.user.id, text, JSON.stringify(check), nowIso())
  res.status(201).json({ grievance: grievanceRow(g, req.user), check })
})

// ───────────────────────── 랭킹 ─────────────────────────
app.get('/api/leaderboard', (_req, res) => {
  const rows = db.prepare('SELECT u.display, u.role, u.rank, s.state_json FROM user_state s JOIN users u ON u.id = s.user_id').all()
  const board = rows.map((r) => {
    let st = {}
    try { st = JSON.parse(r.state_json) } catch { /* ignore */ }
    const mileage = Array.isArray(st.mileage) ? st.mileage.reduce((a, m) => a + (Number(m.points) || 0), 0) : 0
    const records = ['signalNotes', 'beforeAfters', 'practiceLogs', 'interviewNotes', 'agreements', 'consultAnswers'].reduce((a, k) => a + (Array.isArray(st[k]) ? st[k].length : 0), 0)
    return { display: r.display, role: r.role, rank: r.rank, mileage, records, week: Number(st.demoWeek ?? 0), practices: Array.isArray(st.practiceResults) ? st.practiceResults.length : 0 }
  }).sort((a, b) => b.mileage - a.mileage || b.records - a.records).slice(0, 20)
  res.json({ board })
})

// ───────────────────────── 규칙 기반 AI (서버판) ─────────────────────────
app.post('/api/ai/classify', (req, res) => res.json({ type: classifyReply(String(req.body?.text ?? '')), note: '규칙 기반 목업 · 참고용' }))
app.post('/api/ai/coach', (req, res) => res.json({ check: coachingCheck(String(req.body?.text ?? '')), note: '규칙 기반 목업 · 참고용' }))

// ───────────────────────── 관리 ─────────────────────────
app.post('/api/admin/reset', (req, res) => {
  if (!ADMIN_KEY || req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(403).json({ error: '관리 키가 필요합니다.' })
  db.exec('DELETE FROM answers; DELETE FROM grievances; DELETE FROM solutions; DELETE FROM case_votes; DELETE FROM cases; DELETE FROM posts; DELETE FROM user_state; DELETE FROM sessions; DELETE FROM users;')
  seedAll()
  res.json({ ok: true })
})

app.use('/api', (_req, res) => res.status(404).json({ error: 'API 경로가 없습니다.' }))
app.use('/api', (err, _req, res, _next) => {
  console.error(err)
  res.status(err?.type === 'entity.parse.failed' ? 400 : 500).json({ error: err?.message ?? '서버 오류' })
})

// ───────────────────────── 정적 프론트 ─────────────────────────
const dist = join(root, 'dist')
if (existsSync(join(dist, 'index.html'))) {
  app.use(express.static(dist, { index: 'index.html', maxAge: '1h' }))
  app.get('/', (_req, res) => res.sendFile(join(dist, 'index.html')))
} else {
  app.get('/', (_req, res) => res.type('text').send('captain-class api · dist/ 가 없어 프론트는 서빙하지 않습니다. npm run build 후 다시 시작하세요.'))
}

app.listen(PORT, HOST, () => {
  console.log(`[captain-class] API http://${HOST}:${PORT}/api/health  · DB ${DB_PATH}  · CORS ${CORS_ORIGIN}`)
})
