import type { Course } from './types'

/**
 * 5C 코스 데이터.
 *
 * ▶ 뼈대 코스(Construction) 내용을 채우는 방법 — 리더십 축 두 코스는 장한이 님 문서 기준으로 채워짐
 *   1. 해당 코스의 `status`를 'skeleton' → 'ready'로 바꾼다.
 *   2. `lessons` 배열의 빈 카드(title: '레슨 N (준비 중)')를 실제 레슨으로 교체한다.
 *      - `path`를 지정하면 레슨 카드가 해당 라우트로 연결된다. 새 화면이 필요하면 src/pages에 만들고
 *        src/App.tsx 라우트에 등록한다.
 *   3. `description`에 코스 소개 문구를 넣는다. (현재는 확정된 한 줄 설명만 있음)
 *   4. 코스 프레임(`framework`: 목표·핵심 질문·교육 목적·중심/보조 요소)을 공감 축 형식에 맞춰 채우면
 *      코스 상세 화면 상단에 같은 형식으로 표시된다.
 *   5. 홈 항해 지도·커리큘럼의 배치 주차는 src/data/journey.ts에서 조정한다.
 */

/** 공감 축 교육 철학 (곽경은) */
export const compassionAxisPhilosophy = {
  statement: '현장의 목소리를 듣고 그들의 상황을 이해하는 것에서 출발하여, 이해한 내용을 존중하는 소통과 실질적인 협업 행동으로 연결한다.',
  steps: [
    { key: 'listen', label: '듣기', desc: '현장의 목소리를 듣는다', courseId: 'compassion' },
    { key: 'understand', label: '이해', desc: '작업자의 상황과 감정을 이해한다', courseId: 'compassion' },
    { key: 'communicate', label: '소통', desc: '이해한 것을 존중하는 말로 전달한다', courseId: 'collab-comm' },
    { key: 'act', label: '협업 행동', desc: '함께 해결하는 행동으로 잇는다', courseId: 'collab-comm' },
  ],
}

