/**
 * Construction 코스 데이터 (담당: 주우상, 팀 문서 '주우상-construction' 기준)
 *
 * Construction은 본 교육(12주) 시작 1주 전, 0주차 사전 진단 코스다.
 *  1) 공감/리더십 2축 자기진단  2) 현장 딜레마 시나리오 선택형 진단  3) 현장 실천 미션: 작업자 1명에게 첫 마디 건네기
 * 산출물: 개인 프로파일·사전 진단 점수(12주 변화 추적 기준), 현장 대면 소통 리포트(Compassion Reframing 모듈로 연계)
 */

export const constructionBackground = {
  title: '배경 및 필요성',
  items: [
    { head: '원가·안전·공기 삼중 압박', body: '공사비지수 상승(원가율 90% 이상), 중대재해처벌법과 사고사망자 증가에 따른 안전 책임 강화, 발주처의 준공 요구로 인한 공기 압박이 동시에 작용한다.' },
    { head: '본사·현장·협력사 다단계 구조', body: '원도급사(발주처와 직접 계약해 기획·시공·일정·예산을 총괄) 신임 리더는 발주처 지침, 본사의 원가·기획 지시, 하도급·협력사의 실제 작업 여건 중간에서 양방향 소통과 조율을 주도해야 한다.' },
    { head: '인력 세대교체 가속', body: '재직 건설기술인 고령화 속에 소수의 젊은 신임 리더가 일찍 조정 역할을 맡지만, 이를 대비한 맞춤형 HRD 프로그램이 없다.' },
    { head: '기술과 사람 간 갈등', body: 'AI 감시 CCTV·IoT 센서 도입 후 모니터링 로그만 믿는 통제 관리로 현장 작업자의 반발, 위험 은폐, 소통 기피가 심화됐다.' },
  ],
  goals: [
    '단순 지적·단속형 관리에서 벗어나 AI 데이터를 현장의 정서적·환경적 맥락으로 재해석하는 인지적 공감력 확보',
    '본사·현장·협력업체 간 이해관계를 수렴하고, 법적·공정적 리스크가 생기기 전에 선제적으로 설득·조율하는 실전 현장 관리감독 능력 배양',
  ],
  week0: {
    timing: '본격적인 12주 본 교육 시작 1주 전',
    purposes: [
      '신임 리더가 본인의 공감·리더십 성향을 객관적으로 파악한다',
      '토목·건설 현장의 특수성(원가·안전·공기 압박) 속에서 마주할 실제 딜레마를 미리 인식한다',
      '책상머리 교육에서 벗어나 현장 작업자와의 첫 대면 소통으로 실무 감각을 깨우는 브릿지 역할을 한다',
    ],
    outputs: [
      { name: '개인 프로파일 · 사전 진단 점수', use: '12주 동안 본인의 변화를 추적하는 기준 데이터' },
      { name: '현장 대면 소통 리포트', use: '작업자에게 들은 애로사항 기록 → Compassion 코스 현장 공감형 Reframing 모듈의 실제 분석 데이터로 연계' },
    ],
  },
}

