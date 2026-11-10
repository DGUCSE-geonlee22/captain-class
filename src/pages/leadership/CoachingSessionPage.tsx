import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, CheckCircle2, Circle, MessageCircleQuestion, Save, UserCheck, Users } from 'lucide-react'
import { AiNotice, PageHeader, Toast } from '../../components/ui'
import { checkCoachingQuestion, coachingCheckLabels, coachingPrinciple, coachingTopics, delegationChoices, delegationGuideQuestions, delegationTasks, growthPlanExample, type DelegationChoice } from '../../data/coaching'
import { teamMembers } from '../../data/team'
import { useApp } from '../../context/AppContext'

const icon = { ai: Bot, member: UserCheck, consult: Users } as const
type Step = 1 | 2 | 3

/**
 * Coaching 면담 — 한 화면 흐름
 * 1) 리더가 결론 대신 질문한다 (질문 점검)  2) 팀원이 답하며 판단 위임 기준표를 직접 쓴다 (리더 보완)  3) 팀원의 첫 계획을 정한다 → 성장 기록으로
 */
export default function CoachingSessionPage() {
  const { addCoachingNote, addMemberDelegation, addGrowthPlan, completeLesson } = useApp()
  const [topicId, setTopicId] = useState(coachingTopics[0].id)
  const topic = coachingTopics.find((t) => t.id === topicId)!
  const member = teamMembers.find((m) => m.id === topic.memberId)!
  const [step, setStep] = useState<Step>(1)
  const [qs, setQs] = useState(['', '', ''])
  const [answers, setAnswers] = useState(['', ''])
  const [tasks, setTasks] = useState<Record<string, DelegationChoice>>({})
  const [note, setNote] = useState('')
  const [plan, setPlan] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const checks = useMemo(() => qs.map((q) => (q.trim() ? checkCoachingQuestion(q) : null)), [qs])
  const score = checks.reduce((a, c) => a + (c ? [c.isQuestion, c.isOpen, c.noAnswerGiven].filter(Boolean).length : 0), 0)
  const classified = delegationTasks.filter((t) => tasks[t.id]).length

  const switchTopic = (id: string) => {
    setTopicId(id)
    setStep(1)
    setQs(['', '', ''])
    setAnswers(['', ''])
    setTasks({})
    setNote('')
    setPlan('')
  }
  const finish = () => {
    addCoachingNote({ memberId: member.id, memberName: member.name, topic: topic.topic, questions: qs.filter((q) => q.trim()), score })
    addMemberDelegation({ memberId: member.id, memberName: member.name, answers, tasks, leaderNote: note })
    addGrowthPlan({ memberId: member.id, memberName: member.name, plan: plan.trim() })
    completeLesson('co-a')
    setToast(`${member.name}과의 코칭 면담을 저장했습니다 (+30 M) · 성장 기록이 시작됐습니다`)
    setTimeout(() => setToast(null), 2600)
    switchTopic(topicId)
  }

  return (
    <div>
      <PageHeader
        en="Coaching Session"
        backTo="/course/coaching"
        backLabel="Coaching 코스"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">레슨 A</span>}
        title="코칭 면담 — 결론 대신 질문하고, 팀원이 기준을 쓴다"
        description={coachingPrinciple.body}
        right={<AiNotice />}
      />

      <div className="grid grid-cols-7 gap-6">
        <aside className="col-span-2 space-y-2">
          <p className="label mb-2">면담 상황</p>
          {coachingTopics.map((t) => {
            const m = teamMembers.find((x) => x.id === t.memberId)!
            return (
              <button key={t.id} onClick={() => switchTopic(t.id)} className={`w-full rounded-xl border p-3 text-left transition ${t.id === topicId ? 'border-navy-400 bg-navy-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <span className="block text-sm font-bold text-navy-800">{m.name}</span>
                <span className="block text-xs text-slate-600">{t.topic}</span>
              </button>
            )
          })}
        </aside>

        <section className="col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            {['① 질문하기', '② 팀원이 기준표 쓰기', '③ 첫 계획'].map((l, i) => (
              <button key={l} onClick={() => setStep((i + 1) as Step)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${step === i + 1 ? 'bg-navy-700 text-white' : step > i + 1 ? 'bg-navy-100 text-navy-700' : 'bg-slate-100 text-slate-500'}`}>{l}</button>
            ))}
          </div>

          {step === 1 && (
            <div className="card p-6">
              <p className="text-xs text-slate-500">{member.role}</p>
              <h3 className="mt-0.5 text-lg font-bold text-navy-800">{topic.topic}</h3>
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><b>결론만 전달하는 말 · </b>{topic.tellingExample}</div>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy-800"><MessageCircleQuestion size={16} className="text-navy-500" /> 대신 팀원이 스스로 길을 찾게 하는 질문 3개</p>
              {topic.exampleQuestions && (
                <details className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
                  <summary className="cursor-pointer font-semibold text-slate-700">막히면 열어 보기 · 예시 질문 (따라 쓰지 말고 내 말로)</summary>
                  <ul className="mt-2 space-y-1">{topic.exampleQuestions.map((q) => <li key={q}>" {q}</li>)}</ul>
                </details>
              )}
              <div className="mt-3 space-y-3">
                {qs.map((q, i) => (
                  <div key={i}>
                    <input value={q} onChange={(e) => setQs(qs.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`질문 ${i + 1}`} className="input" />
                    {checks[i] && (
                      <div className="mt-1.5 flex gap-3 text-[11px]">
                        {coachingCheckLabels.map((l) => (
                          <span key={l.key} className={`flex items-center gap-1 ${checks[i]![l.key] ? 'text-teal-600' : 'text-slate-400'}`} title={l.hint}>{checks[i]![l.key] ? <CheckCircle2 size={11} /> : <Circle size={11} />} {l.label}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-600">점검 {score} / 9</span>
                <button onClick={() => setStep(2)} disabled={qs.filter((q) => q.trim().length >= 5).length < 2} className="btn-primary">다음: 팀원이 기준표 쓰기 <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <p className="text-sm text-slate-600">리더가 써서 건네지 않습니다. 아래 질문에 <b>{member.name}</b>이 답하고, 업무를 직접 나눕니다. 리더는 보완만 합니다.</p>
              <div className="mt-4 space-y-3">
                {delegationGuideQuestions.map((q, i) => (
                  <div key={q}>
                    <p className="text-sm font-medium text-navy-800">"{q}"</p>
                    <input value={answers[i]} onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))} placeholder={`${member.name}의 답`} className="input mt-1" />
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2">
                {delegationTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <div className="flex-1"><p className="text-sm font-semibold text-slate-800">{t.task}</p><p className="text-[11px] text-slate-500">{t.hint}</p></div>
                    <div className="flex gap-1.5">
                      {delegationChoices.map((c) => {
                        const Icon = icon[c.id]
                        return (
                          <button key={c.id} onClick={() => setTasks({ ...tasks, [t.id]: c.id })} className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tasks[t.id] === c.id ? c.color : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                            <Icon size={12} /> {c.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <label className="label mt-5 block">리더의 보완</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="예: 작업 중지 판단은 네 영역이 맞다. 본사 협의는 혼자 안고 가지 말고 같이 가자." className="input mt-1" />
              <div className="mt-4 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-ghost">이전</button>
                <button onClick={() => setStep(3)} disabled={classified < 4 || answers.some((a) => a.trim().length < 3)} className="btn-primary">다음: 첫 계획 <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-6">
              <p className="text-sm text-slate-600">면담이 말로 끝나지 않도록, {member.name}이 스스로 정한 첫 계획 하나를 적습니다. 이후 진행 과정은 성장 기록에서 단계별로 남깁니다.</p>
              <input value={plan} onChange={(e) => setPlan(e.target.value)} placeholder={`예: ${growthPlanExample}`} className="input mt-3" />
              <div className="mt-4 flex justify-between">
                <button onClick={() => setStep(2)} className="btn-ghost">이전</button>
                <div className="flex gap-2">
                  <Link to="/course/coaching/growth" className="btn-ghost">성장 기록 보기</Link>
                  <button onClick={finish} disabled={plan.trim().length < 5} className="btn-primary"><Save size={16} /> 면담 저장</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      <Toast message={toast} />
    </div>
  )
}
