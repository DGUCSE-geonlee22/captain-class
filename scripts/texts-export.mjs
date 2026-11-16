/**
 * 데모 페이지의 모든 한국어 텍스트를 수정 가능한 파일로 내보낸다.
 *
 *   npm run texts:export
 *
 * 생성 파일 (texts/ 폴더)
 *   - cc-texts.txt       : "T0001 | 문장" 형식. 오른쪽 문장만 고쳐서 돌려주면 된다.
 *   - cc-texts.csv       : 같은 내용을 표로 (ID, 화면, 원문, 수정본). 엑셀·구글 시트에서 '수정본' 열만 채우면 된다.
 *   - cc-texts.map.json  : 각 ID가 소스 어디에 있는지 (적용 스크립트가 쓴다. 손대지 말 것)
 *
 * 되돌려 받은 파일은 `npm run texts:apply -- <파일>` 로 소스에 반영한다.
 */
import { parse } from '@babel/parser'
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'texts')
mkdirSync(outDir, { recursive: true })

/** 화면 이름 (팀원이 알아볼 수 있게) */
const labels = {
  'src/pages/HomePage.tsx': '홈',
  'src/components/Layout.tsx': '공통 · 헤더·푸터·P난처 버튼',
  'src/components/LoginDialog.tsx': '공통 · 로그인 창',
  'src/components/ui.tsx': '공통 · UI 부품(AI 안내 문구 등)',
  'src/components/Curriculum.tsx': '공통 · 주차 눈금',
  'src/components/Video.tsx': '공통 · 강의 영상 플레이어',
  'src/components/LeaderCard.tsx': '공통 · 리더 카드',
  'src/components/LeaderArt.tsx': '공통 · 리더 일러스트',
  'src/components/HeroScene.tsx': '홈 · 배경 장면',
  'src/components/ForestScene.tsx': 'P난처 · 배경 장면',
  'src/pages/CurriculumPage.tsx': '커리큘럼',
  'src/pages/WeekPage.tsx': '커리큘럼 · 주차 강의실',
  'src/pages/CoursesPage.tsx': '5C 코스 목록',
  'src/pages/CourseDetailPage.tsx': '5C 코스 상세',
  'src/pages/construction/DiagnosisPage.tsx': 'Construction · 2축 자기진단 + 딜레마 진단',
  'src/pages/construction/FieldMissionPage.tsx': 'Construction · 현장 첫 마디',
  'src/pages/compassion/ReframingPage.tsx': 'Compassion · Reframing',
  'src/pages/compassion/LensPage.tsx': 'Compassion · 관점 렌즈',
  'src/pages/PracticePage.tsx': 'Collab+Comm · 캡틴 대화 연습실',
  'src/pages/collab/CoachingPage.tsx': 'Collab+Comm · 반려문 코칭',
  'src/pages/collab/PulsePage.tsx': 'Collab+Comm · 펄스 카드',
  'src/pages/BridgePage.tsx': '익명 브릿지 (고충·상담·매칭)',
  'src/pages/leadership/LeadersPage.tsx': 'Charisma+Character · 리더 카드 도감',
  'src/pages/leadership/LeaderAIPage.tsx': 'Charisma+Character · 리더 AI',
  'src/pages/leadership/CoachingSessionPage.tsx': 'Coaching · 코칭 면담',
  'src/pages/leadership/GrowthPlanPage.tsx': 'Coaching · 성장 기록',
  'src/pages/PnancheoPage.tsx': 'P난처',
  'src/pages/RecordsPage.tsx': '내 기록',
  'src/pages/CompletionPage.tsx': '수료·마일리지',
  'src/pages/NotFoundPage.tsx': '없는 페이지',
  'src/App.tsx': '앱 라우팅',
  'src/main.tsx': '앱 진입',
  'src/context/AppContext.tsx': '공통 · 상태·마일리지 메시지',
  'src/data/courses.ts': '데이터 · 5C 코스 소개·교육 철학',
  'src/data/lectures.ts': '데이터 · 주차별 강의(제목·강사·요약·챕터·노트)',
  'src/data/journey.ts': '데이터 · 단계·주차 계획·현업 과제',
  'src/data/construction.ts': '데이터 · Construction 진단 문항·딜레마',
  'src/data/logs.ts': '데이터 · AI 경고 로그(Reframing)',
  'src/data/lensPresets.ts': '데이터 · 관점 렌즈 질문',
  'src/data/scenarios.ts': '데이터 · 대화 연습실 시나리오',
  'src/data/pulseCards.ts': '데이터 · 펄스 카드',
  'src/data/hints.ts': '데이터 · 대화 연습실 힌트',
  'src/data/bridge.ts': '데이터 · 익명 고충·부서 리더 프로필',
  'src/data/cases.ts': '데이터 · P난처 사례',
  'src/data/leaders.ts': '데이터 · 리더 24명 프로필',
  'src/data/coaching.ts': '데이터 · 코칭 질문·기준표·성장 기록 예시',
  'src/data/team.ts': '데이터 · 회사·팀원·이하영 프로필',
  'src/data/classes.ts': '데이터 · 마일리지 항목',
  'src/data/types.ts': '데이터 · 타입(주석)',
  'src/lib/mockAI.ts': 'AI 규칙(화면) · 분류·코칭 답변 문장',
  'src/lib/leaderAdvice.ts': 'AI 규칙 · 리더 AI 조언 문장',
  'src/lib/shared.ts': 'AI 규칙 · 공통',
  'src/lib/weekProgress.ts': '공통 · 주차 상태 라벨',
  'src/lib/api.ts': '공통 · 서버 통신 메시지',
  'server/rules.mjs': 'AI 규칙(서버) · mockAI.ts와 같은 내용을 유지해야 함',
}
const order = Object.keys(labels)

