import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronDown, Circle, ClipboardCheck, Clock, Footprints, Play, PlayCircle } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { VideoThumb } from '../components/Video'
import { useApp } from '../context/AppContext'
import { allLectures, courseVisual, totalMinutes, weekLectures } from '../data/lectures'
import { journey, weekPlanFor } from '../data/journey'
import { statusLabel, weekProgress } from '../lib/weekProgress'

export default function CurriculumPage() {
  const { state } = useApp()
  const cur = weekProgress(state, state.demoWeek)
  const nextLecture = cur.w.lectures.find((l) => !cur.isLectureDone(l.id)) ?? cur.w.lectures[0]
  const nextIdx = cur.w.lectures.indexOf(nextLecture)
  const doneWeeks = weekLectures.filter((w) => weekProgress(state, w.week).complete).length
  const totalMin = totalMinutes(allLectures)
  const [open, setOpen] = useState<number[]>([state.demoWeek])
  const toggle = (w: number) => setOpen((o) => (o.includes(w) ? o.filter((x) => x !== w) : [...o, w]))

  return (
    <div>
      <PageHeader
        en="Curriculum"
        title="CC 리더 과정 · 주차별 강의"
        description="매주 강의 영상을 듣고, 5C 확인 활동으로 잘 받아들였는지 확인하고, 현업 과제로 현장에 적용합니다. 강의를 모두 수강하고 확인 활동을 완료하면 그 주차를 이수합니다."
      />

      {/* 과정 요약 + 이어서 수강 */}
      <div className="grid grid-cols-5 gap-6">
        <Link to={`/curriculum/week/${state.demoWeek}?lecture=${nextLecture.id}`} className="group col-span-3 grid grid-cols-5 gap-5 overflow-hidden rounded-3xl bg-navy-800 p-5 text-white transition hover:bg-navy-700">
          <VideoThumb courseId={cur.w.courseId} lecture={nextLecture} index={nextIdx} className="col-span-3" />
          <div className="col-span-2 flex flex-col">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-safety-300">Continue learning</p>
            <p className="mt-1 text-sm text-white/60">{state.demoWeek === 0 ? '오리엔테이션' : state.demoWeek >= 13 ? '13주+ 유지' : `${state.demoWeek}주차`} · {cur.w.theme}</p>
            <p className="mt-2 text-lg font-bold leading-snug">{nextLecture.title}</p>
            <p className="mt-1 text-xs text-white/60">{nextLecture.instructor} · {nextLecture.duration}</p>
            <span className="mt-auto flex items-center gap-2 text-sm font-semibold text-safety-300"><PlayCircle size={18} /> 이어서 수강하기</span>
          </div>
        </Link>
        <div className="col-span-2 card p-6">
          <p className="label">과정 정보</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-black text-navy-800">{weekLectures.length}</p><p className="text-[11px] text-slate-500">주차</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-black text-navy-800">{allLectures.length}</p><p className="text-[11px] text-slate-500">강의</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-black text-navy-800">{Math.floor(totalMin / 60)}h {totalMin % 60}m</p><p className="text-[11px] text-slate-500">총 재생 시간</p></div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-sm"><span className="text-slate-600">이수 주차</span><b className="text-navy-800">{doneWeeks} / {weekLectures.length}</b></div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-safety-500 transition-all" style={{ width: `${(doneWeeks / weekLectures.length) * 100}%` }} /></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Object.entries(courseVisual).map(([k, v]) => <span key={k} className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600"><span className="h-2 w-2 rounded-full" style={{ background: v.to }} />{v.label}</span>)}
          </div>
        </div>
      </div>

      {/* 주차 목록 */}
      <div className="mt-8 space-y-3">
        {weekLectures.map((w) => {
          const p = weekProgress(state, w.week)
          const stage = journey.find((s) => s.id === weekPlanFor(w.week).stageId)!
          const isOpen = open.includes(w.week)
          const v = { ...courseVisual[w.courseId], label: w.week === 13 ? '전 코스 공통' : courseVisual[w.courseId].label }
          return (
            <div key={w.week} className={`overflow-hidden rounded-2xl border bg-white shadow-card ${p.status === 'current' ? 'border-safety-300 ring-2 ring-safety-100' : 'border-slate-100'}`}>
              <button onClick={() => toggle(w.week)} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50/60">
                <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${v.from}, ${v.to})` }}>
                  <span className="text-[9px] uppercase opacity-80">week</span>
                  <span className="text-base font-black leading-none">{w.week === 13 ? '13+' : w.week}</span>
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-[11px] text-slate-500"><span>{stage.order}. {stage.name}</span><span>·</span><span style={{ color: v.to }} className="font-semibold">{v.label}</span><span>·</span><span>{w.provider}</span></span>
                  <span className="mt-0.5 block font-bold text-navy-800">{w.theme}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500"><PlayCircle size={14} /> 강의 {p.watched}/{p.total} · {totalMinutes(w.lectures)}분</span>
                <span className={`flex items-center gap-1 text-xs ${p.checkDone ? 'text-teal-600' : 'text-slate-400'}`}><ClipboardCheck size={14} /> 확인 활동</span>
                <span className={`badge ${statusLabel[p.status].cls}`}>{statusLabel[p.status].label}</span>
                <ChevronDown size={18} className={`text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    {w.lectures.map((l, i) => (
                      <Link key={l.id} to={`/curriculum/week/${w.week}?lecture=${l.id}`} className="group block">
                        <VideoThumb courseId={w.courseId} lecture={l} index={i} watched={p.isLectureDone(l.id)} />
                        <p className="mt-2 line-clamp-2 text-sm font-semibold text-navy-800 group-hover:underline">{String(i + 1).padStart(2, '0')}강. {l.title}</p>
                        <p className="text-[11px] text-slate-500">{l.instructor} · <Clock size={10} className="inline" /> {l.duration}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link to={w.check.path} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-teal-300">
                      {p.checkDone ? <CheckCircle2 size={18} className="text-teal-600" /> : <Circle size={18} className="text-slate-300" />}
                      <span className="flex-1"><span className="block text-xs font-semibold text-teal-700">확인 활동 · 완료하면 통과</span><span className="block text-sm font-bold text-navy-800">{w.check.label}</span></span>
                    </Link>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      {p.missionDone ? <CheckCircle2 size={18} className="text-safety-600" /> : <Footprints size={18} className="text-slate-300" />}
                      <span className="flex-1"><span className="block text-xs font-semibold text-safety-700">현업 과제</span><span className="block text-sm text-slate-700">{weekPlanFor(w.week).mission}</span></span>
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <Link to={`/curriculum/week/${w.week}`} className="inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline"><Play size={14} /> {w.week === 13 ? '13주+' : `${w.week}주차`} 강의실 들어가기</Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
