import type { JourneyStage, WeekPlan } from './types'

/** 데모 기본 주차 (Act 단계) */
export const DEFAULT_DEMO_WEEK = 8
export const TOTAL_WEEKS = 12

/**
 * 12주 학습 여정. 홈의 항해 지도와 이번 주 미션 카드가 이 데이터를 읽는다.
 * Construction 코스의 배치 주차는 미정이라 아래 `construction`에 TBD로 둔다.
 */
export const construction = { weeks: 'TBD' as const, note: '배치 주차 미정 · 담당 주우상' }

export const journey: JourneyStage[] = [
  {
    id: 'diagnose',
    order: 0,
    name: '진단',
    weeks: [0],
    weekLabel: '1주차 전',
    courseIds: [],
    courseLabel: '공통',
    mission: '작업자 1명에게 "요즘 어떠세요?" 직접 묻기',
    output: '2축 자가진단 점수',
    axis: 'common',
  },
  {
    id: 'read',
    order: 1,
    name: 'Read',
    weeks: [1, 2, 3],
    weekLabel: '1~3주',
    courseIds: ['compassion'],
    courseLabel: 'Compassion',
    mission: 'AI 경고 1건을 현장에서 직접 확인하고 신호 노트 작성',
    output: '신호 노트 3건',
    axis: 'compassion',
  },
  {
    id: 'evaluate',
    order: 2,
    name: 'Evaluate',
    weeks: [4, 5, 6],
    weekLabel: '4~6주',
    courseIds: ['charisma-character'],
    courseLabel: 'Charisma+Character',
    mission: 'AI에 맡기지 않고 직접 할 일 1가지 선정',
    output: 'AI 위임 기준표',
    axis: 'leadership',
  },
  {
    id: 'act',
    order: 3,
    name: 'Act',
    weeks: [7, 8, 9],
    weekLabel: '7~9주',
    courseIds: ['collab-comm'],
    courseLabel: 'Collaboration+Communication',
    mission: '실제 면담·TBM에서 연습한 화법 1개 적용',
    output: '비포/애프터, 대화 복기 로그',
    axis: 'compassion',
  },
  {
    id: 'link',
    order: 4,
    name: 'Link',
    weeks: [10, 11, 12],
    weekLabel: '10~12주',
    courseIds: ['collab-comm', 'coaching'],
    courseLabel: '브릿지 매칭 + Coaching',
    mission: '타 부서 리더와 15분 대화 후 공동 과제 1개 합의',
    output: '협업 합의서',
    axis: 'mixed',
  },
  {
    id: 'complete',
    order: 5,
    name: '수료',
    weeks: [],
    weekLabel: '12주차 말',
    courseIds: [],
    courseLabel: '—',
    mission: "사후 진단 후 '리더' 직급 부여",
    output: '360 피드백',
    axis: 'finish',
  },
  {
    id: 'sustain',
    order: 6,
    name: '유지',
    weeks: [13],
    weekLabel: '13주 이후',
    courseIds: ['compassion', 'collab-comm', 'charisma-character', 'coaching'],
    courseLabel: '전체',
    mission: '13주차 실제 적용 피드백, P난처 기여, 동료 코칭 서클',
    output: '분기 재진단',
    axis: 'common',
  },
]

/** 주차로 현재 단계를 찾는다. */
export function stageForWeek(week: number): JourneyStage {
  if (week >= 13) return journey.find((s) => s.id === 'sustain')!
  if (week <= 0) return journey[0]
  return journey.find((s) => s.weeks.includes(week)) ?? journey[0]
}

/**
 * 주차별 커리큘럼 (홈·커리큘럼 페이지의 수강 시간표).
 * 리더십 축 주차(4~6, 11)는 장한이 님 문서 기준으로 채워짐. Construction 배치 주차는 아래 `construction` TBD.
 */