export const courses: Course[] = [
  {
    id: 'construction',
    name: 'Construction',
    nameKo: '기초',
    axis: 'foundation',
    axisLabel: '기초 역량',
    tagline: '현장 업종의 큰 흐름과 관리감독 역량의 기초',
    description: '',
    status: 'skeleton',
    owner: '주우상',
    lessons: [
      { id: 'cn-1', title: '레슨 1 (준비 중)', summary: '' },
      { id: 'cn-2', title: '레슨 2 (준비 중)', summary: '' },
      { id: 'cn-3', title: '레슨 3 (준비 중)', summary: '' },
    ],
  },
  {
    id: 'compassion',
    name: 'Compassion',
    nameKo: '공감',
    axis: 'compassion',
    axisLabel: '공감 축 · 구성원의 마음 이해',
    tagline: '현장 작업자의 입장에서 생각하기',
    description:
      'Compassion은 타인의 고통이나 불행에 대해 느끼는 강한 연민, 그리고 그들을 돕고자 하는 마음이다. 리더에게는 구성원의 고통을 함께 느끼고 함께 해결하려는 마음이 필요하며, 이는 관계가 단절되는 AI 시대에 더욱 중요하다. 이 코스에서는 부하직원이 겪을 수 있는 고통을 그 사람의 입장에서 이해하고 솔루션을 제시하는 방법을 익힌다.',
    status: 'ready',
    owner: '곽경은',
    framework: {
      goal: '현장 작업자의 입장에서 생각하기',
      keyQuestion: '현장 작업자는 왜 그렇게 행동했을까?',
      purpose: '작업자의 상황과 감정을 이해하고 성급한 판단 줄이기',
      coreLessonIds: ['cp-a', 'cp-b'],
      supportLessonIds: ['cp-c', 'cp-d'],
      flow: ['듣기', '이해'],
    },
    lessons: [
      { id: 'cp-a', title: '레슨 A. 현장 공감형 Reframing 훈련', summary: 'AI가 "안전모 미착용"을 위반 기록으로만 보여주지 않도록, 당시 작업 환경과 상황을 함께 보게 한다. 데이터 융합 → 로그 Reframing → 생각의 시간.', path: '/course/compassion/reframing' },
      { id: 'cp-b', title: '레슨 B. 관점 렌즈', summary: '리더가 상황을 입력하면 현장 작업자와 리더의 입장에서 각각 고려해야 할 질문을 제시한다. 자신의 관점만으로 판단하지 않게 한다.', path: '/course/compassion/lens' },
      { id: 'cp-c', title: '레슨 C. 타 파트 익명 상담 체험', summary: '다른 파트 구성원의 고충에 직접 답변을 써 본다. 데이터만으로는 알기 어려운 현장의 목소리를 듣는 보조 통로.', path: '/bridge?tab=consult' },
      { id: 'cp-d', title: '레슨 D. HRD 심리전문가 수업', summary: '정서 이해와 심리적 안전감에 관한 전문가 수업을 신청한다.', path: '/course/compassion/classes' },
    ],
  },
  {
    id: 'collab-comm',
    name: 'Collaboration + Communication',
    nameKo: '협업·소통',
    axis: 'compassion',
    axisLabel: '공감 축 · 이해를 소통으로 전달',
    tagline: '이해한 것을 소통과 행동으로 연결하기',
    description:
      '소규모 집단의 리더에게 필요한 협업·소통 역량을 키운다. 경청·전달력 같은 소프트 스킬과 회의 운영·피드백 같은 실무 역량을 다룬다. 질문을 피하고 AI에 의존하는 신입에게 사람이 어떻게 도움이 될 수 있는지도 다룬다. 전문가 강의 대신 AI 대화 연습실로 반복 훈련한다.',
    status: 'ready',
    owner: '곽경은',
    framework: {
      goal: '이해한 것을 소통과 행동으로 연결하기',
      keyQuestion: '내가 이해한 내용을 어떻게 전달하고 함께 해결할까?',
      purpose: '경청, 피드백, 의견 조율을 실제로 연습하기',
      coreLessonIds: ['cc-a', 'cc-d'],
      supportLessonIds: ['cc-b', 'cc-c', 'cc-e', 'cc-f'],
      flow: ['소통', '협업 행동'],
    },
    lessons: [
      { id: 'cc-a', title: '레슨 A. 캡틴 대화 연습실 (AI 공감 시뮬레이터)', summary: 'AI가 다양한 현장 작업자·팀원 역할을 맡고 리더가 직접 대화한다. 상대 반응에 따라 표현을 고쳐 다시 시도할 수 있고, 공감도·명확성·심리적 안전감 지수로 리포트를 받는다.', path: '/practice' },
      { id: 'cc-b', title: '레슨 B. 소프트 스킬·실무 퀵 테스트', summary: '경청·회의 운영·피드백 각 3문항.', path: '/course/collab-comm/quiz' },
      { id: 'cc-c', title: '레슨 C. 1:1 펄스 면담 질문 카드', summary: '팀원 지표와 함께 정서적 질문 카드를 골라 면담 준비 노트에 담는다.', path: '/course/collab-comm/pulse' },
      { id: 'cc-d', title: '레슨 D. 반려문 코칭과 비포/애프터 기록', summary: '피드백·지시문을 쓰면 명확성과 존중 여부를 3가지 포인트로 점검한다. 대필 없이 리더가 직접 고치고, 처음 문장과 수정본을 비교하며 소통 습관을 돌아본다.', path: '/course/collab-comm/coaching' },
      { id: 'cc-e', title: '레슨 E. 현장 직통 보이스', summary: '익명 음성 제보를 환경 데이터와 함께 읽고 개선 조치를 고른다.', path: '/course/collab-comm/voice' },
      { id: 'cc-f', title: '레슨 F. 브릿지 매칭', summary: '타 부서 리더와 15분 교환 인터뷰 뒤 협업 합의서를 쓴다. 서로 다른 업무 관점을 이해하는 보조 활동.', path: '/bridge?tab=matching' },
    ],
  },
  {
    id: 'charisma-character',
    name: 'Charisma + Character',
    nameKo: '카리스마·품격',
    axis: 'leadership',
    axisLabel: '리더십 축 · 스스로 판단하고 책임지는 리더',
    tagline: '다양한 리더의 관점에서 질문을 배우는 질문형 리더 AI',
    description:
      '리더 AI와의 대화가 일방적으로 방향과 조언을 주는 구조라면 AI의 답을 받아 적는 데 그쳐 리더의 품성을 배우는 방향에서 멀어진다. 카리스마는 남이 준 답을 따르는 데서가 아니라 스스로 판단하고 그 판단에 책임지고 실행하는 경험에서 쌓인다. 그래서 리더 AI는 유지하되, 위인·캐릭터를 정답을 주는 존재가 아니라 질문을 떠올리게 하는 안내자로 두고, 판단에 필요한 배경 지식과 참고 자료를 함께 제시한다.',
    status: 'ready',
    owner: '장한이',
    framework: {
      goal: '서둘러 결론 내리기 전에 먼저 묻고, 스스로 근거를 갖고 판단하기',
      keyQuestion: '흰수염이라면 무엇을 먼저 물었을까?',
      purpose: 'AI에 전적으로 기대지 않는 태도와 독립적으로 사고하는 능력 기르기',
      coreLessonIds: ['ch-a'],
      supportLessonIds: ['ch-b'],
      flow: ['판단'],
    },
    lessons: [
      { id: 'ch-a', title: '레슨 A. 질문형 리더 AI', summary: '상황을 적으면 흰수염·이순신 같은 안내자가 해결책 대신 먼저 물어야 할 것을 묻는다. 참고 자료(삼성물산 작업중지권 사례 등)를 함께 보고 리더가 방향을 정하면, 그 방향이 협력사·본사·작업자에게 미칠 영향을 다시 되묻는다.', path: '/course/charisma-character/leader-ai' },
      { id: 'ch-b', title: "레슨 B. 'AI에 맡길 일 / 내가 할 일' 기준표", summary: '이번 주 업무를 AI 위임 · AI 초안+확인 · 직접 수행으로 분류해 나의 AI 위임 기준표를 만든다. (Evaluate 단계 산출물)', path: '/course/charisma-character/delegation' },
    ],
  },
  {
    id: 'coaching',
    name: 'Coaching',
    nameKo: '코칭',
    axis: 'leadership',
    axisLabel: '리더십 축 · 올바른 길로 이끌기',
    tagline: '한국코치협회 연계 코칭 역량, 면담 전 정서적 질문 카드, 구성원의 성취 경험 기록',
    description:
      "리더십 축에서 Coaching이 맡는 역할의 핵심은 '올바른 길로 이끄는 것'이다. 이끈다는 것은 가야 할 길을 대신 정해 주는 것이 아니라, 팀원이 스스로 길을 찾도록 질문하고 찾아낸 길을 토대로 경험을 쌓아 경력으로 자리 잡게 하는 것이다. 한국코치협회 인증 연계는 유지하되 인증(자격)과 현장 코칭(실행)을 구분해, 리더가 실제 면담에서 코칭을 연습하고 쌓아 가는 기능을 둔다.",
    status: 'ready',
    owner: '장한이',
    framework: {
      goal: '팀원이 스스로 길을 찾도록 질문으로 이끌기',
      keyQuestion: '팀원이 스스로 답을 찾게 하려면 나는 무엇을 물어야 할까?',
      purpose: '인증과 현장 코칭을 구분해, 실제 면담에서 코칭 질문을 연습하고 성취 경험을 기록으로 쌓기',
      coreLessonIds: ['co-a', 'co-b'],
      supportLessonIds: ['co-c', 'co-d'],
      flow: ['이끌기'],
    },
    lessons: [
      { id: 'co-a', title: '레슨 A. 코칭 질문 연습', summary: "'야근해서라도 맞추세요' 같은 지시 대신, 팀원이 스스로 길을 찾게 하는 질문 3개를 쓴다. 질문인가·열린 질문인가·답을 정해 주지 않았는가를 점검한다.", path: '/course/coaching/questions' },
      { id: 'co-b', title: '레슨 B. 팀원 성취 경험 기록', summary: '팀원이 찾아낸 길을 문제 정의 · 근거 설명 · 도전 행동 · 다음 한 걸음으로 기록해 경력으로 이어 준다.', path: '/course/coaching/achievements' },
      { id: 'co-c', title: '레슨 C. 한국코치협회 인증 연계', summary: '인증 취득 시 CC 수료 가산점. 인증 준비 단계를 체크하며 질문 연습·성취 기록 누적을 근거로 삼는다.', path: '/course/coaching/achievements' },
      { id: 'co-d', title: '레슨 D. 면담 전 정서적 질문 카드', summary: '팀원 지표와 함께 정서적 질문 카드 3장을 고른다. (Collaboration+Communication 레슨 C와 공유)', path: '/course/collab-comm/pulse' },
    ],
  },
]

export const courseById = (id: string) => courses.find((c) => c.id === id)

export const axisMeta: Record<string, { label: string; color: string; bg: string; border: string; text: string }> = {
  compassion: { label: '공감 축', color: '#1F9E8F', bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-700' },
  leadership: { label: '리더십 축', color: '#1E2A4A', bg: 'bg-navy-50', border: 'border-navy-300', text: 'text-navy-700' },
  foundation: { label: '기초 역량', color: '#F28C28', bg: 'bg-safety-50', border: 'border-safety-300', text: 'text-safety-700' },
}
