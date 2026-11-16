/**
 * 팀원이 고쳐서 돌려준 텍스트 파일을 소스에 반영한다.
 *
 *   npm run texts:apply -- <고친 파일(.txt 또는 .csv)>
 *   npm run texts:apply -- texts/cc-texts.txt --dry   (적용하지 않고 바뀔 항목만 보기)
 *
 * texts/cc-texts.map.json (내보낼 때 생성)을 기준으로, 원문과 달라진 항목만 해당 위치에 써 넣는다.
 * 반영 뒤에는 npm run build 로 확인하고, 다시 내보내면(npm run texts:export) 새 기준 파일이 만들어진다.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const dry = args.includes('--dry')
const input = args.find((a) => !a.startsWith('--'))
if (!input) {
  console.error('사용법: npm run texts:apply -- <고친 파일.txt|.csv> [--dry]')
  process.exit(1)
}
const mapPath = join(root, 'texts', 'cc-texts.map.json')
if (!existsSync(mapPath)) {
  console.error('texts/cc-texts.map.json 이 없습니다. 먼저 npm run texts:export 를 실행하세요.')
  process.exit(1)
}
const map = JSON.parse(readFileSync(mapPath, 'utf8'))
const byId = new Map(map.entries.map((e) => [e.id, e]))

/** 입력 파일에서 {id → 새 문장} 읽기 */
function readEdits(path) {
  let raw = readFileSync(path, 'utf8')
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1)
  const edits = new Map()
  if (path.toLowerCase().endsWith('.csv')) {
    const rows = parseCsv(raw)
    const header = rows[0] ?? []
    const idCol = header.indexOf('ID'), newCol = header.indexOf('수정본'), oldCol = header.indexOf('원문')
    if (idCol < 0 || newCol < 0) throw new Error('CSV에 ID / 수정본 열이 없습니다')
    for (const r of rows.slice(1)) {
      const id = (r[idCol] ?? '').trim()
      const next = r[newCol] ?? ''
      if (!/^T\d{4}$/.test(id)) continue
      if (next.trim() === '') continue
      if (oldCol >= 0 && next === r[oldCol]) continue
      edits.set(id, next)
    }
  } else {
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^(T\d{4}) \| ?(.*)$/)
      if (!m) continue
      edits.set(m[1], m[2])
    }
  }
  return edits
}

function parseCsv(text) {
  const rows = []
  let row = [], cell = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++ } else inQ = false
      } else cell += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell); rows.push(row); row = []; cell = ''
    } else cell += c
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row) }
  return rows
}

/** 표시용 문장 → 실제 문자열 */
const fromDisplay = (kind, s) => (kind === 'jsx' ? s : s.replace(/\\n/g, '\n').replace(/\\\\/g, '\\'))

/** 소스에 넣을 때 따옴표 등을 이스케이프 */
function encode(e, text) {
  if (e.kind === 'str') {
    const q = e.quote
    return text.replace(/\\/g, '\\\\').replace(new RegExp(q, 'g'), '\\' + q).replace(/\n/g, '\\n')
  }
  if (e.kind === 'tpl') return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
  if (e.kind === 'jsxattr') {
    if (text.includes(e.quote) || text.includes('\n')) return { full: true, text: `{'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'}` }
    return text
  }
  if (e.kind === 'jsx') {
    if (/[{}<>]/.test(text)) return `{'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'}`
    return text
  }
  return text
}

const edits = readEdits(input)
const changes = []
const unknown = []
for (const [id, next] of edits) {
  const e = byId.get(id)
  if (!e) { unknown.push(id); continue }
  if (next === e.display) continue
  changes.push({ e, text: fromDisplay(e.kind, next), shown: next })
}
if (unknown.length) console.warn(`알 수 없는 ID ${unknown.length}개는 건너뜁니다: ${unknown.slice(0, 5).join(', ')}${unknown.length > 5 ? ' …' : ''}`)
if (!changes.length) {
  console.log('바뀐 문장이 없습니다.')
  process.exit(0)
}

const byFile = new Map()
for (const c of changes) {
  if (!byFile.has(c.e.file)) byFile.set(c.e.file, [])
  byFile.get(c.e.file).push(c)
}
let applied = 0
for (const [file, list] of byFile) {
  const path = join(root, file)
  let code = readFileSync(path, 'utf8')
  list.sort((a, b) => b.e.start - a.e.start)
  for (const { e, text, shown } of list) {
    const currentRaw = code.slice(e.start, e.end)
    const expected = e.kind === 'jsx' || e.kind === 'jsxattr' ? e.text : null
    // 원문이 그 자리에 그대로 있는지 확인 (내보낸 뒤 소스가 바뀌었으면 건너뜀)
    const ok = expected !== null ? currentRaw === expected : decodeRough(currentRaw) === e.text
    if (!ok) {
      console.warn(`  ! ${e.id} (${file}:${e.line}) 원문이 바뀌어 있어 건너뜁니다. 다시 내보낸 뒤 고쳐 주세요.`)
      continue
    }
    const enc = encode(e, text)
    if (typeof enc === 'object' && enc.full) code = code.slice(0, e.full[0]) + enc.text + code.slice(e.full[1])
    else code = code.slice(0, e.start) + enc + code.slice(e.end)
    applied++
    console.log(`  ${e.id} ${file}:${e.line}\n     - ${e.display}\n     + ${shown}`)
  }
  if (!dry) writeFileSync(path, code, 'utf8')
}
console.log(dry ? `\n(--dry) ${applied}개 항목이 바뀔 예정입니다. 적용하려면 --dry 없이 다시 실행하세요.` : `\n${applied}개 문장을 ${byFile.size}개 파일에 반영했습니다. npm run build 로 확인하세요.`)

/** 문자열 리터럴 원문 대략 복원 (이스케이프 해제) */
function decodeRough(raw) {
  return raw.replace(/\\n/g, '\n').replace(/\\(['"`\\])/g, '$1').replace(/\\\$\{/g, '${')
}
