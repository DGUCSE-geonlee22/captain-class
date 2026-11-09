import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, CheckCircle2, Circle, ExternalLink, Save, TrendingUp } from 'lucide-react'
import { Callout, PageHeader, Toast } from '../../components/ui'
import { achievementFields, kcaInfo, type AchievementField } from '../../data/coaching'
import { teamMembers } from '../../data/team'
import { formatDate, useApp } from '../../context/AppContext'

export default function AchievementPage() {
  const { state, addAchievement, setKcaStep, completeLesson } = useApp()
  const [memberId, setMemberId] = useState(teamMembers[2].id)
  const member = teamMembers.find((m) => m.id === memberId)!
  const [form, setForm] = useState<Record<AchievementField, string>>({ problem: '', reasoning: '', action: '', next: '' })
  const [toast, setToast] = useState<string | null>(null)
  const mine = state.achievements.filter((a) => a.memberId === memberId)

  const save = () => {
    addAchievement({ memberId, memberName: member.name, ...form })
    completeLesson('co-b')
    setToast(`${member.name}의 성취 경험을 기록했습니다 (+10 M)`)
    setTimeout(() => setToast(null), 2200)
    setForm({ problem: '', reasoning: '', action: '', next: '' })
  }

  return (
    <div>
      <PageHeader
        en="Achievement Log"
        backTo="/course/coaching"
        backLabel="Coaching 코스"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">레슨 B · C</span>}
        title="팀원의 성취 경험 기록과 인증 연계"
        description="팀원이 찾아낸 길을 결과가 아니라 과정(문제 정의 · 근거 설명 · 도전 행동)으로 기록합니다. 기록이 쌓이면 팀원의 경력이 되고, 리더에게는 코칭의 증거가 됩니다."
      />
      <div className="grid grid-cols-5 gap-6">
        <aside className="col-span-2 space-y-2">
          <p className="label mb-2">팀원</p>
          {teamMembers.filter((m) => m.id !== 'foreman').map((m) => (
            <button key={m.id} onClick={() => setMemberId(m.id)} className={`w-full rounded-xl border p-3 text-left transition ${m.id === memberId ? 'border-navy-400 bg-navy-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <span className="flex items-center justify-between"><span className="text-sm font-bold text-navy-800">{m.name}</span><span className="text-[11px] text-slate-500">기록 {state.achievements.filter((a) => a.memberId === m.id).length}</span></span>
              <span className="block text-[11px] text-slate-500">{m.role}</span>
            </button>
          ))}
        </aside>
        <section className="col-span-3 space-y-4">
          <div className="card p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-navy-800"><TrendingUp size={18} className="text-navy-500" /> {member.name}의 새 성취 경험</h3>
            <div className="mt-4 space-y-3">
              {achievementFields.map((f) => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} className="input mt-1" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link to="/records?tab=coaching" className="text-xs font-semibold text-navy-600">내 기록에서 전체 보기</Link>
              <button onClick={save} disabled={!form.problem.trim() || !form.action.trim()} className="btn-primary"><Save size={16} /> 성취 기록 저장</button>
            </div>
          </div>
          {mine.length > 0 && (
            <div className="card p-6">
              <p className="font-bold text-navy-800">{member.name}의 경력 기록 {mine.length}건</p>
              <ol className="mt-3 space-y-3 border-l-2 border-navy-100 pl-4">
                {mine.map((a) => (
                  <li key={a.id} className="relative text-sm">
                    <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-navy-500" />
                    <p className="text-[11px] text-slate-400">{formatDate(a.createdAt)}</p>
                    <p className="font-semibold text-slate-800">{a.problem}</p>
                    <p className="text-slate-600">근거 · {a.reasoning || '—'} / 행동 · {a.action}</p>
                    {a.next && <p className="text-navy-700">다음 → {a.next}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className="card p-6">
            <p className="flex items-center gap-2 font-bold text-navy-800"><Award size={18} className="text-safety-500" /> {kcaInfo.title}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-700">{kcaInfo.points.map((p) => <li key={p}>· {p}</li>)}</ul>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {kcaInfo.steps.map((s, i) => {
                const done = state.kcaStep > i
                return (
                  <button key={s} onClick={() => setKcaStep(done ? i : i + 1)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${done ? 'border-safety-300 bg-safety-50 text-safety-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    {done ? <CheckCircle2 size={14} /> : <Circle size={14} />} {s}
                  </button>
                )
              })}
            </div>
            <a href={kcaInfo.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:underline">한국코치협회 <ExternalLink size={12} /></a>
          </div>
          <Callout tone="info">인증은 자격이고 코칭은 실행입니다. 둘을 구분해, 코칭 질문 연습 누적과 성취 기록 건수가 인증 준비 단계의 근거가 됩니다.</Callout>
        </section>
      </div>
      <Toast message={toast} />
    </div>
  )
}