export const weekPlan: WeekPlan[] = [
  { week: 0, stageId: 'diagnose', courseId: 'common', courseLabel: '공통 · 진단', title: '2축 자가진단과 딜레마 선택', topics: ['공감·리더십 2축 자가진단', '현장 딜레마 시나리오 선택', '개인 프로파일 작성'], lessonIds: [], mission: '작업자 1명에게 "요즘 어떠세요?" 직접 묻기', output: '사전 진단 점수, 개인 프로파일', status: 'common' },
  { week: 1, stageId: 'read', courseId: 'compassion', courseLabel: 'Compassion', title: '현장 공감형 Reframing 훈련 ①', topics: ['데이터 융합: 벌점 대신 환경 데이터 먼저 보기', '차가운 로그 → 맥락 문장으로 다시 읽기', "10초 '생각의 시간'과 관점 전환 질문"], lessonIds: ['cp-a'], mission: 'AI 경고 1건을 현장에서 직접 확인하고 신호 노트 작성', output: '신호 노트 1건', status: 'ready' },
  { week: 2, stageId: 'read', courseId: 'compassion', courseLabel: 'Compassion', title: '관점 렌즈 — 한 상황을 여러 방향에서 보기', topics: ['리더 입장 · 구성원 입장 탐색 질문', '감정을 단정하지 않는 질문 설계', 'Reframing 반복 훈련'], lessonIds: ['cp-b', 'cp-a'], mission: 'AI 경고 1건 현장 확인 + 관점 렌즈로 질문 3개 적기', output: '신호 노트 2건(누적)', status: 'ready' },
  { week: 3, stageId: 'read', courseId: 'compassion', courseLabel: 'Compassion', title: '타 파트 익명 상담 체험과 전문가 수업', topics: ['익명 브릿지 상담 체험: 다른 파트 고충에 답하기', 'HRD 심리전문가 수업 수강', 'Read 단계 성찰'], lessonIds: ['cp-c', 'cp-d'], mission: '익명 고충 1건에 직접 답변하기', output: '신호 노트 3건(누적), 상담 답변 1건', status: 'ready' },
  { week: 4, stageId: 'evaluate', courseId: 'charisma-character', courseLabel: 'Charisma+Character', title: '질문형 리더 AI ① — 답 대신 질문하는 안내자', topics: ['리더 AI 속 위인·캐릭터는 정답이 아니라 질문을 떠올리게 하는 안내자', "시나리오: 협력사의 작업 중지 요청 vs 본사의 공기 재촉 → '흰수염은 항로보다 무엇을 먼저 확인했을까?'", '참고 자료(삼성물산 작업중지권 운영)를 보고 리더가 직접 방향 정하기'], lessonIds: ['ch-a'], mission: 'AI에 맡기지 않고 직접 할 일 1가지 선정', output: '판단 기록 1건, 직접 할 일 목록', status: 'ready' },
  { week: 5, stageId: 'evaluate', courseId: 'charisma-character', courseLabel: 'Charisma+Character', title: "'AI에 맡길 일 / 내가 할 일' 분류", topics: ['이번 주 업무 8가지를 AI 위임 · AI 초안+확인 · 직접 수행으로 분류', '기준: 사람의 몸 상태·신뢰·고충이 걸린 일은 사람이 한다 (예: 로그 확인은 AI, 휴식 주기는 직접)', '질문형 리더 AI ② — 내 방향이 협력사·본사·작업자에게 미칠 영향 되묻기'], lessonIds: ['ch-b', 'ch-a'], mission: '이번 주 업무 중 AI 위임·직접 수행 구분해 보기', output: 'AI 위임 기준표 초안', status: 'ready' },
  { week: 6, stageId: 'evaluate', courseId: 'charisma-character', courseLabel: 'Charisma+Character', title: 'AI 위임 기준표 완성과 카리스마 성찰', topics: ['기준표 한 줄 정리 후 팀 공유', '서둘러 결론 내리기 전에 먼저 묻는 습관이 카리스마의 바탕이 되는 이유 성찰', 'Evaluate 단계 성찰: AI는 대체재가 아니라 사고를 넓혀 주는 도구'], lessonIds: ['ch-b'], mission: '기준표를 팀에 공유하고 피드백 받기', output: '나의 AI 위임 기준표', status: 'ready' },
  { week: 7, stageId: 'act', courseId: 'collab-comm', courseLabel: 'Collaboration+Communication', title: '캡틴 대화 연습실 ①과 퀵 테스트', topics: ['시나리오 대화 연습: 공감도·명확성·심리적 안전감 지수', '경청·회의 운영·피드백 퀵 테스트', '힌트: 답 대신 질문을 주는 리더 AI'], lessonIds: ['cc-a', 'cc-b'], mission: '실제 면담·TBM에서 연습한 화법 1개 적용', output: '연습 리포트 1건', status: 'ready' },
  { week: 8, stageId: 'act', courseId: 'collab-comm', courseLabel: 'Collaboration+Communication', title: '반려문·지적 코칭과 비포/애프터', topics: ['코칭 포인트 3가지: 노력 인정 · 구체적 설명 · 개선 방향', '대필 없이 직접 고치기', '대화 연습실 ② (입사동기 지시)'], lessonIds: ['cc-d', 'cc-a'], mission: '실제 반려·지적 문장 1개를 고쳐서 전달하기', output: '비포/애프터 기록', status: 'ready' },
  { week: 9, stageId: 'act', courseId: 'collab-comm', courseLabel: 'Collaboration+Communication', title: '현장 직통 보이스와 대화 복기', topics: ['익명 음성 제보를 환경 데이터와 함께 읽기', '징계 대신 환경 개선·원인 탐색 선택', '실천 Log로 대화 복기'], lessonIds: ['cc-e', 'cc-a'], mission: '제보 1건에 환경 개선 조치 1개 실행', output: '대화 복기 로그(실천 Log)', status: 'ready' },
  { week: 10, stageId: 'link', courseId: 'collab-comm', courseLabel: 'Collab+Comm · 브릿지 매칭', title: '브릿지 매칭 — 타 부서 리더 교환 인터뷰', topics: ['본사 스마트안전팀·공무팀·타 현장 리더 프로필', '15분 교환 인터뷰 질문지'], lessonIds: ['cc-f'], mission: '타 부서 리더와 15분 직접 대화', output: '인터뷰 메모', status: 'ready' },
  { week: 11, stageId: 'link', courseId: 'mixed', courseLabel: 'Collab+Comm + Coaching', title: '1:1 펄스 면담 질문 카드와 코칭', topics: ['팀원 지표와 정서적 질문 카드 3장', "코칭 질문 연습: '야근해서라도 맞추세요' 대신 팀원이 스스로 길을 찾게 하는 질문", '팀원 성취 경험 기록(문제 정의·근거·도전 행동) · 한국코치협회 인증 연계'], lessonIds: ['cc-c', 'co-a', 'co-b'], mission: '팀원 1명과 질문 카드 면담', output: '면담 준비 노트, 성취 기록', status: 'ready' },
  { week: 12, stageId: 'link', courseId: 'mixed', courseLabel: 'Link 마무리 · 수료', title: '협업 합의서와 사후 진단', topics: ['공동 과제 1개 합의 → 협업 합의서', '2축 사후 진단 · 360 피드백', "수료: '리더' 직급 부여"], lessonIds: ['cc-f'], mission: '타 부서 리더와 공동 과제 1개 합의', output: '협업 합의서, 사후 진단, 360 피드백', status: 'ready' },
  { week: 13, stageId: 'sustain', courseId: 'common', courseLabel: '전 코스 · 유지', title: '리더로서 유지하기', topics: ['13주차 실제 적용 결과 피드백', 'P난처 사례 기여 (리더 전용 솔루션)', '월 1회 동료 코칭 서클 · 분기 재진단'], lessonIds: [], mission: '실제 적용 결과 1건 피드백', output: '재진단 점수, P난처 기여 마일리지', status: 'common' },
]

export const weekPlanFor = (week: number) => weekPlan.find((w) => w.week === Math.min(13, Math.max(0, week)))!