const hasKo = (s) => /[ㄱ-ㆎ가-힣]/.test(s)

function listFiles(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...listFiles(p))
    else if (/\.(ts|tsx)$/.test(name)) out.push(p)
  }
  return out
}
const files = [...listFiles(join(root, 'src')), join(root, 'server', 'rules.mjs')]
  .map((f) => relative(root, f).split(sep).join('/'))
  .sort((a, b) => {
    const ia = order.indexOf(a), ib = order.indexOf(b)
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b)
  })

const entries = []
let seq = 0
const nextId = () => `T${String(++seq).padStart(4, '0')}`

for (const file of files) {
  const code = readFileSync(join(root, file), 'utf8')
  let ast
  try {
    ast = parse(code, { sourceType: 'module', plugins: file.endsWith('.mjs') ? ['jsx'] : ['typescript', 'jsx'], ranges: true, attachComment: false, errorRecovery: true })
  } catch (e) {
    console.error(`parse failed: ${file}: ${e.message}`)
    continue
  }
  const found = []
  const walk = (node, parent) => {
    if (!node || typeof node.type !== 'string') return
    switch (node.type) {
      case 'ImportDeclaration':
      case 'ExportAllDeclaration':
        return
      case 'StringLiteral': {
        if (parent && parent.type === 'ExportNamedDeclaration') return
        if (parent && (parent.type === 'ObjectProperty' || parent.type === 'ClassProperty') && parent.key === node) return
        if (parent && parent.type === 'TSLiteralType') return
        const text = node.value
        if (!hasKo(text)) return
        const raw = code.slice(node.start, node.end)
        const isAttr = parent && parent.type === 'JSXAttribute'
        found.push({ kind: isAttr ? 'jsxattr' : 'str', start: node.start + 1, end: node.end - 1, full: [node.start, node.end], quote: raw[0], text: isAttr ? raw.slice(1, -1) : text })
        return
      }
      case 'TemplateLiteral': {
        node.quasis.forEach((q) => {
          const text = q.value.cooked ?? q.value.raw
          if (!hasKo(text)) return
          found.push({ kind: 'tpl', start: q.start, end: q.end, text })
        })
        node.expressions.forEach((e) => walk(e, node))
        return
      }
      case 'JSXText': {
        const rawText = node.value
        if (!hasKo(rawText)) return
        const lead = rawText.length - rawText.trimStart().length
        const trail = rawText.length - rawText.trimEnd().length
        const text = rawText.slice(lead, rawText.length - trail)
        found.push({ kind: 'jsx', start: node.start + lead, end: node.end - trail, text })
        return
      }
    }
    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'range' || key === 'leadingComments' || key === 'trailingComments' || key === 'innerComments') continue
      const v = node[key]
      if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === 'string' && walk(c, node))
      else if (v && typeof v.type === 'string') walk(v, node)
    }
  }
  walk(ast.program, null)
  found.sort((a, b) => a.start - b.start)
  for (const f of found) {
    const line = code.slice(0, f.start).split('\n').length
    entries.push({ id: nextId(), file, line, ...f })
  }
}

