import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Circle, ClipboardCheck, Footprints, NotebookPen, Play } from 'lucide-react'
import { VideoPlayer, VideoThumb } from '../components/Video'
import { useApp } from '../context/AppContext'
import { courseVisual, totalMinutes, weekLectures, weekLecturesFor } from '../data/lectures'
import { courseById } from '../data/courses'
import { journey, weekPlanFor } from '../data/journey'
import { statusLabel, weekProgress } from '../lib/weekProgress'

export default function WeekPage() {
  const { week: wParam } = useParams()
  const week = Math.min(13, Math.max(0, Number(wParam) || 0))
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { state, markLecture, markCheck, toggleWeekMission } = useApp()
  const w = weekLecturesFor(week)
  const p = weekProgress(state, week)
  // 주소에 강의가 없으면 처음 연 순간의 '이어 볼 강의'로 고정한다 (수강 완료 뒤 화면이 저절로 바뀌지 않게)
  const [fallback] = useState(() => ({ week, id: (w.lectures.find((l) => !p.isLectureDone(l.id)) ?? w.lectures[0]).id }))
  const fallbackId = fallback.week === week ? fallback.id : w.lectures[0].id
  const lecture = w.lectures.find((l) => l.id === params.get('lecture')) ?? w.lectures.find((l) => l.id === fallbackId) ?? w.lectures[0]
  const idx = w.lectures.indexOf(lecture)
  const next = w.lectures[idx + 1]
  const plan = weekPlanFor(week)
  const stage = journey.find((s) => s.id === plan.stageId)!
  const course = courseById(w.courseId)
  const v = { ...courseVisual[w.courseId], label: w.week === 13 ? '전 코스 공통' : courseVisual[w.courseId].label }
  const label = week === 0 ? '오리엔테이션 (0주차)' : week >= 13 ? '13주+ 유지' : `${week}주차`

  const complete = () => markLecture(lecture.id)
  const goNext = next ? () => setParams({ lecture: next.id }) : undefined

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/curriculum" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-navy-700"><ChevronLeft size={16} /> 전체 커리큘럼</Link>
        <div className="flex gap-2">
          <button disabled={week === 0} onClick={() => navigate(`/curriculum/week/${week - 1}`)} className="btn-ghost"><ChevronLeft size={16} /> 이전 주차</button>
          <button disabled={week === 13} onClick={() => navigate(`/curriculum/week/${week + 1}`)} className="btn-ghost">다음 주차 <ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 강의 영상 */}
        <section className="col-span-8">
          <VideoPlayer key={lecture.id} courseId={w.courseId} lecture={lecture} index={idx} watched={p.isLectureDone(lecture.id)} onComplete={complete} onNext={goNext} />
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500"><span style={{ color: v.to }} className="font-semibold">{v.label}</span> · {label} · {String(idx + 1).padStart(2, '0')}강</p>
              <h1 className="mt-1 text-2xl font-bold text-navy-800">{lecture.title}</h1>
              <p className="mt-1 text-sm text-slate-500">{lecture.instructor} · {lecture.duration}</p>
            </div>
            {p.isLectureDone(lecture.id) ? (
              <span className="badge shrink-0 bg-teal-50 px-3 py-1.5 text-sm text-teal-700"><CheckCircle2 size={14} /> 수강 완료</span>
            ) : (
              <button onClick={complete} className="btn-ghost shrink-0 text-xs">수강 완료로 표시</button>
            )}
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-700">{lecture.summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="card p-5">
              <p className="label">챕터</p>
              <ul className="mt-2 space-y-1.5">
                {lecture.chapters.map((c) => <li key={c.at} className="flex gap-3 text-sm"><span className="w-12 font-mono text-xs text-navy-500">{c.at}</span><span className="text-slate-700">{c.title}</span></li>)}
              </ul>
            </div>
            <div className="card p-5">
              <p className="label flex items-center gap-1"><NotebookPen size={12} /> 강의 노트</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">{lecture.notes.map((n) => <li key={n}>· {n}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* 주차 패널 */}
        <aside className="col-span-4 space-y-4">
          <div className="overflow-hidden rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${v.from}, ${v.to})` }}>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">{stage.order}. {stage.name} · {label}</p>
                <span className={`badge ${statusLabel[p.status].cls}`}>{statusLabel[p.status].label}</span>
              </div>
              <p className="mt-1 text-lg font-bold">{w.theme}</p>
              <p className="text-xs text-white/70">{w.provider} · 강의 {w.lectures.length}개 · {totalMinutes(w.lectures)}분</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${((p.watched + (p.checkDone ? 1 : 0)) / (p.total + 1)) * 100}%` }} /></div>
              <p className="mt-1 text-[11px] text-white/70">강의 {p.watched}/{p.total} · 확인 활동 {p.checkDone ? '완료' : '미완료'} → {p.complete ? '주차 이수 완료' : '강의 모두 수강 + 확인 활동 완료 시 이수'}</p>
            </div>
          </div>

          <div className="card p-4">
            <p className="label mb-2 px-1">이번 주 강의</p>
            <div className="space-y-2">
              {w.lectures.map((l, i) => (
                <button key={l.id} onClick={() => setParams({ lecture: l.id })} className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${l.id === lecture.id ? 'bg-navy-50' : 'hover:bg-slate-50'}`}>
                  <VideoThumb courseId={w.courseId} lecture={l} index={i} watched={p.isLectureDone(l.id)} size="sm" className="w-28 shrink-0" />
                  <span className="flex-1">
                    <span className="line-clamp-2 text-xs font-semibold text-navy-800">{String(i + 1).padStart(2, '0')}강. {l.title}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">{p.isLectureDone(l.id) ? <><CheckCircle2 size={11} className="text-teal-600" /> 수강 완료</> : <><Play size={10} /> {l.duration}</>}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="card border-teal-200 p-5">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700"><ClipboardCheck size={14} /> 확인 활동 · 완료하면 통과</p>
            <p className="mt-2 font-bold text-navy-800">{w.check.label}</p>
            <p className="mt-1 text-sm text-slate-600">{w.check.desc}</p>
            {course && <p className="mt-1 text-[11px] text-slate-400">5C · {course.name}</p>}
            <div className="mt-3 flex items-center gap-2">
              <Link to={w.check.path} className="btn-teal flex-1">확인 활동 하러 가기 <ArrowRight size={14} /></Link>
              {p.checkDone ? <span className="badge bg-teal-50 px-3 py-2 text-teal-700"><CheckCircle2 size={13} /> 통과</span> : <button onClick={() => markCheck(week)} className="btn-ghost text-xs">완료 표시</button>}
            </div>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-safety-700"><Footprints size={14} /> 현업 과제</p>
            <p className="mt-2 text-sm text-slate-800">{plan.mission}</p>
            <p className="mt-1 text-[11px] text-slate-500">산출물 · {plan.output}</p>
            <button onClick={() => toggleWeekMission(week)} className={`mt-3 w-full ${p.missionDone ? 'btn-orange' : 'btn-ghost'}`}>
              {p.missionDone ? <CheckCircle2 size={16} /> : <Circle size={16} />} {p.missionDone ? '현업 과제 완료' : '현업 과제 완료 체크'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {weekLectures.map((x) => {
              const xp = weekProgress(state, x.week)
              return (
                <Link key={x.week} to={`/curriculum/week/${x.week}`} className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${x.week === week ? 'bg-navy-700 text-white' : xp.complete ? 'bg-teal-100 text-teal-700' : 'bg-white text-slate-500 shadow-sm'}`} title={x.theme}>
                  {x.week === 13 ? '+' : x.week}
                </Link>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
