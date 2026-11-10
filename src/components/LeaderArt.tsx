/**
 * 만화·영화 캐릭터 카드 일러스트. 공식 이미지는 저작권 때문에 쓰지 않고, 특징만 살린 단순한 그림을 SVG로 그린다.
 */
type ArtKey = 'whitebeard' | 'luffy' | 'shanks' | 'roger' | 'anzai' | 'aragorn' | 'cap'

interface Spec {
  bg: [string, string]
  skin: string
  hair?: string
  hairShape?: 'short' | 'messy' | 'long' | 'bald' | 'swept'
  mustache?: 'crescent' | 'roger' | 'none' | 'white'
  beard?: 'stubble' | 'none' | 'white'
  hat?: 'bandana' | 'straw' | 'captain' | 'helmet' | 'none'
  extra?: 'scar3' | 'scarCheek' | 'glasses' | 'star'
  coat: string
  emblem?: 'whitebeard' | 'straw' | 'roger' | 'shield' | 'tree' | 'ball' | 'shanks'
}

const specs: Record<ArtKey, Spec> = {
  whitebeard: { bg: ['#fef3c7', '#b45309'], skin: '#e9b48a', hairShape: 'bald', mustache: 'crescent', hat: 'bandana', coat: '#f8fafc', emblem: 'whitebeard' },
  luffy: { bg: ['#fee2e2', '#b91c1c'], skin: '#f2c49b', hair: '#111827', hairShape: 'messy', hat: 'straw', extra: 'scarCheek', coat: '#dc2626', emblem: 'straw' },
  shanks: { bg: ['#fde2e2', '#7f1d1d'], skin: '#efc19a', hair: '#b91c1c', hairShape: 'swept', beard: 'stubble', extra: 'scar3', coat: '#1f2937', emblem: 'shanks' },
  roger: { bg: ['#fde68a', '#78350f'], skin: '#e8b68d', hair: '#111827', hairShape: 'short', mustache: 'roger', hat: 'captain', coat: '#991b1b', emblem: 'roger' },
  anzai: { bg: ['#e0f2fe', '#1e3a8a'], skin: '#f1c7a1', hair: '#f8fafc', hairShape: 'short', mustache: 'white', beard: 'white', extra: 'glasses', coat: '#334155', emblem: 'ball' },
  aragorn: { bg: ['#dcfce7', '#14532d'], skin: '#d9a77f', hair: '#3f2a1d', hairShape: 'long', beard: 'stubble', coat: '#374151', emblem: 'tree' },
  cap: { bg: ['#dbeafe', '#1e3a8a'], skin: '#efc19a', hairShape: 'none' as never, hat: 'helmet', extra: 'star', coat: '#1d4ed8', emblem: 'shield' },
}

