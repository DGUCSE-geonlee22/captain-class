import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Save, UserCheck, Users } from 'lucide-react'
import { AiNotice, Callout, PageHeader, Toast } from '../../components/ui'
import { delegationChoices, delegationTasks, type DelegationChoice } from '../../data/leaderAI'
import { useApp } from '../../context/AppContext'

export default function DelegationPage() {
  const { state, setDelegation, saveDelegationNote, completeLesson } = useApp()
  const [note, setNote] = useState(state.delegationNote)
  const [toast, setToast] = useState<string | null>(null)
  const chosen = Object.keys(state.delegation).filter((k) => delegationTasks.some((t) => t.id === k)).length
  const counts = delegationChoices.map((c) => ({ ...c, n: delegationTasks.filter((t) => state.delegation[t.id] === c.id).length }))

  const save = () => {
    saveDelegationNote(note)
    completeLesson('ch-b')
    setToast('AI 위임 기준표를 저장했습니다 (+20 M)')
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <div>
      <PageHeader
        en="Delegation Map"
        backTo="/course/charisma-character"
        backLabel="Charisma+Character 코스"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">레슨 B · Evaluate 단계</span>}
        title="'AI에 맡길 일 / 내가 할 일' 분류 — 나의 AI 위임 기준표"
        description="이번 주 업무를 하나씩 보며 AI에 맡길지, AI 초안을 받아 내가 확인할지, 처음부터 내가 할지 정합니다. 기준은 '사람의 몸 상태·신뢰·고충이 걸린 일은 사람이 한다'입니다."
        right={<AiNotice />}
      />
      <div className="grid grid-cols-5 gap-6">
        <section className="col-span-3 space-y-3">
          {delegationTasks.map((t) => {
            const cur = state.delegation[t.id]
            return (
              <div key={t.id} className="card flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="font-semibold text-navy-800">{t.task}</p>
                  <p className="text-xs text-slate-500">{t.hint}</p>
                </div>
                <div className="flex gap-1.5">
                  {delegationChoices.map((c) => (
                    <button key={c.id} onClick={() => setDelegation(t.id, c.id as DelegationChoice)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${cur === c.id ? c.color : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
        <aside className="col-span-2 space-y-4">
          <div className="card p-6">
            <p className="font-bold text-navy-800">내 기준표 요약</p>
            <p className="mt-1 text-xs text-slate-500">{chosen} / {delegationTasks.length} 업무 분류함</p>
            <div className="mt-4 space-y-2">
              {counts.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 text-slate-700">{c.id === 'ai' ? <Bot size={14} /> : c.id === 'me' ? <UserCheck size={14} /> : <Users size={14} />} {c.label}</span>
                  <b className="text-navy-800">{c.n}</b>
                </div>
              ))}
            </div>
            <label className="label mt-5 block">내 기준 한 줄</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="예: 로그 확인은 AI에 맡기고, 작업반장과 휴식 주기를 정하는 일은 내가 직접 한다." className="input mt-1 min-h-[90px] resize-none" />
            <div className="mt-4 flex items-center justify-between">
              <Link to="/records?tab=judgment" className="text-xs font-semibold text-navy-600">내 기록에서 보기</Link>
              <button onClick={save} disabled={chosen < 4 || note.trim().length < 5} className="btn-primary"><Save size={16} /> 기준표 저장</button>
            </div>
          </div>
          <Callout tone="info">현업 미션(4~6주): 이번 주 AI에 맡기지 않고 직접 할 일 1가지를 정해 실행하고, 기준표를 팀에 공유해 피드백을 받습니다.</Callout>
        </aside>
      </div>
      <Toast message={toast} />
    </div>
  )
}
