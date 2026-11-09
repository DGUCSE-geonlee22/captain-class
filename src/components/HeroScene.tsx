/**
 * 홈 히어로 장면 — 남색 바다 위의 배(캡틴), 해무, 파도. 외부 이미지 없이 SVG로 그린다.
 */
export default function HeroScene({ className = '' }: { className?: string }) {
  const wave = (y: number, amp: number) => {
    let d = `M0 ${y}`
    for (let x = 0; x <= 2880; x += 120) d += ` q 60 ${-amp} 120 0`
    return d + ` L2880 1000 L0 1000 Z`
  }
  return (
    <svg className={className} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f172e" />
          <stop offset="0.45" stopColor="#1E2A4A" />
          <stop offset="0.7" stopColor="#2a4a73" />
          <stop offset="1" stopColor="#1a6b86" />
        </linearGradient>
        <linearGradient id="hs-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f7a8c" />
          <stop offset="1" stopColor="#0b2a44" />
        </linearGradient>
        <radialGradient id="hs-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F28C28" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#F28C28" stopOpacity="0.25" />
          <stop offset="1" stopColor="#F28C28" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hs-haze" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9fd3e8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#9fd3e8" stopOpacity="0" />
        </radialGradient>
        <filter id="hs-blur"><feGaussianBlur stdDeviation="18" /></filter>
      </defs>
      <rect width="1440" height="900" fill="url(#hs-sky)" />
      <ellipse cx="1080" cy="470" rx="260" ry="120" fill="url(#hs-sun)" filter="url(#hs-blur)" />
      <ellipse className="mist" cx="500" cy="520" rx="700" ry="160" fill="url(#hs-haze)" />
      {/* 먼 수평선·도시 실루엣 */}
      <g opacity="0.55" fill="#0c1b33">
        {[60, 140, 200, 290, 350, 420, 520, 600, 690, 760, 830, 940, 1010, 1100, 1190, 1280, 1360].map((x, i) => (
          <rect key={i} x={x} y={500 - (i % 4) * 22 - (i % 3) * 14} width={28 + (i % 3) * 18} height={120} />
        ))}
        {[180, 470, 1040, 1230].map((x, i) => (
          <rect key={`c${i}`} x={x} y={430 - (i % 2) * 30} width={10} height={200} />
        ))}
      </g>
      <rect y="560" width="1440" height="340" fill="url(#hs-sea)" />
      {/* 파도 레이어 */}
      <g className="wave-drift-slow" opacity="0.5"><path d={wave(590, 10)} fill="#2a8aa0" /></g>
      <g className="wave-drift" opacity="0.6"><path d={wave(640, 14)} fill="#1b5f7a" /></g>
      {/* 배 */}
      <g transform="translate(560 560)"><g className="ship-bob">
        <path d="M0 60 L300 60 L280 100 L30 100 Z" fill="#0a1626" />
        <path d="M30 100 L280 100 Q 240 130 150 132 Q 60 130 30 100 Z" fill="#0e2240" />
        <rect x="70" y="28" width="150" height="34" rx="6" fill="#152c4a" />
        <rect x="100" y="4" width="80" height="28" rx="5" fill="#1d3a5c" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={82 + i * 28} y={38} width={18} height={12} rx={2} fill="#ffd38a" opacity="0.9" />)}
        <rect x="110" y="12" width="60" height="12" rx="2" fill="#9fd3e8" opacity="0.8" />
        <rect x="190" y="-30" width="6" height="40" fill="#0a1626" />
        <path d="M196 -30 L236 -20 L196 -10 Z" fill="#F28C28" />
        <ellipse cx="150" cy="104" rx="200" ry="10" fill="#9fd3e8" opacity="0.18" />
      </g></g>
      <g className="wave-drift" opacity="0.8"><path d={wave(700, 16)} fill="#114b63" /></g>
      <g className="wave-drift-slow" opacity="0.95"><path d={wave(780, 18)} fill="#0b2f47" /></g>
      <rect y="760" width="1440" height="140" fill="url(#hs-sea)" opacity="0.6" />
    </svg>
  )
}
