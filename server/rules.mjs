/**
 * 규칙 기반 목업 AI (서버판). src/lib/mockAI.ts 와 같은 규칙을 둔다.
 * 실제 AI로 바꾸려면 이 파일의 함수 내부만 교체하면 된다. (클라이언트는 오프라인 시 자체 규칙을 쓴다)
 */
const replyKeywords = {
  explore: ['왜', '이유', '괜찮', '힘들', '어때', '어떠', '뭐가', '무엇', '어디', '언제부터', '들어', '말해', '궁금', '어떻게 생각', '?', '요?', '까?'],
  control: ['규정', '당장', '위반', '벌점', '해야', '하세요', '시키', '명령', '무조건', '안 됩니다', '안됩니다', '보고', '책임', '경고', '지시', '따르'],
  avoid: ['글쎄', '일단', '나중에', '알아서', '어쩔 수', '넘어가', '괜찮겠지', '모르겠', '지켜보', '봐서', '뭐…', '그냥', '됐어'],
  empathic: ['고생', '수고', '이해', '같이', '함께', '제가', '약속', '조건', '지켜', '분명', '대신', '요청', '만들', '덜어', '인정', '미안', '고맙', '감사'],
}

export function classifyReply(text) {
  const t = text.toLowerCase()
  const scores = { control: 0, avoid: 0, explore: 0, empathic: 0 }
  for (const type of Object.keys(replyKeywords)) for (const kw of replyKeywords[type]) if (t.includes(kw)) scores[type] += kw.length >= 2 ? 2 : 1
  if (scores.explore > 0 && scores.empathic > 0) scores.empathic += 2
  const best = Object.keys(scores).reduce((a, b) => (scores[b] > scores[a] ? b : a), 'explore')
  return scores[best] === 0 ? 'explore' : best
}

const ackWords = ['수고', '고생', '노력', '애쓰', '감사', '고맙', '잘했', '잘 했', '덕분', '충분히', '인정', '알아요', '알고 있']
const directionWords = ['해 주세요', '해주세요', '해 볼까', '해볼까', '다시', '내일', '다음', '수정', '보완', '확인 뒤', '확인 후', '같이', '함께', '제안', '방향', '까지', '개선', '바꿔']
const specificPattern = /(\d+|mm|cm|m |열|행|구역|도면|기준|항목|수치|간격|일정|날짜|구간|보고서|리포트|제출|시간)/

export function coachingCheck(text) {
  const t = text.trim()
  return {
    acknowledged: ackWords.some((w) => t.includes(w)),
    specific: specificPattern.test(t) && t.length > 20,
    direction: directionWords.some((w) => t.includes(w)),
  }
}

export function tokenize(text) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length >= 2)
}
