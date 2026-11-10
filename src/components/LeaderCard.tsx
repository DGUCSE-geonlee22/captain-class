import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import LeaderArt from './LeaderArt'
import { categoryMeta, statLabels, type LeaderProfile } from '../data/leaders'

/** 카드 이미지 영역 (실존 인물은 사진, 캐릭터는 일러스트) */
export function LeaderPortrait({ leader, className = '' }: { leader: LeaderProfile; className?: string }) {
  if (leader.image) {
    return <img src={leader.image.src} alt={leader.name} loading="lazy" className={`object-cover ${className}`} style={{ objectPosition: leader.image.position ?? 'center 25%' }} />
  }
  return <LeaderArt art={leader.art ?? ''} className={className} />
}

/** 게임 캐릭터 카드 */
export function LeaderCard({ leader, selected, onClick, size = 'md' }: { leader: LeaderProfile; selected?: boolean; onClick?: () => void; size?: 'md' | 'lg' }) {
  const meta = categoryMeta[leader.category]
  const w = size === 'lg' ? 'w-[300px]' : 'w-[220px]'
  const h = size === 'lg' ? 'h-[250px]' : 'h-[180px]'
  return (
    <button
      onClick={onClick}
      className={`group relative shrink-0 snap-center rounded-[22px] bg-gradient-to-br p-[3px] text-left transition duration-300 ${meta.frame} ${w} ${selected ? '-translate-y-3 scale-[1.04] shadow-[0_18px_40px_-12px_rgba(242,140,40,0.7)] ring-4 ring-safety-400' : 'shadow-lg hover:-translate-y-1.5 hover:shadow-xl'}`}
    >
      <div className="overflow-hidden rounded-[19px] bg-navy-900">
        <div className={`relative ${h} overflow-hidden`}>
          <LeaderPortrait leader={leader} className="h-full w-full transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/10 to-transparent" />
          <span className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.chip}`}>{meta.label}</span>
          {leader.featured && <span className="absolute right-2.5 top-2.5 flex items-center gap-0.5 rounded-full bg-safety-500 px-2 py-0.5 text-[10px] font-bold text-white"><Star size={10} fill="currentColor" /> 시연 추천</span>}
          <div className="absolute inset-x-3 bottom-2">
            <p className="font-display text-[11px] uppercase tracking-[0.2em] text-white/60">Leader</p>
            <p className={`${size === 'lg' ? 'text-2xl' : 'text-lg'} font-black leading-tight text-white`}>{leader.name}</p>
          </div>
        </div>
        <div className="space-y-2 px-3 pb-3 pt-2">
          <p className="line-clamp-1 text-[11px] text-white/55">{leader.origin}</p>
          <p className={`${size === 'lg' ? 'text-sm' : 'line-clamp-2 text-xs'} font-medium leading-snug text-white/90`}>{leader.tagline}</p>
          <div className="space-y-1 pt-1">
            {statLabels.map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-[10px] text-white/50">{s.label}</span>
                <div className="flex flex-1 gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= leader.stats[s.key] ? 'bg-safety-400' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}

/** 가로로 스르륵 넘기는 카드 덱 */
export function LeaderDeck({ list, selectedId, onSelect }: { list: LeaderProfile[]; selectedId?: string; onSelect: (l: LeaderProfile) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 480, behavior: 'smooth' })
  return (
    <div className="relative">
      <button onClick={() => scroll(-1)} className="absolute -left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-700 shadow-lg hover:bg-navy-50" aria-label="이전 카드"><ChevronLeft size={22} /></button>
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-8 pb-6 pt-6">
        {list.map((l) => (
          <LeaderCard key={l.id} leader={l} selected={l.id === selectedId} onClick={() => onSelect(l)} />
        ))}
      </div>
      <button onClick={() => scroll(1)} className="absolute -right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-700 shadow-lg hover:bg-navy-50" aria-label="다음 카드"><ChevronRight size={22} /></button>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0b1424] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0b1424] to-transparent" />
    </div>
  )
}

/** 리더 상세 (도감) */
export function LeaderDetail({ leader }: { leader: LeaderProfile }) {
  const meta = categoryMeta[leader.category]
  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-2">
        <div className={`overflow-hidden rounded-3xl bg-gradient-to-br p-[3px] ${meta.frame}`}>
          <div className="overflow-hidden rounded-[21px] bg-navy-900">
            <LeaderPortrait leader={leader} className="h-[380px] w-full" />
            <div className="p-5 text-white">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.chip}`}>{meta.label}</span>
              <p className="mt-2 text-2xl font-black">{leader.name}</p>
              <p className="text-sm text-white/60">{leader.origin}</p>
            </div>
          </div>
        </div>
        {leader.image ? (
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">이미지: {leader.image.author} · {leader.image.license} · <a href={leader.image.page} target="_blank" rel="noreferrer" className="underline">Wikimedia Commons</a></p>
        ) : (
          <p className="mt-2 text-[11px] text-slate-400">이미지: 저작권 보호 캐릭터라 공식 그림 대신 CC 팀이 그린 카드 일러스트를 씁니다.</p>
        )}
      </div>
      <div className="col-span-3 space-y-5">
        <div className="rounded-2xl bg-navy-700 p-5 text-white">
          <p className="text-xs text-navy-200">한마디로</p>
          <p className="mt-1 text-base font-medium leading-relaxed">"{leader.summary}"</p>
        </div>
        <div>
          <p className="label mb-2">성격</p>
          <div className="grid grid-cols-2 gap-2">
            {leader.traits.map((t) => (
              <div key={t.name} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="text-sm font-bold text-navy-800">{t.name}</p>
                <p className="text-xs text-slate-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="label mb-2">리더십</p>
          <ol className="space-y-2">
            {leader.pillars.map((p, i) => (
              <li key={p.name} className="flex gap-3 rounded-xl bg-white px-4 py-3 shadow-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-safety-500 text-xs font-bold text-white">{i + 1}</span>
                <span><b className="text-sm text-navy-800">{p.name}</b><span className="block text-xs leading-relaxed text-slate-600">{p.desc}</span></span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="label mb-2">대표 사례</p>
          <div className="grid grid-cols-1 gap-2">
            {leader.cases.map((c) => (
              <div key={c.title} className="rounded-xl border-l-4 border-safety-400 bg-safety-50/60 px-4 py-2.5">
                <p className="text-sm font-bold text-navy-800">{c.title}</p>
                <p className="text-xs text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
