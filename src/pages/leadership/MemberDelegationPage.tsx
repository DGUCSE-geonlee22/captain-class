import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, HelpCircle, Save, UserCheck, Users } from 'lucide-react'
import { AiNotice, Callout, PageHeader, Toast } from '../../components/ui'
import { delegationChoices, delegationGuideQuestions, delegationTasks, type DelegationChoice } from '../../data/coaching'
import { teamMembers } from '../../data/team'
import { useApp } from '../../context/AppContext'

const icon = { ai: Bot, member: UserCheck, consult: Users } as const

export default function MemberDelegationPage() {
  const { state, addMemberDelegation, completeLesson } = useApp()
  const [memberId, setMemberId] = useState('site-gongmu')
  const member = teamMembers.find((m) => m.id === memberId)!
  const [answers, setAnswers] = useState<string[]>(['', ''])
  const [tasks, setTasks] = useState<Record<string, DelegationChoice>>({})
  const [note, setNote] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const classified = delegationTasks.filter((t) => tasks[t.id]).length
  const prior = state.memberDelegations.filter((d) => d.memberId === memberId)

  const save = () => {
    addMemberDelegation({ memberId, memberName: member.name, answers, tasks, leaderNote: note })
    completeLesson('co-b')
    setToast(`${member.name}의 판단 위임 기준표를 저장했습니다 (+20 M)`)
    setTimeout(() => setToast(null), 2200)
    setAnswers(['', ''])
    setTasks({})
    setNote('')
  }

  return (
    <div>
      <PageHeader
        en="Delegation Map"
        backTo="/course/coaching"
        backLabel="Coaching 코스"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">레슨 B</span>}
        title="판단 위임 기준표 — 팀원이 쓰고, 리더가 보완한다"
        description="리더가 기준표를 작성해서 건네는 것이 아닙니다. 리더의 질문에 팀원이 답하면서 자신의 업무와 AI의 업무를 직접 나눠 보고, 어떤 일이 AI로 대체되지 않는 자신의 판단 영역인지 확인합니다. 리더는 방향과 원칙을 세우고 보완을 돕습니다."
        right={<AiNotice />}
      />
      <div className="grid grid-cols-5 gap-6">
        <aside className="col-span-2 space-y-2">
          <p className="label mb-2">기준표를 쓸 팀원</p>
          {teamMembers.filter((m) => m.id !== 'foreman').map((m) => (
            <button key={m.id} onClick={() => { setMemberId(m.id); setAnswers(['', '']); setTasks({}); setNote('') }} className={`w-full rounded-xl border p-3 text-left transition ${m.id === memberId ? 'border-navy-400 bg-navy-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <span className="flex items-center justify-between"><span className="text-sm font-bold text-navy-800">{m.name}</span>{state.memberDelegations.some((d) => d.memberId === m.id) && <span className="badge bg-teal-50 text-teal-700">기준표 있음</span>}</span>
              <span className="block text-[11px] text-slate-500">{m.role}</span>
            </button>
          ))}
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">{member.name}</p>
            <p className="mt-1">{member.situation}</p>
          </div>
        </aside>

        <section className="col-span-3 space-y-4">
          <div className="card p-6">
            <p className="flex items-center gap-2 font-bold text-navy-800"><HelpCircle size={16} className="text-navy-500" /> 1. 리더가 묻고, 팀원이 답한다</p>
            <p className="mt-1 text-xs text-slate-500">면담에서 팀원이 한 답을 그대로 적습니다. 리더의 생각을 대신 쓰지 않습니다.</p>
            <div className="mt-4 space-y-4">
              {delegationGuideQuestions.map((q, i) => (
                <div key={q}>
                  <p className="text-sm font-medium text-navy-800">"{q}"</p>
                  <textarea value={answers[i]} onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))} placeholder={`${member.name}의 답`} className="input mt-1.5 min-h-[70px] resize-none" />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <p className="font-bold text-navy-800">2. 팀원이 직접 나눈다</p>
            <div className="mt-2 flex gap-3 text-xs">
              {delegationChoices.map((c) => <span key={c.id} className="flex items-center gap-1.5 text-slate-600"><span className={`h-2.5 w-2.5 rounded-full ${c.color.split(' ')[0]}`} /> {c.label} · {c.desc}</span>)}
            </div>
            <div className="mt-4 space-y-2">
              {delegationTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{t.task}</p>
                    <p className="text-[11px] text-slate-500">{t.hint}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {delegationChoices.map((c) => {
                      const Icon = icon[c.id]
                      return (
                        <button key={c.id} onClick={() => setTasks({ ...tasks, [t.id]: c.id })} className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${tasks[t.id] === c.id ? c.color : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`} title={c.label}>
                          <Icon size={12} /> {c.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <p className="font-bold text-navy-800">3. 리더의 보완</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="예: 작업 중지 판단은 네 영역이 맞다. 다만 본사 협의는 혼자 안고 가지 말고 나와 같이 가자." className="input mt-2 min-h-[80px] resize-none" />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">분류 {classified} / {delegationTasks.length}</span>
              <div className="flex gap-2">
                <Link to="/records?tab=judgment" className="btn-ghost">내 기록</Link>
                <button onClick={save} disabled={classified < 4 || answers.some((a) => a.trim().length < 3)} className="btn-primary"><Save size={16} /> 기준표 저장</button>
              </div>
            </div>
          </div>

          {prior.length > 0 && (
            <div className="card p-5">
              <p className="text-sm font-bold text-navy-800">{member.name}의 이전 기준표 {prior.length}건</p>
              {prior.slice(0, 1).map((d) => (
                <div key={d.id} className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  {delegationChoices.map((c) => (
                    <div key={c.id} className="rounded-lg bg-slate-50 p-2">
                      <p className="font-semibold text-slate-700">{c.label}</p>
                      <ul className="mt-1 space-y-0.5 text-slate-600">{delegationTasks.filter((t) => d.tasks[t.id] === c.id).map((t) => <li key={t.id}>· {t.task}</li>)}</ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <Callout tone="info">팀원은 AI와의 역할 분담이 분명해져 책임져야 하는 일에 집중하고, AI를 위협이 아닌 도구로 인식하게 됩니다. 리더에게는 방향과 원칙을 세우는 역할이 남습니다.</Callout>
        </section>
      </div>
      <Toast message={toast} />
    </div>
  )
}
