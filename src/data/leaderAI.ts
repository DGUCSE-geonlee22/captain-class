/**
 * Charisma+Character · 질문형 리더 AI 데이터 (담당: 장한이, 팀 문서 '장한이-5C(리더십축)' 기준)
 *
 * 원칙: 리더 AI 속 위인·캐릭터는 정답을 알려주는 존재가 아니라 질문을 떠올리게 하는 안내자다.
 * 판단에 필요한 배경 지식과 참고 자료를 함께 제시하되, 판단은 리더가 한다.
 * ▶ 안내자(guide)와 질문을 더 추가하려면 `guides` 배열에 항목을 넣으면 된다.
 */

export interface Guide {
  id: string
  name: string
  from: string
  /** 이 안내자가 상황을 볼 때 먼저 묻는 질문 */
  questions: string[]
  /** 질문이 리더의 시선을 어디로 향하게 하는지 */
  focus: string
}

export interface LeaderAIScenario {
  id: string
  title: string
  situation: string
  keywords: string[]
  /** 참고 자료 (판단 대신 근거를 제시) */
  references: { title: string; summary: string; source: string }[]
  /** 리더가 방향을 적은 뒤, 영향 범위를 되묻는 질문 */
  followUps: { party: string; question: string }[]
}

export const leaderAIPrinciple = {
  headline: '리더 AI는 답을 주지 않습니다. 질문을 떠올리게 하는 안내자입니다.',
  body: '리더 AI와의 대화가 일방적으로 방향과 조언을 주는 구조라면, AI의 답을 받아 적는 행위에 그쳐 리더의 품성을 배우는 방향에서 멀어집니다. 카리스마는 남이 준 답을 따르는 데서가 아니라, 스스로 판단하고 그 판단에 책임지고 실행하는 경험에서 쌓입니다.',
  effect: '서둘러 결론을 내리기 전에 먼저 묻는 습관, 상대의 입장부터 고려하는 태도, 스스로 근거를 갖고 판단하는 모습이 믿고 따를 수 있는 카리스마의 바탕이 됩니다. AI는 리더의 대체재가 아니라 사고를 넓혀 주는 도구가 됩니다.',
}

export const guides: Guide[] = [
  {
    id: 'whitebeard',
    name: '흰수염',
    from: '원피스 · 흰수염 해적단 선장',
    questions: ['선원이 위험을 말했을 때, 흰수염은 항로보다 무엇을 먼저 확인했을까?', '이 선원이 지금 가장 불안해하는 것은 무엇일까?'],
    focus: '요청한 작업자의 안전과 불안에 먼저 초점을 맞추게 합니다.',
  },
  {
    id: 'yi-sunsin',
    name: '이순신',
    from: '조선 수군 통제사',
    questions: ['이순신은 출전에 앞서 무엇부터 점검했을까?', '지금 작업 조건에서 내가 아직 확인하지 않은 위험 요소는 무엇일까?'],
    focus: '현재 작업 조건과 위험 요소를 먼저 확인하게 합니다.',
  },
  {
    id: 'hq-advocate',
    name: '본사를 설득하는 리더',
    from: '관점 전환 · 상대 입장의 질문',
    questions: ['본사에는 어떤 근거로 이 요청을 설명할 수 있을까?', '본사가 가장 먼저 물어볼 숫자는 무엇일까?'],
    focus: '설득에 필요한 자료를 스스로 찾게 합니다.',
  },
]

export const leaderAIScenarios: LeaderAIScenario[] = [
  {
    id: 'stop-work',
    title: '협력사의 작업 중지 요청 vs 본사의 공기 재촉',
    situation: '협력사가 위험을 이유로 작업 중지를 요청했다. 그러나 본사는 공기를 재촉한다. 신임 현장 리더인 나는 오늘 안에 방향을 정해야 한다.',
    keywords: ['작업 중지', '중지', '협력사', '공기', '본사', '위험', '재촉', '일정'],
    references: [
      {
        title: '삼성물산 작업중지권 운영 (2021)',
        summary: '작업중지권을 선포한 뒤 6개월간 84개 현장에서 2,175건이 활용됐고 98%가 30분 내 조치 가능한 상황이었다. 중단으로 생긴 손실은 협력사에 보전하고 공사계약에 반영했다.',
        source: '김원태 · 토목업종 HR 프로그램 벤치마크 조사 (이코노미스트, 파이낸셜뉴스 보도)',
      },
      {
        title: '중대재해처벌법과 본사-현장 소통',
        summary: '건설현장 중대재해 판결 16건 중 경영책임자 15명이 유죄를 받았다. 현장의 위험 정보가 본사 경영진에게 제때 닿아야 하는 이유다.',
        source: '김원태 · 토목업종 HR 프로그램 벤치마크 조사 (법무법인 대륜 정리)',
      },
    ],
    followUps: [
      { party: '협력사', question: '작업이 멈췄을 때 생기는 비용과 일정 영향은 누가 어떻게 부담하게 될까?' },
      { party: '본사', question: '본사에 이 부분을 협의해야 한다면 어떤 자료가 필요할까?' },
      { party: '작업자', question: '내가 정한 방향을 들은 작업자는 내일 아침 어떤 마음으로 현장에 나올까?' },
    ],
  },
  {
    id: 'hq-letter',
    title: '본사의 로그 기반 지적 공문',
    situation: '본사 스마트안전팀이 현장 확인 없이 AI 로그 요약본만 보고 A파트에 지적 공문을 보냈다. 반박할지, 수용할지, 다른 길이 있는지 정해야 한다.',
    keywords: ['공문', '지적', '본사', '로그', '스마트안전팀', '요약'],
    references: [
      {
        title: '로그 요약본에 현장 맥락 칸 추가 (교차 부서 리더 커뮤니티)',
        summary: '현장 피드백을 반영해 공문 양식에 "현장 확인 여부"와 "환경 데이터" 칸을 넣은 사례. 반박 공문 대신 현장 맥락 보고서로 대응한 현장소장의 P난처 사례도 있다.',
        source: 'CC 내부 · P난처 사례 "본사의 로그 기반 지적 공문 대응"',
      },
    ],
    followUps: [
      { party: '본사', question: '본사 담당자는 어떤 정보와 압박 속에서 이 공문을 보냈을까?' },
      { party: '작업자', question: '공문을 그대로 전달하면 작업자들은 무엇을 느낄까?' },
      { party: '다음 공문', question: '다음 공문 전에 본사와 합의해 둘 절차는 무엇일까?' },
    ],
  },
]

/** 상황 자유 입력 시 가장 가까운 시나리오를 찾는다 (없으면 첫 번째의 참고 자료 없이 일반 질문만) */
export function matchLeaderScenario(text: string): LeaderAIScenario | undefined {
  const t = text.toLowerCase()
  let best: { s: LeaderAIScenario; n: number } | undefined
  for (const s of leaderAIScenarios) {
    const n = s.keywords.filter((k) => t.includes(k.toLowerCase())).length
    if (n > 0 && (!best || n > best.n)) best = { s, n }
  }
  return best?.s
}
