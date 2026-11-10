import type { TeamMember } from './types'

/** 데모 로그인 사용자 */
export const demoUser = {
  name: '이하영',
  rank: '과장',
  title: '신임 공사 A파트장',
  org: '본사 · 현장 A파트',
  context: '연차 높은 B·C파트장과 경쟁하는 신임 파트장',
}

/** 조직 소개 (홈·소개 문구에 사용) */
export const organization = {
  name: '(가상) 대형 토목·건설 사기업',
  size: '임직원 약 1,500명',
  hq: ['스마트안전팀(AI 관제)', '공무팀', 'HRD팀'],
  site: ['현장소장', '공사 A파트', '공사 B파트', '공사 C파트'],
  background:
    '중대재해처벌법 강화로 AI 안전 감시 CCTV와 IoT 센서가 도입됐고, 규정 위반 로그가 실시간으로 파트장에게 전달된다. 작업자들은 이를 감시로 느끼고, 본사는 로그 요약본만 보고 지적 공문을 보낸다.',
}

/** A파트 구성원 (목업 인물) */
export const teamMembers: TeamMember[] = [
  {
    id: 'lee-gang',
    name: '이강 대리',
    role: '공사 A파트 · 대리',
    situation: '승진에서 밀린 입사동기. 작업반장들의 신망이 두텁고, 지시·피드백이 부담스러운 상대',
    overloadIndex: 62,
    recentTurningPoint: '파트장 인사 발령 직후 · 작업반장 조율 업무 집중',
  },
  {
    id: 'lee-gyubong',
    name: '이규봉',
    role: '공사 A파트 · 2년차',
    situation: 'AI 로그 처리는 잘하지만 현장에 나가지 않고 소통이 없음',
    overloadIndex: 48,
    recentTurningPoint: '안전 로그 처리량 전월 대비 1.4배 · 현장 출입 기록 주 1회',
  },
  {
    id: 'kim-duhyeon',
    name: '김두현',
    role: '공사 A파트 · 2년차',
    situation: "AI 공정 리포트의 '지연' 경고로 압박이 큼. 실제로는 개인적 고충이 있음",
    overloadIndex: 81,
    recentTurningPoint: 'B구역 기초공사 → 골조 전환 구간 · 지연 경고 3회 연속',
  },
  {
    id: 'newbie-1',
    name: '신입 박○○',
    role: '공사 A파트 · 신입',
    situation: '모르는 것이 생기면 작업반장 대신 AI에만 물어봄',
    overloadIndex: 55,
    recentTurningPoint: '입사 7주차 · 첫 단독 검측 배정',
  },
  {
    id: 'newbie-2',
    name: '신입 최○○',
    role: '공사 A파트 · 신입',
    situation: '늘 긴장해 있음. 질문을 피하고 AI에 의존함',
    overloadIndex: 70,
    recentTurningPoint: '입사 7주차 · TBM 발표 순번 배정',
  },
  {
    id: 'site-gongmu',
    name: '현장 공무 박○○',
    role: '공사 A파트 · 현장 공무 담당 (3년차)',
    situation: '협력사의 작업 중지 요청을 본사에 전달해야 하는데, 협력사 요청과 본사 압박 사이에서 어느 쪽에도 제대로 설명하지 못해 위축됨 (장한이 Coaching 시나리오 인물)',
    overloadIndex: 77,
    recentTurningPoint: '협력사 작업중지권 요청 1건 · 본사 공기 재촉 공문 수신',
  },
  {
    id: 'foreman',
    name: '고참 작업반장',
    role: '철근 작업반 · 반장',
    situation: '더위 속 연속 작업 중 안전모를 올렸다가 AI 경고를 받고 반발함',
    overloadIndex: 74,
    recentTurningPoint: '폭염 경보 3일차 · 철근 조립 공정 피크',
  },
]
