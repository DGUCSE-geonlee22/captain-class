import { Link } from 'react-router-dom'
import { ArrowRight, Ear, HardHat, Heart, Lock, MessageCircle, Handshake } from 'lucide-react'
import { PageHeader, ProgressBar, Reveal } from '../components/ui'
import { axisMeta, compassionAxisPhilosophy, courses } from '../data/courses'
import { useApp } from '../context/AppContext'
import type { Course } from '../data/types'

const stepIcon = { listen: Ear, understand: Heart, communicate: MessageCircle, act: Handshake } as const

export default function CoursesPage() {
  const { state, progress } = useApp()
  const compassionAxis = courses.filter((c) => c.axis === 'compassion')
  const leadershipAxis = courses.filter((c) => c.axis === 'leadership')
  const foundation = courses.find((c) => c.axis === 'foundation')!

  const lessonProgress = (c: Course) => {
    if (c.status === 'skeleton') return 0
    const done = c.lessons.filter((l) => state.completedLessons.includes(l.id)).length
    return Math.round((done / c.lessons.length) * 100)
  }

  return (
    <div>
      <PageHeader
        en="5C Courses"
        title="2축 프레임워크 위에 세운 5C"
        description={
          <>
            각 코스는 주차별 강의를 제공하고(커리큘럼), 여기 있는 확인·실습 활동으로 강의 내용을 잘 받아들였는지 확인합니다. 공감 축(Compassion, Collaboration+Communication)과 리더십 축(Charisma+Character, Coaching)이 두 기둥이고, 그 아래에 현장 업종의 기초 Construction이 깔립니다.
            <br />철학: <b>"AI는 데이터의 맥락을, 리더는 마음의 맥락을 읽는다"</b>
          </>
        }
      />

      {/* 공감 축 교육 철학 (곽경은) */}
      <Reveal className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 p-8 text-white">
        <div className="flex items-start justify-between gap-8">
          <div className="max-w-xl">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-white/70">Empathy axis · 공감 축 교육 철학</p>
            <p className="mt-2 text-lg font-medium leading-relaxed">{compassionAxisPhilosophy.statement}</p>
            <p className="mt-2 text-xs text-white/60">정리: 곽경은 · Compassion은 '듣기·이해', Collaboration+Communication은 '소통·협업 행동'을 맡습니다.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {compassionAxisPhilosophy.steps.map((s, i) => {
              const Icon = stepIcon[s.key as keyof typeof stepIcon]
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <Link to={`/course/${s.courseId}`} className="flex w-[118px] flex-col items-center rounded-2xl bg-white/12 px-3 py-4 text-center transition hover:bg-white/20">
                    <Icon size={22} />
                    <span className="mt-2 text-sm font-bold">{s.label}</span>
                    <span className="mt-1 text-[11px] leading-tight text-white/75">{s.desc}</span>
                    <span className="mt-2 text-[10px] uppercase tracking-wider text-white/50">{s.courseId === 'compassion' ? 'Compassion' : 'Collab+Comm'}</span>
                  </Link>
                  {i < compassionAxisPhilosophy.steps.length - 1 && <ArrowRight size={16} className="text-white/60" />}
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-6">
        <AxisColumn title="공감 축" subtitle="구성원의 마음을 이해하고 소통으로 전달한다" color={axisMeta.compassion.color} percent={progress.compassion}>
          {compassionAxis.map((c) => <CourseCard key={c.id} course={c} percent={lessonProgress(c)} />)}
        </AxisColumn>
        <AxisColumn title="리더십 축" subtitle="믿고 따를 수 있는 카리스마와 품격으로 이끈다" color={axisMeta.leadership.color} percent={progress.leadership}>
          {leadershipAxis.map((c) => <CourseCard key={c.id} course={c} percent={lessonProgress(c)} />)}
        </AxisColumn>
      </div>

      <Reveal delay={120}>
        <Link to={`/course/${foundation.id}`} className="mt-6 flex items-center gap-5 rounded-2xl border-2 bg-safety-50/50 px-7 py-5 transition hover:bg-safety-50" style={{ borderColor: axisMeta.foundation.color }}>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm" style={{ background: axisMeta.foundation.color }}><HardHat size={24} /></span>
          <span className="flex-1">
            <span className="flex items-center gap-2">
              <span className="text-lg font-bold text-safety-700">{foundation.name}</span>
              <span className="badge bg-white text-safety-700">기초 역량 · 0주차 사전 진단</span>
              <span className="badge bg-safety-100 text-safety-700">정리: {foundation.owner} · 진행 {progress.foundation}%</span>
            </span>
            <span className="block text-sm text-slate-600">{foundation.tagline}</span>
          </span>
          <ArrowRight className="text-safety-400" />
        </Link>
      </Reveal>
    </div>
  )
}

function AxisColumn({ title, subtitle, color, percent, children }: { title: string; subtitle: string; color: string; percent: number; children: React.ReactNode }) {
  return (
    <Reveal className="rounded-3xl border border-slate-200 bg-white/70 p-5">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold" style={{ color }}><span className="h-3 w-3 rounded-full" style={{ background: color }} /> {title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <span className="text-sm font-bold text-slate-600">{percent}%</span>
      </div>
      <ProgressBar value={percent} color={color} />
      <div className="mt-5 space-y-4">{children}</div>
    </Reveal>
  )
}

function CourseCard({ course, percent }: { course: Course; percent: number }) {
  const meta = axisMeta[course.axis]
  const skeleton = course.status === 'skeleton'
  return (
    <Link to={`/course/${course.id}`} className={`card block p-5 transition hover:-translate-y-0.5 hover:shadow-md ${skeleton ? 'border-dashed' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-navy-800">{course.name} <span className="ml-1 text-xs font-medium text-slate-400">{course.nameKo}</span></h3>
          <p className="mt-0.5 text-sm text-slate-600">{course.tagline}</p>
          {course.framework && <p className="mt-1.5 text-xs text-teal-700">핵심 질문 · {course.framework.keyQuestion}</p>}
        </div>
        {skeleton ? <span className="badge shrink-0 bg-slate-100 text-slate-600"><Lock size={11} /> 준비 중 · {course.owner}</span> : <span className={`badge shrink-0 ${meta.bg} ${meta.text}`}>레슨 {course.lessons.length}개</span>}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1"><ProgressBar value={percent} color={skeleton ? '#cbd5e1' : meta.color} height={6} /></div>
        <span className="text-xs font-semibold text-slate-500">{skeleton ? '—' : `${percent}%`}</span>
      </div>
    </Link>
  )
}
