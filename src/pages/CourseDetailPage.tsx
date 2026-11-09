import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Construction, FileCode2, HelpCircle, Sparkles, Target, Wrench } from 'lucide-react'
import { AxisBadge, Callout, PageHeader, Reveal } from '../components/ui'
import { courseById, compassionAxisPhilosophy } from '../data/courses'
import { useApp } from '../context/AppContext'
import NotFoundPage from './NotFoundPage'
import type { Course, Lesson } from '../data/types'

/** 코스별 '한 장' 도식 (발표용). 데이터가 아니라 표현이므로 여기 둔다. */
const diagrams: Record<string, { title: string; steps: { n: string; label: string; desc: string }[]; note: string }> = {
  compassion: {
    title: '현장 공감형 Reframing 모듈 · 3단계',
    steps: [
      { n: '1', label: '데이터 융합', desc: '벌점 로그를 바로 띄우지 않고 시각·체감온도·연속 작업 시간·자재 무게를 먼저 본다' },
      { n: '2', label: '차가운 로그 Reframing', desc: '[규정 위반: 안전모 착용 불량] → "4시간째 철근을 조립하던 작업자가 숨을 고르며 안전모를 밀어 올린 상황"' },
      { n: '3', label: '관점 전환 프롬프트', desc: "10초 '생각의 시간' 동안 지적 입력을 잠그고 성찰 질문을 띄운다" },
    ],
    note: '관점 렌즈는 여기에 "리더 입장 / 구성원 입장" 질문 두 열을 더해, 리더가 자신의 해석을 사실처럼 단정하지 않게 한다.',
  },
  'collab-comm': {
    title: '연습 → 점검 → 직접 수정 → 실제 적용 → 기록',
    steps: [
      { n: '1', label: '연습', desc: 'AI가 작업반장·팀원 역할을 맡은 대화 연습실에서 말해 본다' },
      { n: '2', label: '3가지 점검', desc: '문제를 구체적으로 설명했는가 · 노력을 인정했는가 · 개선 방향을 제시했는가' },
      { n: '3', label: '직접 수정', desc: 'AI가 대신 써 주지 않는다. 리더가 자기 관계에 맞게 고쳐 쓴다' },
      { n: '4', label: '실제 적용', desc: '면담·TBM에서 연습한 화법 1개를 쓴다' },
      { n: '5', label: '기록', desc: '비포/애프터와 실천 Log로 자기 소통 습관의 변화를 본다' },
    ],
    note: '목표는 언제나 부드럽게 말하는 것이 아니라, 존중하면서 기준을 분명히 전달하는 것이다.',
  },
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const course = courseById(id ?? '')
  const { state } = useApp()
  if (!course) return <NotFoundPage />
  const skeleton = course.status === 'skeleton'

  return (
    <div>
      <PageHeader
        en={course.name}
        backTo="/courses"
        backLabel="5C 코스"
        eyebrow={
          <>
            <AxisBadge axis={course.axis} />
            {skeleton ? (
              <span className="badge bg-slate-100 text-slate-600"><Construction size={12} /> 콘텐츠 준비 중 · 담당: {course.owner}</span>
            ) : (
              <span className="badge bg-teal-50 text-teal-700">정리: {course.owner}</span>
            )}
          </>
        }
        title={course.tagline}
        description={course.description || undefined}
      />

      {skeleton ? <SkeletonBody course={course} /> : <ReadyBody course={course} completed={state.completedLessons} />}
    </div>
  )
}