export default function LeaderArt({ art, className = '' }: { art: string; className?: string }) {
  const s = specs[art as ArtKey]
  if (!s) return <div className={`flex items-center justify-center bg-slate-200 text-3xl font-black text-slate-400 ${className}`}>?</div>
  const id = `la-${art}`
  return (
    <svg viewBox="0 0 200 240" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.5" cy="0.35" r="0.8">
          <stop offset="0" stopColor={s.bg[0]} />
          <stop offset="1" stopColor={s.bg[1]} />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${id}-bg)`} />
      {/* 배경 엠블럼 */}
      <g opacity="0.18" transform="translate(100 70)">
        <Emblem kind={s.emblem} big />
      </g>
      {/* 어깨·옷 */}
      <path d="M20 240 Q 30 172 100 166 Q 170 172 180 240 Z" fill={s.coat} />
      {art === 'whitebeard' && <path d="M10 240 Q 18 160 60 158 L 70 240 Z M190 240 Q 182 160 140 158 L 130 240 Z" fill="#f1f5f9" opacity="0.9" />}
      {art === 'shanks' && <path d="M12 240 Q 20 168 66 162 L 74 240 Z M188 240 Q 180 168 134 162 L 126 240 Z" fill="#111827" />}
      {art === 'cap' && <g><path d="M70 170 L 130 170 L 128 240 L 72 240 Z" fill="#1e40af" /><path d="M86 200 h28 M86 212 h28" stroke="#f8fafc" strokeWidth="4" /></g>}
      {art === 'luffy' && <path d="M84 168 L 100 196 L 116 168" fill={s.skin} />}
      {/* 목 */}
      <rect x="86" y="140" width="28" height="30" rx="8" fill={s.skin} />
      {/* 머리카락(뒤) */}
      {s.hairShape === 'long' && <path d="M52 92 Q 50 160 70 170 L 130 170 Q 150 160 148 92 Z" fill={s.hair} />}
      {/* 얼굴 */}
      <ellipse cx="100" cy="100" rx="46" ry="52" fill={s.skin} />
      {/* 머리카락(앞) */}
      {s.hairShape === 'short' && <path d="M56 92 Q 60 48 100 46 Q 140 48 144 92 Q 128 70 100 70 Q 72 70 56 92 Z" fill={s.hair} />}
      {s.hairShape === 'messy' && <path d="M54 96 L 60 60 L 72 70 L 80 50 L 92 64 L 100 46 L 110 64 L 122 50 L 128 70 L 140 60 L 146 96 Q 126 74 100 76 Q 74 74 54 96 Z" fill={s.hair} />}
      {s.hairShape === 'swept' && <path d="M54 100 Q 52 50 104 46 Q 150 50 148 98 Q 140 66 112 64 Q 80 66 70 90 Q 62 86 54 100 Z" fill={s.hair} />}
      {s.hairShape === 'long' && <path d="M54 98 Q 56 50 100 48 Q 144 50 146 98 Q 132 66 100 66 Q 70 66 54 98 Z" fill={s.hair} />}
      {/* 모자 */}
      {s.hat === 'bandana' && <path d="M54 88 Q 60 46 100 44 Q 140 46 146 88 Q 124 74 100 74 Q 76 74 54 88 Z" fill="#1f2937" />}
      {s.hat === 'straw' && (
        <g>
          <ellipse cx="100" cy="66" rx="70" ry="14" fill="#f5d77a" stroke="#a16207" strokeWidth="2" />
          <path d="M64 64 Q 66 30 100 28 Q 134 30 136 64 Z" fill="#facc15" stroke="#a16207" strokeWidth="2" />
          <rect x="64" y="54" width="72" height="9" fill="#dc2626" />
        </g>
      )}
      {s.hat === 'captain' && (
        <g>
          <path d="M40 72 Q 100 20 160 72 Q 100 60 40 72 Z" fill="#111827" />
          <path d="M60 70 Q 100 50 140 70" stroke="#facc15" strokeWidth="3" fill="none" />
          <g transform="translate(100 52) scale(0.4)"><Emblem kind="roger" /></g>
        </g>
      )}
      {s.hat === 'helmet' && (
        <g>
          <path d="M52 108 Q 50 46 100 44 Q 150 46 148 108 L 140 108 Q 136 74 100 72 Q 64 74 60 108 Z" fill="#1d4ed8" />
          <path d="M100 52 l4 10 l11 1 l-9 7 l3 11 l-9 -6 l-9 6 l3 -11 l-9 -7 l11 -1 Z" fill="#f8fafc" />
          <path d="M60 96 Q 52 80 44 74 M140 96 Q 148 80 156 74" stroke="#f8fafc" strokeWidth="4" fill="none" />
        </g>
      )}
      {/* 눈·눈썹 */}
      {s.extra === 'glasses' ? (
        <g>
          <circle cx="82" cy="100" r="12" fill="#e0f2fe" stroke="#0f172a" strokeWidth="3" />
          <circle cx="118" cy="100" r="12" fill="#e0f2fe" stroke="#0f172a" strokeWidth="3" />
          <path d="M94 100 h12" stroke="#0f172a" strokeWidth="3" />
        </g>
      ) : (
        <g>
          <path d={art === 'whitebeard' || art === 'aragorn' || art === 'roger' ? 'M70 88 L 92 92 M130 88 L 108 92' : 'M72 90 Q 82 85 92 90 M108 90 Q 118 85 128 90'} stroke="#1f2937" strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="82" cy="101" rx="4.5" ry="5.5" fill="#111827" />
          <ellipse cx="118" cy="101" rx="4.5" ry="5.5" fill="#111827" />
        </g>
      )}
      {s.extra === 'scar3' && <path d="M112 84 l12 26 M118 82 l12 26 M124 80 l12 26" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />}
      {s.extra === 'scarCheek' && <path d="M78 116 l12 2 M82 112 l2 10 M88 113 l2 9" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />}
      {/* 코 */}
      <path d="M100 104 Q 96 116 102 118" stroke="#b77b55" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* 수염·입 */}
      {s.mustache === 'crescent' && <path d="M58 116 Q 74 104 100 122 Q 126 104 142 116 Q 156 90 170 74 Q 162 106 140 128 Q 120 132 100 126 Q 80 132 60 128 Q 38 106 30 74 Q 44 90 58 116 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />}
      {s.mustache === 'roger' && <path d="M68 124 Q 84 112 100 122 Q 116 112 132 124 Q 120 120 100 128 Q 80 120 68 124 Z" fill="#111827" />}
      {s.mustache === 'white' && <path d="M74 124 Q 88 116 100 124 Q 112 116 126 124 Q 112 130 100 128 Q 88 130 74 124 Z" fill="#f8fafc" />}
      {s.beard === 'white' && <path d="M62 120 Q 70 160 100 160 Q 130 160 138 120 Q 126 146 100 146 Q 74 146 62 120 Z" fill="#f8fafc" />}
      {s.beard === 'stubble' && <path d="M64 118 Q 72 154 100 156 Q 128 154 136 118 Q 126 140 100 142 Q 74 140 64 118 Z" fill="#000" opacity="0.18" />}
      {s.mustache !== 'crescent' && <path d={art === 'luffy' ? 'M82 130 Q 100 148 118 130 Z' : 'M88 134 Q 100 140 112 134'} stroke="#7f1d1d" strokeWidth="3" fill={art === 'luffy' ? '#fff' : 'none'} strokeLinecap="round" />}
      {/* 가슴 엠블럼 */}
      {art !== 'cap' && <g transform="translate(100 206) scale(0.42)"><Emblem kind={s.emblem} /></g>}
    </svg>
  )
}

function Emblem({ kind, big = false }: { kind?: Spec['emblem']; big?: boolean }) {
  const k = big ? 1.6 : 1
  switch (kind) {
    case 'whitebeard':
      return (
        <g transform={`scale(${k})`}>
          <path d="M-36 30 L 36 -30 M-36 -30 L 36 30" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <circle r="22" fill="#f8fafc" stroke="#111827" strokeWidth="4" />
          <circle cx="-8" cy="-4" r="4" fill="#111827" /><circle cx="8" cy="-4" r="4" fill="#111827" />
          <path d="M-22 8 Q -10 2 0 10 Q 10 2 22 8 Q 30 -6 36 -14 Q 32 10 18 16 Q 0 18 -18 16 Q -32 10 -36 -14 Q -30 -6 -22 8 Z" fill="#f8fafc" stroke="#111827" strokeWidth="2" />
        </g>
      )
    case 'straw':
      return (
        <g transform={`scale(${k})`}>
          <path d="M-36 30 L 36 -30 M-36 -30 L 36 30" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <circle r="20" fill="#f8fafc" stroke="#111827" strokeWidth="4" />
          <ellipse cy="-14" rx="30" ry="6" fill="#facc15" stroke="#111827" strokeWidth="3" />
          <rect x="-18" y="-22" width="36" height="8" fill="#dc2626" />
        </g>
      )
    case 'roger':
      return (
        <g transform={`scale(${k})`}>
          <path d="M-36 30 L 36 -30 M-36 -30 L 36 30" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <circle r="22" fill="#f8fafc" stroke="#111827" strokeWidth="4" />
          <path d="M-14 10 Q 0 4 14 10 Q 0 14 -14 10 Z" fill="#111827" />
        </g>
      )
    case 'shanks':
      return (
        <g transform={`scale(${k})`}>
          <path d="M-36 30 L 36 -30 M-36 -30 L 36 30" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <circle r="22" fill="#f8fafc" stroke="#111827" strokeWidth="4" />
          <path d="M4 -16 l6 22 M10 -18 l6 22" stroke="#b91c1c" strokeWidth="4" />
        </g>
      )
    case 'shield':
      return (
        <g transform={`scale(${k})`}>
          <circle r="40" fill="#b91c1c" /><circle r="30" fill="#f8fafc" /><circle r="20" fill="#b91c1c" /><circle r="12" fill="#1d4ed8" />
          <path d="M0 -10 l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 Z" fill="#f8fafc" />
        </g>
      )
    case 'tree':
      return (
        <g transform={`scale(${k})`} fill="#f8fafc">
          <rect x="-3" y="-6" width="6" height="40" />
          <path d="M0 -36 L 24 0 L -24 0 Z" /><path d="M0 -20 L 30 14 L -30 14 Z" />
          {[-30, -18, -6, 6, 18, 30].map((x) => <circle key={x} cx={x} cy={-40} r="3" />)}
        </g>
      )
    case 'ball':
      return (
        <g transform={`scale(${k})`}>
          <circle r="30" fill="#f97316" stroke="#7c2d12" strokeWidth="3" />
          <path d="M-30 0 H 30 M0 -30 V 30 M-21 -21 Q 0 0 -21 21 M21 -21 Q 0 0 21 21" stroke="#7c2d12" strokeWidth="3" fill="none" />
        </g>
      )
    default:
      return null
  }
}
