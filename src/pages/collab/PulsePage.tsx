import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, GitCommitHorizontal, Save, Sparkles } from 'lucide-react'
import { AiNotice, Callout, PageHeader, ProgressBar, Toast } from '../../components/ui'
import { teamMembers } from '../../data/team'
import { pulseCardsFor } from '../../data/pulseCards'
import { useApp } from '../../context/AppContext'

export default function PulsePage() {
  const { addInterviewNote, completeLesson } = useApp()
  const [memberId, setMemberId] = useState(teamMembers[2].id)
  const member = teamMembers.find((m) => m.id === memberId)!
  const cards = pulseCardsFor(memberId)
  const [selected, setSelected] = useState<string[]>([])
  const [memo, setMemo] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const pick = (id: string) => {
    setMemberId(id)
    setSelected([])
    setMemo('')
  }
  const toggle = (c: string) => setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))
  const save = () => {
    addInterviewNote({ memberId, memberName: member.name, cards: selected, memo })
    completeLesson('cc-c')
    setToast('면담 준비 노트에 저장했습니다 (+5 M)')
    setTimeout(() => setToast(null), 2200)
    setSelected([])
    setMemo('')
  }

  return (
    <div>
      <PageHeader
        en="Pulse Cards"
        backTo="/course/collab-comm"
        backLabel="Collaboration+Communication 코스"
        eyebrow={<span className="badge bg-teal-50 text-teal-700">레슨 C</span>}
        title="1:1 펄스 면담 질문 카드"
        description="팀원을 고르면 목업 지표와 함께 정서적 질문 카드 3장을 제안합니다. AI가 대신 묻지 않습니다. 리더가 직접 묻도록 돕는 가이드입니다."
        right={<AiNotice />}
      />
      <div className="grid grid-cols-4 gap-6">
        <aside className="space-y-2">
          <p className="label mb-2">A파트 구성원</p>
          {teamMembers.map((m) => (
            <button key={m.id} onClick={() => pick(m.id)} className={`w-full rounded-xl border p-3 text-left transition ${m.id === memberId ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <span className="block text-sm font-bold text-navy-800">{m.name}</span>
              <span className="block text-[11px] text-slate-500">{m.role}</span>
            </button>
          ))}
        </aside>

        <section className="col-span-3 space-y-4">
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-navy-800">{member.name}</h3>
                <p className="text-sm text-slate-500">{member.role}</p>
                <p className="mt-2 text-sm text-slate-700">{member.situation}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="flex items-center gap-1.5 text-xs text-slate-500"><Activity size={13} /> 업무 과부하 지수 (목업)</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1"><ProgressBar value={member.overloadIndex} color={member.overloadIndex >= 70 ? '#F28C28' : '#1F9E8F'} /></div>
                  <span className={`text-lg font-black ${member.overloadIndex >= 70 ? 'text-safety-600' : 'text-teal-600'}`}>{member.overloadIndex}</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="flex items-center gap-1.5 text-xs text-slate-500"><GitCommitHorizontal size={13} /> 최근 공정 전환점</p>
                <p className="mt-2 text-sm font-semibold text-navy-800">{member.recentTurningPoint}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <p className="flex items-center gap-2 font-bold text-navy-800"><Sparkles size={16} className="text-teal-500" /> 제안된 정서적 질문 카드</p>
            <p className="mt-1 text-sm text-slate-500">면담에서 직접 물을 카드를 고르세요. 여러 장 선택할 수 있습니다.</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {cards.map((c) => {
                const on = selected.includes(c)
                return (
                  <button key={c} onClick={() => toggle(c)} className={`min-h-[120px] rounded-2xl border-2 p-4 text-left text-sm leading-relaxed transition ${on ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                    <span className="mb-2 block text-2xl">"</span>
                    {c}
                  </button>
                )
              })}
            </div>
            <div className="mt-4">
              <label className="label">면담 전 메모 (선택)</label>
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예: 지연 리포트 기준 문제를 먼저 인정하고 시작하기" className="input mt-1.5 min-h-[70px] resize-none" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Callout tone="info">이 카드는 리더가 직접 묻기 위한 것입니다. 메시지 자동 발송 기능은 없습니다.</Callout>
              <div className="ml-4 flex shrink-0 gap-2">
                <Link to="/records?tab=interview" className="btn-ghost">내 면담 노트</Link>
                <button onClick={save} disabled={selected.length === 0} className="btn-teal"><Save size={16} /> 면담 준비 노트에 저장</button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Toast message={toast} />
    </div>
  )
}