function ReadyBody({ course, completed }: { course: Course; completed: string[] }) {
  const fw = course.framework
  const diagram = diagrams[course.id]
  const byId = (ids: string[]) => ids.map((i) => course.lessons.find((l) => l.id === i)).filter((l): l is Lesson => Boolean(l))
  const core = fw ? byId(fw.coreLessonIds) : course.lessons
  const support = fw ? byId(fw.supportLessonIds) : []
  const stepIdx = compassionAxisPhilosophy.steps.map((s) => s.label)

  return (
    <div className="space-y-8">
      {fw && (
        <Reveal className="grid grid-cols-3 gap-4">
          <Tile icon={<Target size={18} />} label="코스 목표" value={fw.goal} />
          <Tile icon={<HelpCircle size={18} />} label="핵심 질문" value={fw.keyQuestion} accent />
          <Tile icon={<Sparkles size={18} />} label="교육 목적" value={fw.purpose} />
        </Reveal>
      )}

      {fw && (
        <Reveal className="flex items-center justify-center gap-2 text-sm" delay={80}>
          <span className="text-slate-500">공감 축 흐름</span>
          {stepIdx.map((label, i) => {
            const on = fw.flow.includes(label)
            return (
              <span key={label} className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 font-semibold ${on ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{label}</span>
                {i < stepIdx.length - 1 && <ArrowRight size={14} className="text-slate-300" />}
              </span>
            )
          })}
          <span className="ml-2 text-xs text-slate-400">이 코스가 맡는 단계가 진하게 표시됩니다</span>
        </Reveal>
      )}

      {diagram && (
        <Reveal className="card p-7" delay={120}>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-teal-600">How it works</p>
          <h3 className="mt-1 text-lg font-bold text-navy-800">{diagram.title}</h3>
          <div className="mt-5 grid gap-3" style={{ gridTemplateColumns: `repeat(${diagram.steps.length}, minmax(0, 1fr))` }}>
            {diagram.steps.map((s, i) => (
              <div key={s.n} className="relative rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-black text-white">{s.n}</span>
                <p className="mt-3 font-bold text-navy-800">{s.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{s.desc}</p>
                {i < diagram.steps.length - 1 && <ArrowRight size={16} className="absolute -right-3 top-1/2 -translate-y-1/2 text-teal-300" />}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">{diagram.note}</p>
        </Reveal>
      )}

      <Reveal delay={160}>
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-base font-bold text-navy-800">중심 교육 요소</h3>
          <span className="badge bg-teal-500 text-white">핵심</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {core.map((l) => <LessonCard key={l.id} lesson={l} done={completed.includes(l.id)} big />)}
        </div>
      </Reveal>

      {support.length > 0 && (
        <Reveal delay={200}>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-base font-bold text-navy-800">보조 수단</h3>
            <span className="badge bg-slate-100 text-slate-600"><Wrench size={11} /> 중심 요소를 뒷받침</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {support.map((l) => <LessonCard key={l.id} lesson={l} done={completed.includes(l.id)} />)}
          </div>
        </Reveal>
      )}
    </div>
  )
}

function Tile({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 ${accent ? 'bg-navy-700 text-white' : 'card'}`}>
      <p className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${accent ? 'text-white/60' : 'text-slate-500'}`}>{icon} {label}</p>
      <p className={`mt-3 text-lg font-bold leading-snug ${accent ? '' : 'text-navy-800'}`}>{value}</p>
    </div>
  )
}

function LessonCard({ lesson, done, big }: { lesson: Lesson; done: boolean; big?: boolean }) {
  const letter = lesson.title.match(/레슨 ([A-Z])/)?.[1] ?? '·'
  return (
    <Link to={lesson.path ?? '#'} className={`card group flex items-start gap-4 transition hover:-translate-y-0.5 hover:shadow-md ${big ? 'p-6' : 'p-4'}`}>
      <span className={`mt-0.5 flex shrink-0 items-center justify-center rounded-full ${big ? 'h-10 w-10 text-sm' : 'h-8 w-8 text-xs'} ${done ? 'bg-teal-500 text-white' : big ? 'bg-navy-700 text-white' : 'bg-slate-100 text-slate-500'} font-bold`}>
        {done ? <CheckCircle2 size={big ? 18 : 15} /> : letter}
      </span>
      <span className="flex-1">
        <span className={`block font-bold text-navy-800 ${big ? 'text-base' : 'text-sm'}`}>{lesson.title.replace(/^레슨 [A-Z]\. /, '')}</span>
        <span className={`mt-1 block leading-relaxed text-slate-600 ${big ? 'text-sm' : 'text-xs'}`}>{lesson.summary}</span>
      </span>
      <ArrowRight size={16} className="mt-1 text-slate-300 transition group-hover:text-teal-500" />
    </Link>
  )
}

function SkeletonBody({ course }: { course: Course }) {
  return (
    <div className="space-y-6">
      <Callout tone="warn">
        이 코스는 아직 뼈대만 있습니다. 담당자({course.owner})가 <code className="rounded bg-white/70 px-1">src/data/courses.ts</code>에서 레슨 제목·설명·연결 경로와 코스 프레임(목표·핵심 질문·교육 목적)을 채우면 공감 축 코스와 같은 형식으로 표시됩니다.
      </Callout>
      <div className="grid grid-cols-3 gap-4">
        {['코스 목표', '핵심 질문', '교육 목적'].map((l) => (
          <div key={l} className="card border-dashed p-6 text-slate-400"><p className="text-xs font-semibold uppercase tracking-wider">{l}</p><p className="mt-3 text-sm">담당자 작성 예정</p></div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {course.lessons.map((l) => (
          <div key={l.id} className="card flex min-h-[160px] flex-col items-center justify-center border-dashed p-6 text-center text-slate-400">
            <FileCode2 size={28} className="mb-2" />
            <p className="font-semibold text-slate-500">{l.title}</p>
            <p className="mt-1 text-xs">레슨 설명이 여기에 표시됩니다</p>
          </div>
        ))}
      </div>
      <div className="card p-6 text-sm text-slate-600">
        <p className="mb-2 font-bold text-navy-800">채우는 방법</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li><code>src/data/courses.ts</code>에서 이 코스의 <code>status</code>를 <code>'ready'</code>로 바꿉니다.</li>
          <li><code>lessons</code>의 빈 카드를 실제 레슨(title, summary, path)으로 교체하고, <code>framework</code>(goal, keyQuestion, purpose, coreLessonIds, supportLessonIds)를 채웁니다.</li>
          <li>새 화면이 필요하면 <code>src/pages</code>에 만들고 <code>src/App.tsx</code>에 라우트를 등록합니다.</li>
          <li>주차별 수업 내용은 <code>src/data/journey.ts</code>의 <code>weekPlan</code>에서 topics를 채웁니다.</li>
        </ol>
      </div>
    </div>
  )
}
