import { CalendarDays, CheckCircle2, GraduationCap } from 'lucide-react'
import { PageHeader } from '../../components/ui'
import { hrdClasses } from '../../data/classes'
import { useApp } from '../../context/AppContext'

export default function ClassesPage() {
  const { state, toggleEnroll, completeLesson } = useApp()
  return (
    <div>
      <PageHeader
        en="Expert Classes"
        backTo="/course/compassion"
        backLabel="Compassion 코스"
        eyebrow={<span className="badge bg-teal-50 text-teal-700">레슨 D</span>}
        title="HRD 심리전문가 수업"
        description="감정을 단정하지 않고 신호를 관찰하는 법, 심리적 안전감을 만드는 리더의 행동을 전문가에게 배웁니다. 신청 상태만 저장되는 목업입니다."
      />
      <div className="grid grid-cols-3 gap-4">
        {hrdClasses.map((c) => {
          const enrolled = state.enrolledClasses.includes(c.id)
          return (
            <div key={c.id} className="card flex flex-col p-6">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><GraduationCap size={22} /></span>
              <h3 className="text-base font-bold text-navy-800">{c.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{c.instructor}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{c.summary}</p>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={13} /> {c.schedule}</p>
              <button
                onClick={() => {
                  toggleEnroll(c.id)
                  if (!enrolled) completeLesson('cp-d')
                }}
                className={`mt-4 ${enrolled ? 'btn-teal' : 'btn-ghost'}`}
              >
                {enrolled ? <><CheckCircle2 size={16} /> 신청 완료</> : '수강 신청'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
