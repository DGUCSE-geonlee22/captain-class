import { Link } from 'react-router-dom'
import { ArrowRight, Check, Flag, HardHat, Lock, Ship } from 'lucide-react'
import { construction, journey, weekPlan } from '../data/journey'
import { axisMeta, courses } from '../data/courses'
import { useApp } from '../context/AppContext'
import type { WeekPlan } from '../data/types'

const courseColor = (p: WeekPlan) => {
  if (p.courseId === 'compassion' || p.courseId === 'collab-comm') return axisMeta.compassion.color
  if (p.courseId === 'charisma-character' || p.courseId === 'coaching') return axisMeta.leadership.color
  if (p.courseId === 'mixed') return `linear-gradient(135deg, ${axisMeta.compassion.color} 50%, ${axisMeta.leadership.color} 50%)`
  return '#94a3b8'
}
const courseLink = (p: WeekPlan) => {
  if (p.courseId === 'common') return p.week === 0 ? '/records?tab=diagnosis' : '/completion'
  if (p.courseId === 'mixed') return p.week === 11 ? '/course/collab-comm/pulse' : '/bridge?tab=matching'
  return `/course/${p.courseId}`
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
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-dashed" style={{ borderColor: axisMeta.foundation.color }} /> Construction 배치 예정</span>
        </span>
      </div>
      {/* 단계 띠 */}
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
        {stages.map((s) => {
          const start = s.weeks[0]
          const span = s.weeks.length
          const bg = s.axis === 'compassion' ? axisMeta.compassion.color : s.axis === 'leadership' ? axisMeta.leadership.color : s.axis === 'mixed' ? `linear-gradient(90deg, ${axisMeta.compassion.color}, ${axisMeta.leadership.color})` : '#94a3b8'
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

/** 주차별 커리큘럼 표. compact=true면 홈용 요약 */
export function CurriculumTable({ compact = false }: { compact?: boolean }) {
  const { state } = useApp()
  const week = state.demoWeek
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="bg-navy-700 text-left text-[11px] uppercase tracking-wider text-white/80">
            <th className="w-[72px] px-4 py-3 font-semibold">주차</th>
            <th className="w-[96px] px-3 py-3 font-semibold">단계</th>
            <th className="w-[200px] px-3 py-3 font-semibold">코스 (축)</th>
            <th className="px-3 py-3 font-semibold">수업 내용</th>
            {!compact && <th className="w-[240px] px-3 py-3 font-semibold">현업 미션</th>}
            <th className={`${compact ? 'w-[260px]' : 'w-[200px]'} px-3 py-3 font-semibold`}>{compact ? '현업 미션' : '산출물 · 측정'}</th>
            <th className="w-[112px] px-3 py-3 font-semibold">상태</th>
          </tr>
        </thead>
        <tbody>
          {weekPlan.map((p) => {
            const stage = journey.find((s) => s.id === p.stageId)!
            const isCurrent = p.week === week
            const isPast = p.week < week
            const course = courses.find((c) => c.id === p.courseId)
            const lessons = p.lessonIds.map((id) => courses.flatMap((c) => c.lessons).find((l) => l.id === id)).filter(Boolean)
            return (
              <tr key={p.week} className={`border-t border-slate-100 align-top transition ${isCurrent ? 'bg-safety-50/70' : isPast ? 'bg-white' : 'bg-slate-50/40'}`}>
                <td className="px-4 py-3">
                  <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-black ${isCurrent ? 'bg-safety-500 text-white' : isPast ? 'bg-navy-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {p.week === 0 ? '0' : p.week === 13 ? '13+' : p.week}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs font-semibold text-slate-600">{stage.order}. {stage.name}<br /><span className="font-normal text-slate-400">{stage.weekLabel}</span></td>
                <td className="px-3 py-3">
                  <Link to={courseLink(p)} className="inline-flex items-center gap-2 text-xs font-bold text-navy-800 hover:underline">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: courseColor(p) }} />
                    {p.courseLabel}
                  </Link>
                  {course && <p className="mt-0.5 text-[11px] text-slate-400">{course.axisLabel}</p>}
                </td>
                <td className="px-3 py-3">
                  <p className="font-semibold text-navy-800">{p.title}</p>
                  {!compact && (
                    <ul className="mt-1.5 space-y-0.5 text-xs text-slate-600">
                      {p.topics.map((t) => <li key={t}>· {t}</li>)}
                    </ul>
                  )}
                  {!compact && lessons.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lessons.map((l) => (
                        <Link key={l!.id} to={l!.path ?? '#'} className="badge border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100">
                          {l!.title.replace(/^레슨 ([A-Z])\. /, '$1 · ')} <ArrowRight size={10} />
                        </Link>
                      ))}
                    </div>
                  )}
                </td>
                {!compact && <td className="px-3 py-3 text-xs text-slate-700">{p.mission}</td>}
                <td className="px-3 py-3 text-xs text-slate-700">{compact ? p.mission : p.output}</td>
                <td className="px-3 py-3">
                  {p.status === 'skeleton' ? (
                    <span className="badge bg-slate-100 text-slate-500"><Lock size={10} /> 준비 중 · {course?.owner}</span>
                  ) : isCurrent ? (
                    <span className="badge bg-safety-500 text-white">이번 주</span>
                  ) : isPast ? (
                    <span className="badge bg-teal-50 text-teal-700"><Check size={10} /> 수강 완료</span>
                  ) : (
                    <span className="badge bg-slate-100 text-slate-500">예정</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Link to="/course/construction" className="flex items-center gap-4 border-t-2 border-dashed px-5 py-4 text-sm transition hover:bg-safety-50/60" style={{ borderColor: axisMeta.foundation.color }}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed text-safety-600" style={{ borderColor: axisMeta.foundation.color }}><HardHat size={16} /></span>
        <span className="flex-1">
          <span className="font-bold text-safety-700">Construction · 기초 역량</span>
          <span className="ml-2 text-slate-600">현장 업종의 큰 흐름과 관리감독 역량의 기초</span>
        </span>
        <span className="badge bg-safety-100 text-safety-700">배치 주차 {construction.weeks} · {construction.note}</span>
      </Link>
    </div>
  )
}