/** 화면 표시용 문장: 줄바꿈은 \n 으로, JSX 텍스트의 공백·줄바꿈은 한 칸으로 */
const display = (e) => (e.kind === 'jsx' ? e.text.replace(/\s+/g, ' ') : e.text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n'))

const generatedAt = new Date().toISOString()
const stamp = generatedAt.slice(0, 16).replace('T', ' ')

// ---- txt ----
let txt = `CC (Captain Class) 데모 페이지 텍스트 전체 · 내보낸 시각 ${stamp}\n`
txt += `\n[고치는 법]\n`
txt += `- 각 줄은 "번호 | 문장" 입니다. 세로줄(|) 오른쪽 문장만 고치세요. 번호와 세로줄은 그대로 둡니다.\n`
txt += `- 고치지 않을 줄은 그대로 두면 됩니다. 줄을 지우지 마세요 (지우면 '변경 없음'으로 봅니다).\n`
txt += `- 문장 안에서 줄을 바꾸고 싶으면 \\n 을 적으세요. 한 항목은 한 줄로 유지합니다.\n`
txt += `- 같은 문장이 여러 화면에 있으면 각각 따로 나옵니다. 모두 고쳐 주세요.\n`
txt += `- 문장이 조각나 보이는 줄(예: "이 답하고, 업무를 직접 나눕니다.")은 화면에서 굵은 글씨·숫자 등으로 나뉜 부분입니다. 조각 안에서만 고치세요.\n`
txt += `- 'AI 규칙(서버)'는 화면용 AI 규칙과 같은 문장을 유지해야 합니다. 한쪽을 고치면 다른 쪽도 고쳐 주세요.\n`
txt += `- 다 고친 뒤 이 파일을 그대로 돌려주면 됩니다. (ID 기준: ${generatedAt})\n`
let curFile = ''
for (const e of entries) {
  if (e.file !== curFile) {
    curFile = e.file
    txt += `\n\n===== ${labels[e.file] ?? e.file}  (${e.file}) =====\n`
  }
  txt += `${e.id} | ${display(e)}\n`
}
writeFileSync(join(outDir, 'cc-texts.txt'), txt, 'utf8')

// ---- csv (UTF-8 BOM, 엑셀·구글시트용) ----
const q = (s) => `"${String(s).replace(/"/g, '""')}"`
let csv = '﻿' + ['ID', '화면', '파일', '원문', '수정본'].map(q).join(',') + '\n'
for (const e of entries) csv += [e.id, labels[e.file] ?? e.file, e.file, display(e), ''].map(q).join(',') + '\n'
writeFileSync(join(outDir, 'cc-texts.csv'), csv, 'utf8')

// ---- map ----
writeFileSync(join(outDir, 'cc-texts.map.json'), JSON.stringify({ generatedAt, entries: entries.map((e) => ({ id: e.id, file: e.file, line: e.line, kind: e.kind, start: e.start, end: e.end, full: e.full, quote: e.quote, text: e.text, display: display(e) })) }, null, 1), 'utf8')

const perFile = {}
for (const e of entries) perFile[e.file] = (perFile[e.file] ?? 0) + 1
console.log(`${entries.length}개 문장을 ${Object.keys(perFile).length}개 파일에서 내보냈습니다 → texts/cc-texts.txt, texts/cc-texts.csv`)
