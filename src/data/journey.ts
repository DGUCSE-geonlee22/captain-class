import type { JourneyStage, WeekPlan } from './types'

/** 데모 기본 주차 (Act 단계) */
export const DEFAULT_DEMO_WEEK = 8
export const TOTAL_WEEKS = 12

/**
 * 12주 학습 여정. 홈의 항해 지도와 이번 주 미션 카드가 이 데이터를 읽는다.
 * Construction 코스는 0주차(본 교육 1주 전) 사전 진단 코스다.
 */
export const construction = { weeks: [0] as number[], note: '0주차 사전 진단 코스 · 담당 주우상' }

export const journey: JourneyStage[] = [
  {
    id: 'diagnose',
    order: 0,
    name: '진단',
    weeks: [0],
    weekLabel: '1주차 전',
    courseIds: ['construction'],
    courseLabel: 'Construction',
    mission: '작업자 1명에게 "요즘 현장에서 작업하시면서 가장 힘든 일이나 애로사항이 무엇인가요?" 직접 묻기',
    output: '개인 프로파일 · 사전 진단 점수, 현장 대면 소통 리포트',
    axis: 'foundation',
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
    output: '리더 AI 판단 기록',
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
    mission: '타 부서와 작은 절차 1개 합의, 팀원 1명과 코칭 면담',
    output: '협업 합의서, 팀원 판단 위임 기준표, 성장 기록',
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
  { week: 0, stageId: 'diagnose', courseId: 'construction', courseLabel: 'Construction · 0주차 진단', title: '사전 진단: 나를 알고, 현장에 첫 마디를 건네다', topics: ['2축 자기진단 8문항: 통제형·회피형·균형형 성향과 12주 집중 보완 축', '내 파트와 가장 가까운 딜레마(안전·공기 충돌 / 본사-현장 괴리 / 관계) 고르고 지금의 대응 남기기', '현장 실천 미션: 작업자 1명에게 "가장 힘든 일이나 애로사항이 무엇인가요?" 직접 묻기'], lessonIds: ['cn-a', 'cn-b'], mission: '작업자 1명에게 직접 묻고 반응 기록하기', output: '사전 진단 점수, 현장 대면 소통 리포트(Reframing 연계)', status: 'ready' },
  { week: 1, stageId: 'read', courseId: 'compassion', courseLabel: 'Compassion', title: '현장 공감형 Reframing 훈련 ①', topics: ['데이터 융합: 벌점 대신 환경 데이터 먼저 보기', '차가운 로그 → 맥락 문장으로 다시 읽기', "10초 '생각의 시간'과 관점 전환 질문"], lessonIds: ['cp-a'], mission: 'AI 경고 1건을 현장에서 직접 확인하고 신호 노트 작성', output: '신호 노트 1건', status: 'ready' },
  { week: 2, stageId: 'read', courseId: 'compassion', courseLabel: 'Compassion', title: '관점 렌즈 — 한 상황을 여러 방향에서 보기', topics: ['리더 입장 · 구성원 입장 탐색 질문', '감정을 단정하지 않는 질문 설계', 'Reframing 반복 훈련'], lessonIds: ['cp-b', 'cp-a'], mission: 'AI 경고 1건 현장 확인 + 관점 렌즈로 질문 3개 적기', output: '신호 노트 2건(누적)', status: 'ready' },
  { week: 3, stageId: 'read', courseId: 'compassion', courseLabel: 'Compassion', title: '타 파트 익명 상담 체험', topics: ['익명 브릿지: 다른 파트 고충에 직접 답하기 (코칭 포인트 3가지 점검)', '현장 음성 제보를 환경 데이터와 함께 읽기 — 징계 대신 환경 개선·원인 탐색', 'Read 단계 성찰'], lessonIds: ['cp-c'], mission: '익명 고충 1건에 직접 답변하기', output: '신호 노트 3건(누적), 상담 답변 1건', status: 'ready' },
  { week: 4, stageId: 'evaluate', courseId: 'charisma-character', courseLabel: 'Charisma+Character', title: '리더 카드 도감 — 다양한 리더의 카리스마와 품격', topics: ['역사(이순신·세종대왕·나폴레옹)·스포츠(조던·제라드)·애니(흰수염·루피) 리더 카드', '리더마다 다른 가치관: 가족 중심(흰수염) vs 원칙과 준비(이순신)', '내 상황에 맞는 리더 3명 고르기'], lessonIds: ['ch-a'], mission: '내가 닮고 싶은 리더 1명과 그 이유 정리', output: '나의 리더 카드 3장', status: 'ready' },
  { week: 5, stageId: 'evaluate', courseId: 'charisma-character', courseLabel: 'Charisma+Character', title: '리더 AI에게 묻기 — "흰수염이라면 어떻게 했을까?"', topics: ['내 고민 입력 → 리더 카드 고르기 → 그 리더의 성격·리더십으로 "나라면" 조언 듣기', '시나리오: 협력사의 작업 중지 요청 vs 본사의 공기 재촉', '조언은 참고용, 최종 판단은 캡틴'], lessonIds: ['ch-b'], mission: '이번 주 실제 고민 1건을 리더 AI에게 묻고 직접 결정하기', output: '판단 기록 1건', status: 'ready' },
  { week: 6, stageId: 'evaluate', courseId: 'charisma-character', courseLabel: 'Charisma+Character', title: '여러 리더의 조언 비교와 내 결정', topics: ['같은 고민을 2~3명의 리더 AI에게 묻고 조언 비교', '어떤 조언을 왜 택했는지 판단 기록으로 남기기', 'Evaluate 단계 성찰: AI는 대체재가 아니라 사고를 넓혀 주는 도구'], lessonIds: ['ch-b'], mission: 'AI에 맡기지 않고 직접 결정한 일 1가지 실행', output: '판단 기록 3건(누적)', status: 'ready' },
  { week: 7, stageId: 'act', courseId: 'collab-comm', courseLabel: 'Collaboration+Communication', title: '캡틴 대화 연습실 ①', topics: ['시나리오 대화 연습: 공감도·명확성·심리적 안전감 지수', '막히면 리더 AI에게 묻기', '종료 리포트의 문장 교정 가이드'], lessonIds: ['cc-a'], mission: '실제 면담·TBM에서 연습한 화법 1개 적용', output: '연습 리포트 1건', status: 'ready' },
  { week: 8, stageId: 'act', courseId: 'collab-comm', courseLabel: 'Collaboration+Communication', title: '반려문·지적 코칭과 비포/애프터', topics: ['코칭 포인트 3가지: 노력 인정 · 구체적 설명 · 개선 방향', '대필 없이 직접 고치기', '대화 연습실 ② (입사동기 지시)'], lessonIds: ['cc-d', 'cc-a'], mission: '실제 반려·지적 문장 1개를 고쳐서 전달하기', output: '비포/애프터 기록', status: 'ready' },
  { week: 9, stageId: 'act', courseId: 'collab-comm', courseLabel: 'Collaboration+Communication', title: '회의 운영과 AI 시대의 소통', topics: ['리더가 먼저 여는 TBM: "어제 아찔했던 순간 하나"', 'AI에게만 묻는 신입: 질문 필수 시간과 사람에게 확인할 일', '1:1 펄스 면담 질문 카드로 면담 준비'], lessonIds: ['cc-c', 'cc-a'], mission: 'TBM에서 내 아찔했던 순간을 먼저 꺼내고, 팀원 1명에게 펄스 카드 질문으로 면담 열기', output: 'TBM 변화 메모, 면담 준비 노트', status: 'ready' },
  { week: 10, stageId: 'link', courseId: 'collab-comm', courseLabel: 'Collab+Comm · 브릿지 매칭', title: '부서 간 협업 — 교환 인터뷰와 협업 합의서', topics: ['본사 스마트안전팀·공무팀·타 현장 리더 프로필', '15분 교환 인터뷰: 서로 모르는 제약 하나씩 꺼내기', '작은 절차 1개 합의 → 협업 합의서'], lessonIds: ['cc-f'], mission: '타 부서 리더와 15분 대화 후 함께 바꿀 작은 절차 1개 합의', output: '인터뷰 메모, 협업 합의서', status: 'ready' },
  { week: 11, stageId: 'link', courseId: 'coaching', courseLabel: 'Coaching', title: '코칭의 기본 — 질문으로 이끌기', topics: ['코칭 질문 점검: 질문으로 끝나는가 · 열린 질문인가 · 답을 정해 주지 않았는가', '팀원이 직접 쓰는 AI 판단 위임 기준표', '면담 끝에 팀원과 첫 계획 세우기'], lessonIds: ['co-a'], mission: '팀원 1명과 코칭 면담 후 기준표·첫 계획 함께 작성', output: '팀원 판단 위임 기준표, 첫 계획', status: 'ready' },
  { week: 12, stageId: 'link', courseId: 'coaching', courseLabel: 'Coaching · 수료', title: '성장 기록과 과정 피드백 · 수료', topics: ['단계별 성장 기록: 인식 → 시도 → 수정', '결과가 아니라 과정에 피드백 · 동료·협력 부서 피드백으로 확인', "2축 사후 진단 · 한국코치협회 인증 가산점 · '리더' 직급 부여"], lessonIds: ['co-b'], mission: '팀원의 첫 계획 실행을 지켜보고 과정 피드백 1회 남기기', output: '단계별 성장 기록, 과정 피드백, 사후 진단', status: 'ready' },
  { week: 13, stageId: 'sustain', courseId: 'common', courseLabel: '전 코스 · 유지', title: '리더로서 유지하기', topics: ['13주차 실제 적용 결과 피드백', 'P난처 사례 기여 (리더 전용 솔루션)', '월 1회 동료 코칭 서클 · 분기 재진단'], lessonIds: [], mission: '실제 적용 결과 1건 피드백', output: '재진단 점수, P난처 기여 마일리지', status: 'common' },
]

export const weekPlanFor = (week: number) => weekPlan.find((w) => w.week === Math.min(13, Math.max(0, week)))!
