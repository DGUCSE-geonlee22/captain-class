import type { PulseCardSet } from './types'

/**
 * 1:1 펄스 면담 질문 카드. 팀원(src/data/team.ts의 id)별 정서적 질문 3장.
 * 원칙: AI가 대신 메시지를 보내지 않는다. 리더가 직접 묻도록 돕는 가이드만 둔다.
 */
export const pulseCards: PulseCardSet[] = [
  {
    memberId: 'lee-gang',
    cards: [
      '발령 이후 우리 둘 사이에서 제일 어색했던 순간이 언제였어?',
      '반장들이 너한테 먼저 오는 이유, 내가 배워야 할 게 뭘까?',
      '내가 지시할 때 어떤 방식이 제일 불편해?',
    ],
  },
  {
    memberId: 'lee-gyubong',
    cards: [
      '로그 처리하면서 "이건 현장에서 직접 봐야겠다" 싶었던 건 없었어요?',
      '현장에 나가는 게 부담스러운 이유가 있다면 뭐예요?',
      '규봉 씨가 처리한 로그 중에 가장 억울했을 것 같은 사람은 누구였어요?',
    ],
  },
  {
    memberId: 'kim-duhyeon',
    cards: [
      '요즘 제일 버거운 공정이 뭐예요?',
      '지연 경고가 뜰 때 제일 먼저 드는 생각이 뭐예요?',
      '제가 덜어 줄 수 있는 게 하나 있다면 뭘까요?',
    ],
  },
  {
    memberId: 'newbie-1',
    cards: [
      '요즘 제일 자주 AI한테 물어보는 게 뭐예요?',
      '반장님께 물어보기 어려웠던 순간이 있었어요?',
      '첫 단독 검측 앞두고 제일 걱정되는 건 뭐예요?',
    ],
  },
  {
    memberId: 'newbie-2',
    cards: [
      '요즘 하루 중 언제가 제일 긴장돼요?',
      'TBM 발표 순번이 다가오는데 뭐가 제일 막막해요?',
      '지난주에 "이건 잘했다" 싶은 순간이 하나 있었다면요?',
    ],
  },
  {
    memberId: 'foreman',
    cards: [
      '요즘 더위에 애들 상태는 어떠세요?',
      'AI 경고 중에 반장님 보시기에 제일 말이 안 되는 건 뭐였어요?',
      '제가 본사에 꼭 전해야 할 현장 얘기가 있다면요?',
    ],
  },
]

export const pulseCardsFor = (memberId: string) => pulseCards.find((p) => p.memberId === memberId)?.cards ?? []
