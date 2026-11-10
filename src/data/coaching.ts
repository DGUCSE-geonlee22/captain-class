/**
 * Coaching 코스 데이터 (담당: 장한이, 팀 문서 '장한이-5C(리더십축)' 기준)
 *
 * 핵심: 리더십 축에서 Coaching이 맡는 역할은 '올바른 길로 이끄는 것'.
 * 이끈다는 것은 가야 할 길을 대신 정해 주는 것이 아니라 팀원이 스스로 길을 찾도록 돕고,
 * 찾아낸 길을 토대로 경험을 쌓아 경력으로 자리 잡게 하는 것이다.
 * Charisma+Character가 리더에게 질문하는 구조였다면, Coaching은 리더가 팀원에게 질문하며 함께 길을 만들어 가는 구조다.
 * 구성: 한국코치협회 연계 유지 + 판단 위임 기준표(김원태) + 단계별 성취 경험 기록(송현지)
 */

export const coachingPrinciple = {
  headline: '리더가 길을 정해 주지 않고, 팀원이 스스로 길을 찾도록 질문하며 함께 만든다.',
  body: '한국코치협회 인증을 따는 것과 현장에서 코칭을 해내는 것은 다르다. CC는 인증 연계를 유지하면서 코칭의 결과가 현장까지 이어지는지 확인할 수 있게, 팀원이 직접 쓰는 판단 위임 기준표와 단계별 성취 경험 기록을 둔다.',
  effect: "이 과정이 반복되면 리더는 해결책을 제시하기만 하는 상사에서 방향을 함께 세우고 팀원이 스스로 해내도록 돕는 코치가 된다. 팀원은 AI와의 역할 분담이 분명해져 책임져야 하는 일에 집중하고, 쌓인 기록으로 자신의 성장을 확인하며 판단에 대한 신뢰가 올라간다. 마음은 헤아리지만 방향을 제시하지 못하는 '착한 리더'에서 마음을 이해하면서 올바른 길로 이끄는 '공감 리더'로 간다.",
}

/** 코칭 질문 연습 · 면담 주제 프리셋 (팀원 id는 src/data/team.ts) */
export interface CoachingTopic {
  id: string
  memberId: string
  topic: string
  /** 리더가 빠지기 쉬운 '결론만 전달하는' 문장 예 */
  tellingExample: string
  /** 문서의 질문 예시 (참고용으로만 보여 준다) */
  exampleQuestions?: string[]
}
export const coachingTopics: CoachingTopic[] = [
  {
    id: 'ct-0',
    memberId: 'site-gongmu',
    topic: '협력사의 작업 중지 요청을 본사에 전달해야 하는데, 양쪽 어디에도 제대로 설명하지 못해 위축된 상황',
    tellingExample: '"본사에는 이렇게 말하면 돼요. 내가 정리해 줄 테니 그대로 보내세요."',
    exampleQuestions: [
      '이번 협의에서 가장 어려웠던 부분은 어떤 점이었어요?',
      '협력사 이야기를 본사에 정리해서 전달하려 했을 때 어떤 점을 가장 신경 썼어요?',
      '비슷한 요청이 또 온다면, 이번 건과 비교해서 어떤 점을 바꿔 보고 싶나요?',
    ],
  },
  { id: 'ct-1', memberId: 'kim-duhyeon', topic: '공정 지연이 반복되는 구간을 어떻게 풀지', tellingExample: '"야근해서라도 이번 주에 맞추세요."' },
  { id: 'ct-2', memberId: 'newbie-1', topic: '첫 단독 검측을 앞둔 준비', tellingExample: '"검측은 이 순서대로 하면 됩니다. 외우세요."' },
  { id: 'ct-3', memberId: 'lee-gyubong', topic: '로그 처리 역량을 현장 소통으로 넓히기', tellingExample: '"현장 좀 나가세요. 데이터만 보지 말고."' },
  { id: 'ct-4', memberId: 'lee-gang', topic: 'B구역 해체 작업을 맡기며 역할 정하기', tellingExample: '"공정표대로만 하세요. 바꿀 거 있으면 허락받고."' },
]

/** 코칭 질문 점검 규칙 (규칙 기반 · 참고용) */
export interface CoachingQuestionCheck {
  isQuestion: boolean
  isOpen: boolean
  noAnswerGiven: boolean
}
export function checkCoachingQuestion(text: string): CoachingQuestionCheck {
  const t = text.trim()
  const isQuestion = /[?？]\s*$/.test(t) || /(까요|나요|어요|가요|을까|ㄹ까|세요\?)\s*$/.test(t)
  const isOpen = /(왜|어떻게|무엇|뭐|어떤|어디|언제|누구|어느|얼마나)/.test(t) && !/^(혹시|지금|이거)?\s*(됐|했|할 수 있|가능|맞)/.test(t)
  const noAnswerGiven = !/(하세요|해야 합니다|해야 해요|하면 됩니다|하십시오|하세요\.|해라|하도록 하세요|외우|따르세요|그대로 보내)/.test(t)
  return { isQuestion, isOpen, noAnswerGiven }
}
export const coachingCheckLabels: { key: keyof CoachingQuestionCheck; label: string; hint: string }[] = [
  { key: 'isQuestion', label: '질문으로 끝났는가', hint: '지시문이 아니라 물음표로 끝나는 문장인지 봅니다.' },
  { key: 'isOpen', label: '열린 질문인가', hint: '"예/아니오"로 닫히지 않고 왜·어떻게·무엇으로 생각을 여는지 봅니다.' },
  { key: 'noAnswerGiven', label: '답을 정해 주지 않았는가', hint: '"하세요", "해야 합니다"처럼 길을 대신 정하는 표현이 없는지 봅니다.' },
]

