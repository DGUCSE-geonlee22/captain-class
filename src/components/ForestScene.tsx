/**
 * 피난처(P난처) 장면 — 안개 낀 침엽수 숲, 나무 판자 A형 쉘터, 모닥불, 앉아 있는 사람.
 * 외부 이미지 없이 SVG와 CSS 애니메이션으로만 그린다.
 */
export default function ForestScene({ className = '' }: { className?: string }) {
  // 뒤쪽(희미한 파랑) → 앞쪽(짙은 남색) 순서로 나무 기둥
  const backTrees = [40, 130, 230, 330, 470, 560, 680, 790, 900, 1010, 1120, 1250, 1360]
  const midTrees = [-10, 90, 190, 300, 420, 520, 640, 760, 880, 980, 1090, 1190, 1310, 1410]
  const frontTrees = [20, 160, 380, 1080, 1280, 1420]

  const trunk = (x: number, w: number, h: number, fill: string, key: string) => (
    <polygon key={key} points={`${x - w / 2},900 ${x + w / 2},900 ${x + w * 0.32},${900 - h} ${x - w * 0.32},${900 - h}`} fill={fill} />
  )
  const branches = (x: number, h: number, fill: string, key: string) =>
    [0.25, 0.42, 0.6, 0.78].map((f, i) => (
      <g key={`${key}-${i}`} opacity={0.9}>
        <path d={`M${x} ${900 - h * f} q-70 -8 -120 30`} stroke={fill} strokeWidth={6 - i} fill="none" strokeLinecap="round" />
        <path d={`M${x} ${900 - h * f + 24} q70 -10 115 26`} stroke={fill} strokeWidth={6 - i} fill="none" strokeLinecap="round" />
      </g>
    ))

  return (
    <svg className={className} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="fs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06111c" />
          <stop offset="0.35" stopColor="#0f2d45" />
          <stop offset="0.62" stopColor="#1a4b68" />
          <stop offset="0.8" stopColor="#163a52" />
          <stop offset="1" stopColor="#120f0a" />
        </linearGradient>
        <radialGradient id="fs-mistglow" cx="0.55" cy="0.55" r="0.5">
          <stop offset="0" stopColor="#9fd3e8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9fd3e8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fs-fire" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd38a" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#ff9a2e" stopOpacity="0.75" />
          <stop offset="0.55" stopColor="#e0641a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#e0641a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fs-ground" cx="0.5" cy="1" r="0.8">
          <stop offset="0" stopColor="#f0a04b" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#a65a1e" stopOpacity="0.55" />
          <stop offset="1" stopColor="#120f0a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fs-plank" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2614" />
          <stop offset="0.5" stopColor="#8a5a2b" />
          <stop offset="1" stopColor="#d08a44" />
        </linearGradient>
        <linearGradient id="fs-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffe7a8" />
          <stop offset="0.4" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff6a1f" stopOpacity="0" />
        </linearGradient>
        <filter id="fs-blur-lg" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="fs-blur-sm" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="fs-blur-xs"><feGaussianBlur stdDeviation="1.5" /></filter>
      </defs>

      {/* 하늘과 안개 */}
      <rect width="1440" height="900" fill="url(#fs-sky)" />
      <ellipse className="mist" cx="760" cy="430" rx="620" ry="260" fill="url(#fs-mistglow)" />
      <ellipse className="mist" cx="900" cy="520" rx="420" ry="160" fill="url(#fs-mistglow)" style={{ animationDelay: '-7s' }} />

      {/* 뒤쪽 나무 (흐림) */}
      <g filter="url(#fs-blur-lg)" opacity="0.7">
        {backTrees.map((x, i) => trunk(x, 26 + (i % 3) * 6, 760 + (i % 4) * 40, '#2b5f80', `b${i}`))}
      </g>
      {/* 중간 나무 */}
      <g filter="url(#fs-blur-sm)" opacity="0.9">
        {midTrees.map((x, i) => trunk(x, 34 + (i % 3) * 8, 820 + (i % 3) * 30, '#163a52', `m${i}`))}
        {midTrees.filter((_, i) => i % 2 === 0).map((x, i) => branches(x, 840, '#12304a', `mb${i}`))}
      </g>
      {/* 앞쪽 나무 (선명, 가장 어둡고 굵음) */}
      <g>
        {frontTrees.map((x, i) => trunk(x, 70 + (i % 2) * 24, 900, '#07131f', `f${i}`))}
        {frontTrees.map((x, i) => branches(x, 900, '#07131f', `fb${i}`))}
      </g>

      {/* 땅 */}
      <path d="M0 900 L0 735 Q 300 700 620 720 Q 900 740 1440 700 L1440 900 Z" fill="#0d0b08" />
      <ellipse cx="700" cy="800" rx="520" ry="150" fill="url(#fs-ground)" />

      {/* 모닥불 빛 (큰 글로우) */}
      <ellipse className="fire-glow" cx="700" cy="700" rx="360" ry="240" fill="url(#fs-fire)" filter="url(#fs-blur-lg)" />

      {/* A형 쉘터 */}
      <g transform="translate(300 480)">
        <polygon points="0,260 260,260 150,0" fill="#1a1109" />
        <polygon points="18,250 150,22 150,250" fill="url(#fs-plank)" opacity="0.95" />
        <polygon points="150,22 150,250 244,250" fill="#2a1a0c" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={32 + i * 17} y1={250} x2={150} y2={48 + i * 29} stroke="#1a1109" strokeWidth="2.2" opacity="0.8" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`r${i}`} x1={150} y1={30 + i * 44} x2={236 - i * 4} y2={250} stroke="#0d0905" strokeWidth="2" opacity="0.8" />
        ))}
        <rect x="-40" y="-18" width="330" height="22" rx="4" fill="#2a1a0c" transform="rotate(-6 150 0)" />
        <rect x="-10" y="-30" width="300" height="14" rx="3" fill="#3a2614" transform="rotate(4 150 0)" />
      </g>

      {/* 장작과 불꽃 */}
      <g transform="translate(700 735)">
        <rect x="-46" y="-6" width="92" height="12" rx="6" fill="#3a2614" transform="rotate(-10)" />
        <rect x="-44" y="-4" width="88" height="12" rx="6" fill="#2a1a0c" transform="rotate(14)" />
        <ellipse className="fire-glow" cx="0" cy="-10" rx="70" ry="40" fill="#ff8a1f" opacity="0.5" filter="url(#fs-blur-sm)" />
        <path className="flame" d="M0 -8 C -28 -30, -22 -70, 0 -108 C 22 -70, 28 -30, 0 -8 Z" fill="url(#fs-flame)" filter="url(#fs-blur-xs)" />
        <path className="flame flame-2" d="M-14 -8 C -30 -26, -20 -50, -8 -70 C 2 -48, 6 -26, -14 -8 Z" fill="#ffb347" opacity="0.9" />
        <path className="flame flame-3" d="M14 -8 C 30 -26, 22 -56, 10 -78 C 0 -52, -4 -26, 14 -8 Z" fill="#ffd38a" opacity="0.85" />
        <path className="flame flame-2" d="M0 -10 C -10 -22, -8 -40, 0 -56 C 8 -40, 10 -22, 0 -10 Z" fill="#fff3cf" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} className="spark" cx={-20 + i * 8} cy={-40} r={2 - (i % 2) * 0.6} fill="#ffd38a" style={{ animationDelay: `${i * 0.5}s`, ['--dx' as string]: `${(i % 2 ? 1 : -1) * (8 + i * 6)}px` }} />
        ))}
      </g>

      {/* 앉아 있는 사람 (실루엣) */}
      <g transform="translate(905 690)">
        <circle cx="0" cy="-70" r="16" fill="#0b0906" />
        <path d="M-22 -54 Q 0 -66 22 -52 L 30 10 Q 0 22 -32 12 Z" fill="#0b0906" />
        <path d="M-32 10 Q -56 20 -70 46 L -26 48 Z" fill="#0b0906" />
        <path d="M22 -40 Q 36 -10 24 10" stroke="#0b0906" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M-6 -46 q-6 4 -8 10" stroke="#e0641a" strokeWidth="1.5" fill="none" opacity="0.6" />
      </g>

      {/* 바닥 돌·풀 디테일 */}
      <ellipse cx="520" cy="770" rx="36" ry="12" fill="#1a110a" />
      <ellipse cx="880" cy="792" rx="28" ry="9" fill="#1a110a" />
      <path d="M0 900 L0 820 Q 200 790 420 812 Q 700 850 1000 816 Q 1250 790 1440 830 L1440 900 Z" fill="#070503" />
    </svg>
  )
}
