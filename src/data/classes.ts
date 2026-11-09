import type { HrdClass, MileageRule } from './types'

/** HRD 심리전문가 수업 (목업 3개) */
export const hrdClasses: HrdClass[] = [
  {
    id: 'hc-1',
    title: '현장 리더를 위한 정서 읽기의 기초',
    instructor: 'HRD팀 · 임상심리전문가',
    schedule: '매월 둘째 주 화요일 16:00 · 90분 · 온라인',
    summary: '감정을 단정하지 않고 신호를 관찰하는 법. "화났다"가 아니라 "무엇이 보이는가"로 말하는 연습.',
  },
  {
    id: 'hc-2',
    title: '심리적 안전감과 TBM',
    instructor: 'HRD팀 · 조직심리 박사',
    schedule: '매월 넷째 주 목요일 15:00 · 120분 · 본사 교육장',
    summary: '작업자가 위험을 말할 수 있는 팀의 조건. 리더의 자기 개방과 질문 설계.',
  },
  {
    id: 'hc-3',
    title: 'AI 감시 환경에서의 신뢰 회복',
    instructor: '외부 초빙 · 산업심리 전문가',
    schedule: '분기 1회 · 180분 · 워크숍',
    summary: '감시로 느껴지는 기술을 보호로 바꾸는 소통. 로그 전달 방식과 작업자 반응 사례.',
  },
]

/**
 * 마일리지 규칙 (목업). 리워드 체계는 준비 중이며, 벤치마크는 건설사 소장 포상 제도.
 * ▶ 리워드 담당이 아래 규칙과 src/pages/CompletionPage.tsx의 자리표시를 채운다.
 */
export const mileageRules: MileageRule[] = [
  { id: 'm-signal', label: '신호 노트 작성', points: 10 },
  { id: 'm-practice', label: '대화 연습실 시나리오 완주', points: 20 },
  { id: 'm-log', label: '실천 Log 기록', points: 15 },
  { id: 'm-beforeafter', label: '비포/애프터 기록', points: 10 },
  { id: 'm-mission', label: '주차 현업 미션 완료', points: 30 },
  { id: 'm-consult', label: '익명 상담 체험 답변', points: 15 },
  { id: 'm-agreement', label: '협업 합의서 작성', points: 40 },
  { id: 'm-solution', label: 'P난처 솔루션 등록 (리더 전용)', points: 50 },
  { id: 'm-quiz', label: '퀵 테스트 완료', points: 5 },
  { id: 'm-interview', label: '면담 준비 노트 저장', points: 5 },
]

export const rewardPlaceholder = {
  title: '리워드 체계 준비 중',
  note: '벤치마크: 건설사 소장 포상 제도',
}
