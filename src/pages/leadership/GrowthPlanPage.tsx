import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, CheckCircle2, Circle, ExternalLink, Plus, Save, TrendingUp, Users } from 'lucide-react'
import { Callout, PageHeader, Toast } from '../../components/ui'
import { growthPlanExample, growthStepTypes, kcaInfo, leaderFeedbackChecks, type GrowthStepType, type LeaderFeedbackKey } from '../../data/coaching'
import { teamMembers } from '../../data/team'
import { formatDate, useApp } from '../../context/AppContext'

export default function GrowthPlanPage() {
  const { state, addGrowthPlan, addGrowthStep, setGrowthFeedback, setKcaStep, completeLesson } = useApp()
  const [memberId, setMemberId] = useState('site-gongmu')
  const member = teamMembers.find((m) => m.id === memberId)!
  const plans = state.growthPlans.filter((p) => p.memberId === memberId)
  const [planText, setPlanText] = useState('')
  const [stepType, setStepType] = useState<GrowthStepType>('notice')
  const [stepText, setStepText] = useState('')
  const [fb, setFb] = useState<Record<LeaderFeedbackKey, boolean>>({ problemDefinition: false, newAttempt: false, errorFix: false })
  const [fbNote, setFbNote] = useState('')
  const [peer, setPeer] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const active = plans[0]
  const notify = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <div>
      <PageHeader
        en="Growth Log"
        backTo="/course/coaching"
        backLabel="Coaching 코스"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">레슨 C · D</span>}
        title="단계별 성취 경험 기록과 인증 연계"
        description="면담이 말로 끝나면 팀원의 변화로 이어지기 어렵습니다. 면담에서 나온 다음 단계 계획을 팀원이 진행하면서 문제를 처음 인식한 때부터 해결책을 찾고 고쳐 나간 과정을 단계별로 기록합니다. 리더는 결과의 완성도뿐 아니라 과정에 피드백하고, 일정 기간 뒤 동료·협력 부서의 의견으로 코칭 효과를 점검합니다."
      />
      <div className="grid grid-cols-5 gap-6">
        <aside className="col-span-2 space-y-2">
          <p className="label mb-2">팀원</p>
          {teamMembers.filter((m) => m.id !== 'foreman').map((m) => (
            <button key={m.id} onClick={() => setMemberId(m.id)} className={`w-full rounded-xl border p-3 text-left transition ${m.id === memberId ? 'border-navy-400 bg-navy-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <span className="flex items-center justify-between"><span className="text-sm font-bold text-navy-800">{m.name}</span><span className="text-[11px] text-slate-500">계획 {state.growthPlans.filter((p) => p.memberId === m.id).length}</span></span>
              <span className="block text-[11px] text-slate-500">{m.role}</span>
            </button>
          ))}
          <div className="card p-5">
            <p className="flex items-center gap-2 font-bold text-navy-800"><Award size={16} className="text-safety-500" /> {kcaInfo.title}</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">{kcaInfo.points.map((p) => <li key={p}>· {p}</li>)}</ul>
            <div className="mt-3 space-y-1.5">
              {kcaInfo.steps.map((s, i) => {
                const done = state.kcaStep > i
                return (
                  <button key={s} onClick={() => setKcaStep(done ? i : i + 1)} className={`flex w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-xs ${done ? 'border-safety-300 bg-safety-50 text-safety-700' : 'border-slate-200 text-slate-600'}`}>
                    {done ? <CheckCircle2 size={13} /> : <Circle size={13} />} {s}
                  </button>
                )
              })}
            </div>
            <a href={kcaInfo.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:underline">한국코치협회 <ExternalLink size={12} /></a>
          </div>
        </aside>

        <section className="col-span-3 space-y-4">
          {!active ? (
            <div className="card p-6">
              <p className="flex items-center gap-2 font-bold text-navy-800"><TrendingUp size={16} className="text-navy-500" /> 1. 면담에서 나온 {member.name}의 첫 계획</p>
              <p className="mt-1 text-xs text-slate-500">팀원이 스스로 정한 다음 단계를 적습니다. 리더가 정해 준 계획이 아니어야 합니다.</p>
              <input value={planText} onChange={(e) => setPlanText(e.target.value)} placeholder={`예: ${growthPlanExample}`} className="input mt-3" />
              <div className="mt-3 flex justify-end">
                <button onClick={() => { addGrowthPlan({ memberId, memberName: member.name, plan: planText.trim() }); setPlanText(''); completeLesson('co-c'); notify('계획을 등록했습니다. 이제 단계를 기록하세요.') }} disabled={planText.trim().length < 5} className="btn-primary"><Plus size={16} /> 계획 등록</button>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-navy-700 px-6 py-4 text-white">
                <p className="text-xs text-navy-200">{member.name}의 계획 · {formatDate(active.createdAt)}</p>
                <p className="mt-1 font-semibold">{active.plan}</p>
              </div>
              <div className="card p-6">
                <p className="font-bold text-navy-800">2. 단계별 기록 ({active.steps.length})</p>
                <ol className="mt-3 space-y-2 border-l-2 border-navy-100 pl-4">
                  {active.steps.map((st) => {
                    const t = growthStepTypes.find((x) => x.id === st.type)!
                    return (
                      <li key={st.id} className="relative text-sm">
                        <span className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-navy-500" />
                        <span className="badge mr-2 bg-navy-50 text-navy-700">{t.label}</span><span className="text-slate-800">{st.text}</span>
                        <span className="ml-2 text-[11px] text-slate-400">{formatDate(st.createdAt)}</span>
                      </li>
                    )
                  })}
                  {active.steps.length === 0 && <li className="text-sm text-slate-400">아직 기록이 없습니다.</li>}
                </ol>
                <div className="mt-4 flex gap-2">
                  {growthStepTypes.map((t) => (
                    <button key={t.id} onClick={() => setStepType(t.id)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${stepType === t.id ? 'bg-navy-700 text-white' : 'border border-slate-200 text-slate-600'}`} title={t.desc}>{t.label}</button>
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{growthStepTypes.find((x) => x.id === stepType)?.desc}</p>
                <div className="mt-2 flex gap-2">
                  <input value={stepText} onChange={(e) => setStepText(e.target.value)} placeholder="팀원이 적은 단계 내용" className="input" />
                  <button onClick={() => { addGrowthStep(active.id, stepType, stepText.trim()); setStepText(''); notify('단계를 기록했습니다 (+10 M)') }} disabled={stepText.trim().length < 3} className="btn-primary shrink-0"><Plus size={16} /> 기록</button>
                </div>
              </div>
              <div className="card p-6">
                <p className="font-bold text-navy-800">3. 리더의 과정 피드백</p>
                <p className="mt-1 text-xs text-slate-500">결과의 완성도가 아니라, 근거를 정리하고 논리적인 주장을 세우려 노력한 과정을 봅니다.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {leaderFeedbackChecks.map((c) => (
                    <button key={c.key} onClick={() => setFb({ ...fb, [c.key]: !fb[c.key] })} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${fb[c.key] ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600'}`}>
                      {fb[c.key] ? <CheckCircle2 size={13} /> : <Circle size={13} />} {c.label}
                    </button>
                  ))}
                </div>
                <textarea value={fbNote} onChange={(e) => setFbNote(e.target.value)} placeholder="예: 본사 반응을 보고 근거 자료를 다시 정리한 점이 좋았다. 다음엔 협력사 손실 추정치도 함께 붙여 보자." className="input mt-3 min-h-[70px] resize-none" />
                <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-600"><Users size={13} /> 몇 주 뒤 · 동료·협력 부서 피드백</p>
                <input value={peer} onChange={(e) => setPeer(e.target.value)} placeholder="예: 공무팀 담당자 — 요청 근거가 정리돼 있어 협의가 빨랐다" className="input mt-1.5" />
                <div className="mt-3 flex items-center justify-between">
                  {active.leaderFeedback && <span className="text-xs text-teal-700">피드백 저장됨 · {Object.values(active.leaderFeedback).filter((v) => v === true).length}/3</span>}
                  <div className="ml-auto flex gap-2">
                    <Link to="/records?tab=coaching" className="btn-ghost">내 기록</Link>
                    <button onClick={() => { setGrowthFeedback(active.id, { ...fb, note: fbNote }, peer); notify('피드백을 저장했습니다') }} className="btn-primary"><Save size={16} /> 피드백 저장</button>
                  </div>
                </div>
              </div>
              {plans.length > 1 && <p className="text-right text-xs text-slate-500">이전 계획 {plans.length - 1}건은 내 기록 → 코칭·성취 탭에서 볼 수 있습니다.</p>}
            </>
          )}
          <Callout tone="info">Charisma+Character가 리더에게 질문하는 구조였다면, Coaching은 리더가 팀원에게 질문하며 함께 길을 만들어 가는 구조입니다. 쌓인 기록으로 팀원은 자신의 성장을 확인하고 판단에 대한 신뢰가 올라갑니다.</Callout>
        </section>
      </div>
      <Toast message={toast} />
    </div>
  )
}
