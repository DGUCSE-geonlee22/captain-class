import type { Course } from './types'

/**
 * 5C 코스 데이터.
 *
 * ▶ 5개 코스 모두 담당자 문서 기준으로 채워짐 (Construction 주우상 · 공감 축 곽경은 · 리더십 축 장한이)
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
    nameKo: '기초 · 0주차 진단',
    axis: 'foundation',
    axisLabel: '기초 역량 · 0주차 사전 진단',
    tagline: '본 교육 1주 전, 나를 진단하고 현장에 첫 마디를 건네는 0주차',
    description:
      '원가·안전·공기 삼중 압박, 본사·현장·협력사 다단계 구조, 인력 세대교체, 기술과 사람 간 갈등 속에서 신임 현장 리더가 마주할 딜레마를 미리 인식한다. 단순 지적·단속형 관리에서 벗어나 AI 데이터를 현장의 정서적·환경적 맥락으로 재해석하는 인지적 공감력과, 본사·현장·협력업체 사이에서 리스크가 생기기 전에 설득·조율하는 실전 관리감독 능력을 기르는 출발점이다.',
    status: 'ready',
    owner: '주우상',
    framework: {
      goal: '신임 리더가 본인의 공감·리더십 성향을 객관적으로 파악하고, 현장의 실제 딜레마를 미리 인식한다',
      keyQuestion: '나는 모니터 앞에서 현장을 보고 있는가, 현장 바닥에서 보고 있는가?',
      purpose: '책상머리 교육에서 벗어나 현장 작업자와의 첫 대면 소통으로 실무 감각을 깨우는 브릿지',
      coreLessonIds: ['cn-a', 'cn-b'],
      supportLessonIds: [],
      flow: [],
    },
    lessons: [
      { id: 'cn-a', title: '레슨 A. 2축 자기진단 + 내 딜레마', summary: '건설 현장 상황 8가지에서 통제형(권위적)·회피형(착한 리더)·균형형 대응을 고르면 2축 점수와 12주 집중 보완 축이 나온다. 마지막에 내 파트와 가장 가까운 딜레마 하나를 골라 지금의 대응을 남긴다.', path: '/course/construction/diagnosis' },
      { id: 'cn-b', title: '레슨 B. 현장 실천 미션: 작업자 1명에게 첫 마디 건네기', summary: '"요즘 현장에서 작업하시면서 가장 힘든 일이나 애로사항이 무엇인가요?"라고 직접 묻고 반응을 기록한다. 현장 대면 소통 리포트는 Reframing 모듈로 연계된다.', path: '/course/construction/field-mission' },
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
      supportLessonIds: ['cp-c'],
      flow: ['듣기', '이해'],
    },
    lessons: [
      { id: 'cp-a', title: '레슨 A. 현장 공감형 Reframing 훈련', summary: 'AI가 "안전모 미착용"을 위반 기록으로만 보여주지 않도록, 당시 작업 환경과 상황을 함께 보게 한다. 데이터 융합 → 로그 Reframing → 생각의 시간.', path: '/course/compassion/reframing' },
      { id: 'cp-b', title: '레슨 B. 관점 렌즈', summary: '리더가 상황을 입력하면 현장 작업자와 리더의 입장에서 각각 고려해야 할 질문을 제시한다. 자신의 관점만으로 판단하지 않게 한다.', path: '/course/compassion/lens' },
      { id: 'cp-c', title: '레슨 C. 타 파트 익명 상담 체험', summary: '다른 파트 구성원의 고충에 직접 답변을 써 본다. 데이터만으로는 알기 어려운 현장의 목소리를 듣는 보조 통로.', path: '/bridge?tab=consult' },
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
      supportLessonIds: ['cc-c', 'cc-f'],
      flow: ['소통', '협업 행동'],
    },
    lessons: [
      { id: 'cc-a', title: '레슨 A. 캡틴 대화 연습실 (AI 공감 시뮬레이터)', summary: 'AI가 다양한 현장 작업자·팀원 역할을 맡고 리더가 직접 대화한다. 상대 반응에 따라 표현을 고쳐 다시 시도할 수 있고, 공감도·명확성·심리적 안전감 지수로 리포트를 받는다.', path: '/practice' },
      { id: 'cc-c', title: '레슨 C. 1:1 펄스 면담 질문 카드', summary: '팀원 지표와 함께 정서적 질문 카드를 골라 면담 준비 노트에 담는다.', path: '/course/collab-comm/pulse' },
      { id: 'cc-d', title: '레슨 D. 반려문 코칭과 비포/애프터 기록', summary: '피드백·지시문을 쓰면 명확성과 존중 여부를 3가지 포인트로 점검한다. 대필 없이 리더가 직접 고치고, 처음 문장과 수정본을 비교하며 소통 습관을 돌아본다.', path: '/course/collab-comm/coaching' },
      { id: 'cc-f', title: '레슨 F. 브릿지 매칭', summary: '타 부서 리더와 15분 교환 인터뷰 뒤 협업 합의서를 쓴다. 서로 다른 업무 관점을 이해하는 보조 활동.', path: '/bridge?tab=matching' },
    ],
  },
  {
    id: 'charisma-character',
    name: 'Charisma + Character',
    nameKo: '카리스마·품격',
    axis: 'leadership',
    axisLabel: '리더십 축 · 다양한 리더에게서 배우는 카리스마와 품격',
    tagline: '역사·스포츠·애니 속 리더에게 배우고, 리더 AI에게 묻는다',
    description:
      '역사적으로 유명한 리더, 스포츠 팀의 훌륭한 리더, 영화·TV시리즈·애니메이션 속 리더의 리더십을 학습한다. 원피스의 흰수염·루피·샹크스, NBA의 마이클 조던·빌 러셀, 리버풀의 제라드, 이순신·세종대왕·나폴레옹까지 모두 훌륭한 리더이지만 지향하는 가치관이 달라, 여러 리더를 배우다 보면 내 상황에 맞는 리더십이 보인다. 그리고 교육을 다 이수해도 CC의 존재 의미가 사라지지 않는다. 각 리더의 특징을 학습한 리더 AI에게 "흰수염이라면 어떻게 했을까?"를 바로 물어볼 수 있다.',
    status: 'ready',
    owner: '이건 · 장한이',
    framework: {
      goal: '다양한 리더의 성격과 리더십을 배워 내 상황에 맞는 리더십 찾기',
      keyQuestion: '흰수염이라면, 이순신이라면 어떻게 했을까?',
      purpose: '여러 리더 AI에게 조언을 구하며 비교하고, 최종 판단은 내가 내리는 경험 쌓기',
      coreLessonIds: ['ch-a', 'ch-b'],
      supportLessonIds: [],
      flow: ['판단'],
    },
    lessons: [
      { id: 'ch-a', title: '레슨 A. 리더 카드 도감', summary: '역사·스포츠·애니·영화 속 리더 카드를 넘기며 성격, 리더십, 대표 사례를 배운다. 흰수염(가족 중심·책임)과 이순신(원칙·준비·솔선수범)이 대표 카드다.', path: '/course/charisma-character/leaders' },
      { id: 'ch-b', title: '레슨 B. 리더 AI에게 묻기', summary: '내 고민을 적고 리더 카드를 골라 "나라면 이렇게 했을 것"이라는 조언을 듣는다. 여러 리더에게 물어 비교한 뒤 내 결정을 판단 기록으로 남긴다. 수료 후에도 계속 쓰는 기능.', path: '/course/charisma-character/leader-ai' },
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
      "리더십 축에서 Coaching이 맡는 역할의 핵심은 '올바른 길로 이끄는 것'이다. 이끈다는 것은 가야 할 길을 대신 정해 주는 것이 아니라, 팀원이 스스로 길을 찾도록 질문하고 찾아낸 길을 토대로 경험을 쌓아 경력으로 자리 잡게 하는 것이다. 한국코치협회 인증 연계(취득 시 수료 가산점)는 유지하되, 인증(자격)과 현장 코칭(실행)을 구분해 코칭의 결과가 현장까지 이어지는지 기준표와 성장 기록으로 확인한다.",
    status: 'ready',
    owner: '장한이',
    framework: {
      goal: '팀원이 스스로 길을 찾도록 질문하며 함께 길을 만들어 가기',
      keyQuestion: '팀원이 스스로 답을 찾게 하려면 나는 무엇을 물어야 할까?',
      purpose: '인증(자격)과 현장 코칭(실행)을 구분해, 코칭의 결과가 현장까지 이어지는지 기준표·성취 기록·주변 피드백으로 확인하기',
      coreLessonIds: ['co-a', 'co-b'],
      supportLessonIds: [],
      flow: ['이끌기'],
    },
    lessons: [
      { id: 'co-a', title: '레슨 A. 코칭 면담 (질문 → 팀원 기준표 → 첫 계획)', summary: "결론 대신 질문 3개로 시작해, 팀원이 '이 결정은 누가 내려야 할까요?'에 답하며 AI 일과 자기 판단 영역을 직접 나누고, 스스로 첫 계획을 정한다. 시나리오: 협력사 작업 중지 요청을 본사에 전달하지 못해 위축된 공무 담당 팀원.", path: '/course/coaching/session' },
      { id: 'co-b', title: '레슨 B. 단계별 성장 기록', summary: '팀원의 첫 계획을 문제 인식 → 시도 → 수정·보완 단계로 기록하고, 리더는 결과가 아니라 과정에 피드백한다. 몇 주 뒤 동료·협력 부서 의견으로 성장을 확인한다.', path: '/course/coaching/growth' },
    ],
  },
]

export const courseById = (id: string) => courses.find((c) => c.id === id)

export const axisMeta: Record<string, { label: string; color: string; bg: string; border: string; text: string }> = {
  compassion: { label: '공감 축', color: '#1F9E8F', bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-700' },
  leadership: { label: '리더십 축', color: '#1E2A4A', bg: 'bg-navy-50', border: 'border-navy-300', text: 'text-navy-700' },
  foundation: { label: '기초 역량', color: '#F28C28', bg: 'bg-safety-50', border: 'border-safety-300', text: 'text-safety-700' },
}
