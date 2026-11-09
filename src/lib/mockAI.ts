/**
 * 규칙 기반 목업 AI. 실제 AI API는 호출하지 않는다.
 * 원칙: 대필·자동 발송·감정 확정 진단은 하지 않는다. 분류·질문 제시·체크만 한다.
 */
import type { CaseItem, LensPreset, ReplyType } from '../data/types'
import { cases } from '../data/cases'
import { lensPresets } from '../data/lensPresets'

/** 대화 연습실: 직접 입력을 가장 가까운 유형으로 매칭 */
const replyKeywords: Record<ReplyType, string[]> = {
  explore: ['왜', '이유', '괜찮', '힘들', '어때', '어떠', '뭐가', '무엇', '어디', '언제부터', '들어', '말해', '궁금', '어떻게 생각', '?', '요?', '까?'],
  control: ['규정', '당장', '위반', '벌점', '해야', '하세요', '시키', '명령', '무조건', '안 됩니다', '안됩니다', '보고', '책임', '경고', '지시', '따르'],
  avoid: ['글쎄', '일단', '나중에', '알아서', '어쩔 수', '넘어가', '괜찮겠지', '모르겠', '지켜보', '봐서', '뭐…', '그냥', '됐어'],
  empathic: ['고생', '수고', '이해', '같이', '함께', '제가', '약속', '조건', '지켜', '분명', '대신', '요청', '만들', '덜어', '인정', '미안', '고맙', '감사'],
}

export function classifyReply(text: string): ReplyType {
  const t = text.toLowerCase()
  const scores: Record<ReplyType, number> = { control: 0, avoid: 0, explore: 0, empathic: 0 }
  for (const type of Object.keys(replyKeywords) as ReplyType[]) {
    for (const kw of replyKeywords[type]) {
      if (t.includes(kw)) scores[type] += kw.length >= 2 ? 2 : 1
    }
  }
  // 공감형은 질문과 기준이 함께 있을 때 가중
  if (scores.explore > 0 && scores.empathic > 0) scores.empathic += 2
  const best = (Object.keys(scores) as ReplyType[]).reduce((a, b) => (scores[b] > scores[a] ? b : a), 'explore')
  return scores[best] === 0 ? 'explore' : best
}

export const replyTypeLabel: Record<ReplyType, string> = {
  control: '통제형',
  avoid: '회피형',
  explore: '원인 탐색형',
  empathic: '공감+명확형',
}

/** 유형별 지수 변화 (공감도, 명확성, 심리적 안전감) */
export const scoreDelta: Record<ReplyType, { empathy: number; clarity: number; safety: number }> = {
  control: { empathy: -12, clarity: +8, safety: -15 },
  avoid: { empathy: -3, clarity: -14, safety: -6 },
  explore: { empathy: +10, clarity: +2, safety: +10 },
  empathic: { empathy: +12, clarity: +12, safety: +12 },
}

export const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

/** 반려문·지적 코칭 포인트 3가지 (규칙 기반) */
export interface CoachingCheck {
  acknowledged: boolean
  specific: boolean
  direction: boolean
}

const ackWords = ['수고', '고생', '노력', '애쓰', '감사', '고맙', '잘했', '잘 했', '덕분', '충분히', '인정', '알아요', '알고 있']
const directionWords = ['해 주세요', '해주세요', '해 볼까', '해볼까', '다시', '내일', '다음', '수정', '보완', '확인 뒤', '확인 후', '같이', '함께', '제안', '방향', '까지', '개선', '바꿔']
const specificPattern = /(\d+|mm|cm|m |열|행|구역|도면|기준|항목|수치|간격|일정|날짜|구간|보고서|리포트|제출|시간)/

export function coachingCheck(text: string): CoachingCheck {
  const t = text.trim()
  return {
    acknowledged: ackWords.some((w) => t.includes(w)),
    specific: specificPattern.test(t) && t.length > 20,
    direction: directionWords.some((w) => t.includes(w)),
  }
}

export const coachingPointLabels: { key: keyof CoachingCheck; label: string; hint: string }[] = [
  { key: 'acknowledged', label: '노력을 인정했는가', hint: '상대가 들인 시간·시도를 한 문장이라도 언급했는지 봅니다.' },
  { key: 'specific', label: '문제를 구체적으로 설명했는가', hint: '"좀 아닌 것 같다" 대신 기준·수치·위치를 적었는지 봅니다.' },
  { key: 'direction', label: '개선 방향을 제시했는가', hint: '다음에 무엇을, 언제까지 하면 되는지가 드러나는지 봅니다.' },
]

/** P난처: 입력 문장과 사례 DB 매칭 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2)
}

export function matchCases<T extends CaseItem>(query: string, list: readonly T[] = cases as unknown as readonly T[]): { item: T; score: number }[] {
  const q = query.toLowerCase()
  const tokens = tokenize(query)
  return list
    .map((item) => {
      let score = 0
      for (const kw of item.keywords) {
        const k = kw.toLowerCase()
        if (q.includes(k)) score += 3
        else if (tokens.some((t) => t.includes(k) || k.includes(t))) score += 1
      }
      return { item, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.item.helpful - a.item.helpful)
}

export function matchLens(query: string): LensPreset | undefined {
  const q = query.toLowerCase()
  const tokens = tokenize(query)
  let best: { preset: LensPreset; score: number } | undefined
  for (const preset of lensPresets) {
    let score = 0
    for (const kw of preset.keywords) {
      const k = kw.toLowerCase()
      if (q.includes(k)) score += 3
      else if (tokens.some((t) => t.includes(k) || k.includes(t))) score += 1
    }
    if (score > 0 && (!best || score > best.score)) best = { preset, score }
  }
  return best?.preset
}

/** 개인정보 입력 간이 경고 (실명 패턴·전화번호 등) */
export function looksLikePersonalInfo(text: string): boolean {
  return /(\d{2,3}-\d{3,4}-\d{4})|(\d{6}-\d{7})|(@[\w.-]+\.\w+)/.test(text)
}
