import type { MileageRule } from './types'

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
  { id: 'm-interview', label: '면담 준비 노트 저장', points: 5 },
  { id: 'm-judgment', label: '리더 AI 판단 기록', points: 15 },
  { id: 'm-delegation', label: '팀원 판단 위임 기준표 작성', points: 20 },
  { id: 'm-coaching', label: '코칭 면담 질문', points: 10 },
  { id: 'm-growth', label: '팀원 성취 경험 단계 기록', points: 10 },
  { id: 'm-diagnosis', label: '0주차 2축 자기진단', points: 20 },
  { id: 'm-dilemma', label: '0주차 딜레마 시나리오 진단', points: 10 },
  { id: 'm-field', label: '0주차 현장 대면 소통 리포트', points: 20 },
]

export const rewardPlaceholder = {
  title: '리워드 체계 준비 중',
  note: '벤치마크: 건설사 소장 포상 제도',
}
