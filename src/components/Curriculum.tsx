import { Check, Flag, Ship } from 'lucide-react'
import { journey, weekPlan } from '../data/journey'
import { axisMeta } from '../data/courses'
import { useApp } from '../context/AppContext'
import type { WeekPlan } from '../data/types'

const courseColor = (p: WeekPlan) => {
  if (p.courseId === 'compassion' || p.courseId === 'collab-comm') return axisMeta.compassion.color
  if (p.courseId === 'charisma-character' || p.courseId === 'coaching') return axisMeta.leadership.color
  if (p.courseId === 'mixed') return `linear-gradient(135deg, ${axisMeta.compassion.color} 50%, ${axisMeta.leadership.color} 50%)`
  if (p.courseId === 'construction') return axisMeta.foundation.color
  return '#94a3b8'
}

/** 주차 스트립: 0~13주 눈금 + 단계 띠 + 현재 주차의 배 */
export function WeekStrip({ interactive = true }: { interactive?: boolean }) {
  const { state, setDemoWeek } = useApp()
  const week = state.demoWeek
  const stages = journey.filter((s) => s.weeks.length > 0)
  return (
    <div className="card p-6">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
        <span>{interactive ? '주차를 누르면 데모 주차가 바뀝니다' : '12주 항해'}</span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: axisMeta.compassion.color }} /> 공감 축</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: axisMeta.leadership.color }} /> 리더십 축</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: axisMeta.foundation.color }} /> Construction (0주차 진단)</span>
        </span>
      </div>
      {/* 단계 띠 */}
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
        {stages.map((s) => {
          const start = s.weeks[0]
          const span = s.weeks.length
          const bg = s.axis === 'compassion' ? axisMeta.compassion.color : s.axis === 'leadership' ? axisMeta.leadership.color : s.axis === 'foundation' ? axisMeta.foundation.color : s.axis === 'mixed' ? `linear-gradient(90deg, ${axisMeta.compassion.color}, ${axisMeta.leadership.color})` : '#94a3b8'
          return (
            <div key={s.id} className="rounded-md px-2 py-1 text-center text-[11px] font-bold text-white" style={{ gridColumn: `${start + 1} / span ${span}`, background: bg }}>
              {s.order}. {s.name}
            </div>
          )
        })}
      </div>
      {/* 눈금 */}
      <div className="relative mt-12 grid" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
        <div className="absolute left-0 right-0 top-[18px] h-px border-t-2 border-dashed border-slate-200" />
        {weekPlan.map((p) => {
          const isCurrent = p.week === week
          const isPast = p.week < week
          return (
            <button
              key={p.week}
              disabled={!interactive}
              onClick={() => setDemoWeek(p.week)}
              className="group relative flex flex-col items-center disabled:cursor-default"
              title={p.title}
            >
              {isCurrent && (
                <span className="absolute -top-9 flex items-center gap-1 rounded-full bg-safety-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
                  <Ship size={12} /> 현재
                </span>
              )}
              <span
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white text-xs font-bold text-white shadow transition ${interactive ? 'group-hover:scale-110' : ''} ${isCurrent ? 'ring-4 ring-safety-200' : ''}`}
                style={{ background: p.week === 12 ? '#F28C28' : courseColor(p), opacity: isPast || isCurrent ? 1 : 0.5 }}
              >
                {p.week === 12 ? <Flag size={14} /> : isPast ? <Check size={14} /> : p.week === 13 ? '+' : p.week}
              </span>
              <span className={`mt-1.5 text-[11px] ${isCurrent ? 'font-bold text-navy-800' : 'text-slate-500'}`}>{p.week === 0 ? '진단' : p.week === 13 ? '13주+' : `${p.week}주`}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