/**
 * 판단 위임 기준표 — 리더가 써서 건네는 것이 아니라, 질문과 답변을 바탕으로 팀원이 직접 작성하고 리더가 보완한다.
 */
export const delegationGuideQuestions = [
  '이 결정은 현장에서 누가 내려야 할까요?',
  'AI에 무조건적으로 의존해서 결정하면 어떤 위험이 있을까요?',
]
export interface DelegationTask {
  id: string
  task: string
  hint: string
  /** 문서 예시 분류 (참고용) */
  suggested: DelegationChoice
}
export const delegationChoices = [
  { id: 'ai', label: 'AI에게 맡길 일', desc: '반복적이고 계속 살펴야 하는 일', color: 'bg-slate-700 text-white' },
  { id: 'member', label: '내가 판단할 일', desc: '현장의 맥락을 읽는 일', color: 'bg-safety-500 text-white' },
  { id: 'consult', label: '함께 협의할 일', desc: '본사·협력사와 조율이 필요한 일', color: 'bg-navy-500 text-white' },
] as const
export type DelegationChoice = (typeof delegationChoices)[number]['id']
export const delegationTasks: DelegationTask[] = [
  { id: 'd-monitor', task: '위험 징후 모니터링(센서·CCTV 알림)', hint: '반복적이고 계속 살펴야 하는 일', suggested: 'ai' },
  { id: 'd-daily', task: '작업 일보·현장 기록 정리', hint: '반복적이고 계속 살펴야 하는 일', suggested: 'ai' },
  { id: 'd-stop', task: '작업 중지가 필요한지 판단', hint: '현장에서의 맥락을 읽는 일', suggested: 'member' },
  { id: 'd-partner', task: '협력사 입장을 정리해 본사에 전달', hint: '현장에서의 맥락을 읽는 일', suggested: 'member' },
  { id: 'd-schedule', task: '공기가 밀리는 문제', hint: '본사와 협의할 일', suggested: 'consult' },
  { id: 'd-evidence', task: '본사 설득용 근거 자료 초안', hint: 'AI 초안 뒤 사람이 확인', suggested: 'ai' },
  { id: 'd-worker', task: '작업자의 불안·반발에 대응', hint: '현장에서의 맥락을 읽는 일', suggested: 'member' },
]

/**
 * 단계별 성취 경험 기록 — 면담에서 나온 다음 단계 계획을 팀원이 진행하며 단계별로 기록한다.
 * 리더는 결과 완성도뿐 아니라 문제 정의·새로운 시도·오류 수정 과정에 피드백한다. 일정 기간 뒤 동료·협력 부서 피드백으로 코칭 효과를 점검한다.
 */
export const growthStepTypes = [
  { id: 'notice', label: '문제 인식', desc: '처음 요청을 받았을 때 무엇을 문제로 봤는가' },
  { id: 'attempt', label: '시도', desc: '어떤 근거를 모으고 무엇을 새로 해 봤는가' },
  { id: 'fix', label: '수정·보완', desc: '본사·협력사 반응에 따라 무엇을 고쳤는가' },
] as const
export type GrowthStepType = (typeof growthStepTypes)[number]['id']
export const leaderFeedbackChecks = [
  { key: 'problemDefinition', label: '문제를 어떻게 정의했는지' },
  { key: 'newAttempt', label: '어떤 새로운 시도를 했는지' },
  { key: 'errorFix', label: '오류를 어떻게 바로잡았는지' },
] as const
export type LeaderFeedbackKey = (typeof leaderFeedbackChecks)[number]['key']
export const growthPlanExample = '다음 협력사 요청이 오면 본사에 올리기 전, 근거 자료 먼저 정리해 보기'

/** 한국코치협회 인증 연계 안내 */
export const kcaInfo = {
  title: '한국코치협회(KCA) 인증 연계',
  points: [
    '전문 코치 인증 취득 시 CC 수료 가산점 부여 → 자기계발 동기와 교육 참여 촉진',
    '인증을 따는 것(자격)과 현장에서 코칭을 해내는 것(실행)을 구분한다',
    '코칭의 결과가 현장까지 이어지는지는 기준표·성취 기록·주변 피드백으로 확인한다',
  ],
  steps: ['인증 과정 안내 확인', '코칭 질문 연습 누적', '팀원 기준표·성취 기록 누적', '인증 신청'],
  link: 'https://www.kcoach.kr',
}