/** 1) 2축 자기진단 — 건설 현장 상황에서의 대응 성향 */
export type Tendency = 'control' | 'avoid' | 'balanced'
export interface DiagnosisItem {
  id: string
  situation: string
  options: { tendency: Tendency; text: string }[]
}
export const diagnosisItems: DiagnosisItem[] = [
  {
    id: 'dg-1',
    situation: 'AI 안전 로그에 작업반장의 안전모 미착용이 찍혔다. 현장은 체감온도 33도다.',
    options: [
      { tendency: 'control', text: '로그를 그대로 복사해 경고 문자를 보낸다. 규정은 규정이다.' },
      { tendency: 'avoid', text: '더위 탓이니 이번엔 못 본 척 넘어간다.' },
      { tendency: 'balanced', text: '현장에 내려가 상태를 확인하고, 교대 휴식을 조정한 뒤 안전모는 지키자고 말한다.' },
    ],
  },
  {
    id: 'dg-2',
    situation: 'AI 공정 리포트가 한 구성원 구간에 3회 연속 "지연" 경고를 띄웠다.',
    options: [
      { tendency: 'control', text: '이번 주 안에 못 맞추면 본사 보고라고 통보하고 계획서를 내일까지 받는다.' },
      { tendency: 'avoid', text: '"힘내, 다음 주엔 괜찮아지겠지"라고 말하고 넘어간다.' },
      { tendency: 'balanced', text: '먼저 "요즘 제일 버거운 공정이 뭐예요?"라고 묻고, 일정은 같이 풀 문제라고 말한다.' },
    ],
  },
  {
    id: 'dg-3',
    situation: '입사동기인 대리에게 내일부터 B구역 해체 작업을 맡겨야 한다. 아직 둘이 제대로 이야기한 적이 없다.',
    options: [
      { tendency: 'control', text: '공정표를 보내고 "그대로 해"라고 지시한다.' },
      { tendency: 'avoid', text: '"바쁘면 괜찮고…"라며 맡기는지 아닌지 애매하게 말한다.' },
      { tendency: 'balanced', text: '안전·일정 기준은 내가 책임지고, 순서·인력은 네 판단을 믿는다고 역할을 정해 말한다.' },
    ],
  },
  {
    id: 'dg-4',
    situation: '본사 스마트안전팀이 현장 확인 없이 로그 요약본만 보고 지적 공문을 보냈다.',
    options: [
      { tendency: 'control', text: '"현장을 모르고 보낸 공문"이라고 반박 공문을 쓴다.' },
      { tendency: 'avoid', text: '본사가 하라는 대로 경위서를 쓰고 작업자들에게 주의를 준다.' },
      { tendency: 'balanced', text: '지적은 수용하되 로그마다 시각·체감온도·연속 작업 시간을 붙인 현장 맥락 보고서를 보낸다.' },
    ],
  },
  {
    id: 'dg-5',
    situation: '협력사 작업반장이 폭염 속 야간 작업에 안전을 이유로 작업중지권을 요구한다. 발주처 준공 일정은 빠듯하다.',
    options: [
      { tendency: 'control', text: '일정은 못 바꾼다며 작업을 계속하게 한다.' },
      { tendency: 'avoid', text: '반장 말대로 멈추고 본사에는 아무 말도 하지 않는다.' },
      { tendency: 'balanced', text: '위험 요소를 확인해 중지 여부를 판단하고, 본사에는 근거 자료와 함께 일정 협의를 요청한다.' },
    ],
  },
  {
    id: 'dg-6',
    situation: '신입이 모르는 것이 생겨도 작업반장에게 묻지 않고 AI 챗봇에만 묻는다.',
    options: [
      { tendency: 'control', text: '"AI 쓰지 말고 반장한테 물어"라고 금지한다.' },
      { tendency: 'avoid', text: '알아서 배우겠지 하고 둔다.' },
      { tendency: 'balanced', text: 'TBM 끝에 질문 1개를 반장에게 하게 하고, 나부터 반장에게 모르는 것을 묻는 모습을 보인다.' },
    ],
  },
  {
    id: 'dg-7',
    situation: '구성원의 공정 리포트에 수치 오류가 세 번째 반복돼 본사에서 정정 요청이 왔다.',
    options: [
      { tendency: 'control', text: '"또 틀렸네요. 세 번째입니다"라고 지적한다.' },
      { tendency: 'avoid', text: '"괜찮아요, 누구나 실수하죠"라고 넘어가고 내가 고친다.' },
      { tendency: 'balanced', text: '야간 작성 노력을 인정하고, 틀린 단위를 짚고, 제출 전 교차 확인 짝을 제안한다.' },
    ],
  },
  {
    id: 'dg-8',
    situation: '아침 TBM에서 리더만 말하고 작업자들은 고개만 끄덕인다.',
    options: [
      { tendency: 'control', text: '안전 수칙을 더 길게 설명하고 "질문 없으면 끝"이라고 마친다.' },
      { tendency: 'avoid', text: '원래 다들 말이 없다고 생각하고 빨리 끝낸다.' },
      { tendency: 'balanced', text: '내 실수담을 먼저 말하고 "어제 아찔했던 순간 하나"를 돌아가며 묻는다.' },
    ],
  },
]

