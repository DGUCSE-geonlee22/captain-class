/**
 * Coaching 코스 데이터 (담당: 장한이, 팀 문서 '장한이-5C(리더십축)' 기준)
 *
 * 핵심: 리더십 축에서 Coaching이 맡는 역할은 '올바른 길로 이끄는 것'.
 * 이끈다는 것은 가야 할 길을 대신 정해 주는 것이 아니라, 팀원이 스스로 길을 찾도록 질문하고,
 * 찾아낸 길을 토대로 경험을 쌓아 경력으로 자리 잡게 하는 것이다.
 * Charisma+Character가 리더에게 질문을 던지는 구조였다면, Coaching은 리더가 팀원에게 질문하는 구조다.
 */

export const coachingPrinciple = {
  headline: '리더가 답을 정해 주지 않고, 팀원이 스스로 길을 찾도록 묻는다.',
  body: '한국코치협회 인증(자격)과 현장에서 코칭을 해내는 것(실행)은 다르다. CC는 인증 연계를 유지하면서, 리더가 실제 면담에서 코칭 질문을 연습하고 팀원의 성취 경험을 기록으로 쌓아 가는 기능을 둔다.',
}

/** 코칭 질문 연습 · 면담 주제 프리셋 (팀원 id는 src/data/team.ts) */
export interface CoachingTopic {
  id: string
  memberId: string
  topic: string
  /** 리더가 빠지기 쉬운 '답 정해 주기' 문장 예 */
  tellingExample: string
}
export const coachingTopics: CoachingTopic[] = [
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
  const noAnswerGiven = !/(하세요|해야 합니다|해야 해요|하면 됩니다|하십시오|하세요\.|해라|하도록 하세요|외우|따르세요)/.test(t)
  return { isQuestion, isOpen, noAnswerGiven }
}
export const coachingCheckLabels: { key: keyof CoachingQuestionCheck; label: string; hint: string }[] = [
  { key: 'isQuestion', label: '질문으로 끝났는가', hint: '지시문이 아니라 물음표로 끝나는 문장인지 봅니다.' },
  { key: 'isOpen', label: '열린 질문인가', hint: '"예/아니오"로 닫히지 않고 왜·어떻게·무엇으로 생각을 여는지 봅니다.' },
  { key: 'noAnswerGiven', label: '답을 정해 주지 않았는가', hint: '"하세요", "해야 합니다"처럼 길을 대신 정하는 표현이 없는지 봅니다.' },
]

/** 성취 경험 기록 항목 (송현지 · 결과보다 과정을 보는 평가: 문제 정의 · 근거 설명 · 도전 행동) */
export const achievementFields = [
  { key: 'problem', label: '팀원이 정의한 문제', placeholder: '예: 철근 자재가 이틀 늦어 골조 전환 구간이 밀림' },
  { key: 'reasoning', label: '팀원이 설명한 근거', placeholder: '예: 자재 입고 기록과 선행 공정 일지를 대조해 지연 원인을 분리함' },
  { key: 'action', label: '팀원이 시도한 도전 행동', placeholder: '예: 공무팀에 지연 분리 표기를 직접 요청함' },
  { key: 'next', label: '다음 경력으로 이어질 한 걸음', placeholder: '예: 다음 분기 공정 회의에서 지연 집계 기준 제안 발표' },
] as const
export type AchievementField = (typeof achievementFields)[number]['key']

/** 한국코치협회 인증 연계 안내 */
export const kcaInfo = {
  title: '한국코치협회(KCA) 인증 연계',
  points: [
    '전문 코치 인증(KAC 등) 취득 시 CC 수료 가산점 부여',
    '인증은 자격, 현장 코칭은 실행: 둘을 구분해 평가한다',
    '수료 후 13주차 이후 "동료 코칭 서클"에서 인증 준비 스터디 운영',
  ],
  steps: ['인증 과정 안내 확인', '코칭 질문 연습 10회 누적', '팀원 성취 기록 3건', '인증 신청'],
  link: 'https://www.kcoach.kr',
}
