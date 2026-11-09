/**
 * API 통합 테스트 (서버가 떠 있어야 함): node server/test-api.mjs [baseUrl]
 * 두 캡틴과 한 리더로 로그인해 P난처·익명 브릿지·상태 동기화·랭킹을 끝까지 확인한다.
 */
const BASE = process.argv[2] ?? 'http://localhost:8787'
let fails = 0
const ok = (cond, label, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? '  · ' + extra : ''}`)
  if (!cond) fails++
}
async function call(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(BASE + path, { method, headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined })
  const text = await res.text()
  return { status: res.status, data: text ? JSON.parse(text) : {} }
}
const login = (name, pin, extra = {}) => call('/api/auth/login', { method: 'POST', body: { name, pin, ...extra } })

const h = await call('/api/health')
ok(h.status === 200 && h.data.ok, 'health', JSON.stringify(h.data.counts))

const a = await login('이하영', '0000')
ok(a.status === 200 && a.data.user.name === '이하영' && a.data.created === false, '시드 캡틴 로그인', a.data.user?.rank)
const bad = await login('이하영', '1111')
ok(bad.status === 401, '잘못된 PIN 거부', bad.data.error)
const l = await login('정소장', '0000')
ok(l.status === 200 && l.data.user.role === 'leader', '시드 리더 로그인', l.data.user?.display)
const n = await login('테스트캡틴', '1234', { display: '테스트 캡틴', initialState: { demoWeek: 3, mileage: [{ points: 15 }] } })
ok(n.status === 200 && n.data.created === true && n.data.user.role === 'captain', '새 사용자 자동 가입 + 초기 상태 저장')
const n2 = await login('테스트캡틴', '1234')
ok(n2.status === 200 && n2.data.created === false && n2.data.state?.demoWeek === 3, '재로그인 시 저장된 상태 반환')
const A = a.data.token, L = l.data.token, N = n.data.token

// P난처
const c0 = await call('/api/cases', { token: A })
ok(c0.status === 200 && c0.data.cases.length >= 9, '사례 목록', `${c0.data.cases.length}건`)
const nc = await call('/api/cases', { method: 'POST', token: A, body: { text: '입사동기한테 작업 지시하는 게 너무 어색합니다' } })
ok(nc.status === 201 && nc.data.case.origin === 'user' && nc.data.case.mine, '캡틴 새 상황 등록', nc.data.case?.title)
const cid = nc.data.case.id
const pi = await call('/api/cases', { method: 'POST', token: A, body: { text: '제 번호 010-1234-5678로 연락 주세요' } })
ok(pi.status === 400, '개인정보 포함 등록 거부', pi.data.error)
const forb = await call(`/api/cases/${cid}/solutions`, { method: 'POST', token: A, body: { text: '제가 직접 써 보는 솔루션입니다 충분히 길게' } })
ok(forb.status === 403, '캡틴의 솔루션 작성 403', forb.data.error)
const sol = await call(`/api/cases/${cid}/solutions`, { method: 'POST', token: L, body: { text: "첫 주에 둘만 만나 '관계는 동기, 일은 역할'을 합의했습니다." } })
ok(sol.status === 201 && sol.data.case.solutions.length === 1 && sol.data.case.solutions[0].authorName === '정○○ 소장', '리더 솔루션 등록')
const v1 = await call('/api/cases/case-helmet/helpful', { method: 'POST', token: A })
const v2 = await call('/api/cases/case-helmet/helpful', { method: 'POST', token: A })
ok(v1.data.votedByMe === true && v2.data.votedByMe === false && v2.data.helpful === v1.data.helpful - 1, '도움돼요 토글')
const seenByN = await call('/api/cases', { token: N })
const shared = seenByN.data.cases.find((c) => c.id === cid)
ok(shared && shared.solutions.length === 1 && shared.mine === false, '다른 사용자에게 새 상황·솔루션 공유됨')
const post = await call('/api/posts', { method: 'POST', token: L, body: { title: '야간 조명 기준 공유', excerpt: '조도 75lux 기준과 이동식 조명 요청 절차를 정리했습니다.' } })
ok(post.status === 201 && post.data.post.author === '정○○ 소장', '리더 커뮤니티 글')
const postForb = await call('/api/posts', { method: 'POST', token: A, body: { title: '캡틴 글', excerpt: '캡틴은 쓸 수 없어야 합니다' } })
ok(postForb.status === 403, '캡틴 커뮤니티 글 403')

// 익명 브릿지
const g = await call('/api/grievances', { method: 'POST', token: N, body: { content: '야간 타설 때 조명이 부족해서 발을 헛디딜 뻔했습니다. 말해도 다음 현장에서 보자고만 합니다.', dept: 'C파트 · 타설반', source: 'voice', envData: { temp: 12, hours: 6, zone: 'C구역 야간 타설' } } })
ok(g.status === 201 && g.data.grievance.from === '작업자 (익명)' && g.data.grievance.mine, '익명 고충 등록', g.data.grievance?.id)
const gid = g.data.grievance.id
const self = await call(`/api/grievances/${gid}/answers`, { method: 'POST', token: N, body: { text: '제가 제 고충에 답하는 건 막혀야 합니다.' } })
ok(self.status === 400, '본인 고충 답변 차단', self.data.error)
const ans = await call(`/api/grievances/${gid}/answers`, { method: 'POST', token: A, body: { text: '상황 공유 고맙습니다. 야간 조명 기준(조도 75lux)을 공무팀에 확인해서 내일까지 이동식 조명 2대를 요청하겠습니다. 다음 주 수요일에 같이 확인해요.' } })
ok(ans.status === 201 && ans.data.check.acknowledged && ans.data.check.specific && ans.data.check.direction, '답변 등록 + 코칭 3/3', JSON.stringify(ans.data.check))
const gl = await call('/api/grievances', { token: N })
const mineG = gl.data.grievances.find((x) => x.id === gid)
ok(mineG?.answers.length === 1 && mineG.answers[0].mine === false && !JSON.stringify(gl.data).includes('author_id'), '제보자에게 답변 보임 · 작성자 식별 정보 없음')
const glA = await call('/api/grievances', { token: A })
ok(glA.data.grievances.find((x) => x.id === gid)?.answers[0].mine === true, '답변자에게는 내 답변 표시')

// 상태 동기화 · 랭킹
const put = await call('/api/me/state', { method: 'PUT', token: A, body: { state: { demoWeek: 9, mileage: [{ points: 40 }, { points: 25 }], signalNotes: [1, 2], practiceResults: [1] } } })
ok(put.status === 200 && put.data.updatedAt, '상태 저장')
const me = await call('/api/me', { token: A })
ok(me.data.state?.demoWeek === 9 && me.data.user.name === '이하영', '상태 복원')
const lb = await call('/api/leaderboard')
ok(lb.status === 200 && lb.data.board[0]?.display === '이하영 과장' && lb.data.board[0].mileage === 65, '랭킹 1위 계산', JSON.stringify(lb.data.board.map((b) => [b.display, b.mileage])))
const ai = await call('/api/ai/classify', { method: 'POST', body: { text: '지금 몇 시간째 쉬지 않고 하신 거예요? 몸은 괜찮으세요?' } })
ok(ai.data.type === 'explore', 'AI 분류 엔드포인트', ai.data.type)
const noauth = await call('/api/me')
ok(noauth.status === 401, '비로그인 401')
const out = await call('/api/auth/logout', { method: 'POST', token: N })
const after = await call('/api/me', { token: N })
ok(out.status === 200 && after.status === 401, '로그아웃 후 토큰 무효')
const nf = await call('/api/nothing')
ok(nf.status === 404, '없는 API 404')

console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED')
process.exit(fails ? 1 : 0)