export interface DiagnosisResult {
  empathy: number
  leadership: number
  counts: Record<Tendency, number>
  tendency: Tendency
  recommendedAxis: 'compassion' | 'leadership' | 'both'
}
/** 공감 점수: 균형 100 · 회피 70 · 통제 20 / 리더십 점수: 균형 100 · 통제 70 · 회피 20 */
export function scoreDiagnosis(answers: Record<string, Tendency>): DiagnosisResult {
  const picked = diagnosisItems.map((i) => answers[i.id]).filter((t): t is Tendency => !!t)
  const n = Math.max(1, picked.length)
  const counts: Record<Tendency, number> = { control: 0, avoid: 0, balanced: 0 }
  let e = 0, l = 0
  for (const t of picked) {
    counts[t]++
    e += t === 'balanced' ? 100 : t === 'avoid' ? 70 : 20
    l += t === 'balanced' ? 100 : t === 'control' ? 70 : 20
  }
  const empathy = Math.round(e / n), leadership = Math.round(l / n)
  const tendency: Tendency = counts.control > counts.avoid && counts.control >= counts.balanced ? 'control' : counts.avoid > counts.control && counts.avoid >= counts.balanced ? 'avoid' : 'balanced'
  const diff = empathy - leadership
  return { empathy, leadership, counts, tendency, recommendedAxis: Math.abs(diff) < 10 ? 'both' : diff < 0 ? 'compassion' : 'leadership' }
}
export const tendencyLabel: Record<Tendency, { label: string; desc: string }> = {
  control: { label: '통제형(권위적) 경향', desc: '규정과 일정을 지키는 힘은 있지만, 구성원이 따르려는 마음을 얻기 어렵습니다. 공감 축(Compassion, Collab+Comm)을 집중 보완하세요.' },
  avoid: { label: '회피형(착한 리더) 경향', desc: '구성원의 마음은 헤아리지만 방향을 제시하지 못합니다. 리더십 축(Charisma+Character, Coaching)을 집중 보완하세요.' },
  balanced: { label: '균형형 경향', desc: '원칙과 공감을 함께 쓰는 편입니다. 12주 동안 두 축을 고르게 깊게 하세요.' },
}

/** 2) 현장 딜레마 시나리오 선택형 진단 */
export interface DilemmaScenario {
  id: string
  type: string
  title: string
  situation: string
  /** 연결되는 코스·레슨 */
  linkedCourse: 'compassion' | 'collab-comm' | 'charisma-character'
}
export const dilemmaScenarios: DilemmaScenario[] = [
  { id: 'dl-safety', type: '안전·공기 충돌', title: '폭염 속 야간 작업과 작업중지권', situation: '폭염 속에서 발주처 준공 일정을 맞추기 위해 야간 작업을 서두르려 하자, 협력사 작업반장이 안전 우려로 작업중지권을 요구한다.', linkedCourse: 'charisma-character' },
  { id: 'dl-hq', type: '본사-현장 괴리', title: 'AI 로그 근거 경위서 요구', situation: '본사 스마트안전팀이 AI 로그를 근거로 현장에 경위서 제출을 요구했으나, 실제 현장 여건상 불가피한 작업 동선이었다.', linkedCourse: 'compassion' },
  { id: 'dl-peer', type: '관계 딜레마', title: '승진 누락 입사동기에게 지시하기', situation: '승진 누락으로 감정이 상한 입사동기 대리(현장 실무 담당)에게 새로운 공정 지시와 피드백을 전달해야 한다.', linkedCourse: 'collab-comm' },
]

/** 3) 현장 실천 미션: 작업자 1명에게 첫 마디 건네기 */
export const fieldMission = {
  question: '요즘 현장에서 작업하시면서 가장 힘든 일이나 애로사항이 무엇인가요?',
  intent: '본사와 사무실 모니터(CCTV, AI 로그) 앞에서만 현장을 바라보던 시선을 거두고, 현장 바닥의 물리적 실상과 노동자의 육체적 고충을 첫날부터 체감하게 하는 장치',
  counterparts: ['직영 직원', '협력사 작업자', '작업반장'],
}
