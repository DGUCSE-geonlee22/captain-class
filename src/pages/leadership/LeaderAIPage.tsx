import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Layers, MessageCircle, RotateCcw, Save, Sparkles, Swords } from 'lucide-react'
import { AiNotice, PageHeader, PrivacyWarning, Toast } from '../../components/ui'
import { LeaderDeck, LeaderPortrait } from '../../components/LeaderCard'
import { categoryMeta, leaderById, leaders, type LeaderCategory, type LeaderProfile } from '../../data/leaders'
import { makeAdvice, situationLabel, type Advice } from '../../lib/leaderAdvice'
import { useApp } from '../../context/AppContext'

const presets = [
  '협력사가 위험을 이유로 작업 중지를 요청했는데 본사는 공기를 재촉합니다.',
  '승진에서 밀린 입사동기에게 작업 지시를 해야 하는데 너무 어색합니다.',
  '공정 지연 경고를 세 번 받은 팀원이 점점 말이 없어집니다.',
  '본사가 현장 확인 없이 AI 로그만 보고 지적 공문을 보냈습니다.',
]

type Step = 'concern' | 'deck' | 'advice'

export default function LeaderAIPage() {
  const [params] = useSearchParams()
  const { addJudgment, completeLesson } = useApp()
  const [concern, setConcern] = useState(params.get('q') ?? '')
  const [step, setStep] = useState<Step>(params.get('q') ? 'deck' : 'concern')
  const [filter, setFilter] = useState<'all' | LeaderCategory>('all')
  const [picked, setPicked] = useState<LeaderProfile | null>(leaderById(params.get('leader') ?? '') ?? null)
  const [history, setHistory] = useState<Advice[]>([])
  const [active, setActive] = useState(0)
  const [thinking, setThinking] = useState(false)
  const [decision, setDecision] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const deck = useMemo(() => {
    const list = filter === 'all' ? leaders : leaders.filter((l) => l.category === filter)
    return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  }, [filter])

  useEffect(() => {
    if (!thinking) return
    const t = setTimeout(() => setThinking(false), 1100)
    return () => clearTimeout(t)
  }, [thinking])

  const ask = () => {
    if (!picked) return
    const a = makeAdvice(picked, concern)
    const next = [...history.filter((h) => h.leaderId !== picked.id), a]
    setHistory(next)
    setActive(next.length - 1)
    setThinking(true)
    setStep('advice')
  }
  const save = () => {
    addJudgment({
      scenarioTitle: concern.slice(0, 60),
      guideName: history.map((h) => leaderById(h.leaderId)?.name).join(' · '),
      question: history[active]?.reflect ?? '',
      direction: decision,
      followUpAnswers: history.map((h) => ({ party: leaderById(h.leaderId)?.name ?? '', question: h.steps[0], answer: '' })),
    })
    completeLesson('ch-b')
    setToast('내 결정을 판단 기록에 저장했습니다 (+15 M)')
    setTimeout(() => setToast(null), 2400)
    setDecision('')
  }
  const reset = () => {
    setStep('concern')
    setHistory([])
    setPicked(null)
    setConcern('')
  }

  const current = history[active]
  const curLeader = current ? leaderById(current.leaderId) : undefined

  return (
    <div>
      <PageHeader
        en="Leader AI"
        backTo="/course/charisma-character"
        backLabel="Charisma+Character 코스"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">레슨 B</span>}
        title="리더 AI에게 묻기 — 흰수염이라면, 이순신이라면 어떻게 했을까?"
        description="고민을 적고 리더 카드를 골라 보세요. 그 리더의 성격과 리더십을 미리 학습한 AI가 '나라면 이렇게 했을 것'이라고 조언합니다. 여러 리더에게 물어 비교하다 보면 내 상황에 맞는 답이 보입니다. 수료 후에도 계속 쓰는 기능입니다."
        right={<AiNotice />}
      />

      {/* 단계 표시 */}
      <div className="mb-6 flex items-center justify-center gap-3 text-sm">
        {[
          { k: 'concern', label: '고민 입력', icon: MessageCircle },
          { k: 'deck', label: '리더 카드 고르기', icon: Layers },
          { k: 'advice', label: '리더 AI의 조언', icon: Sparkles },
        ].map((s, i) => {
          const on = s.k === step
          const Icon = s.icon
          return (
            <div key={s.k} className="flex items-center gap-3">
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold ${on ? 'bg-navy-700 text-white' : 'bg-slate-100 text-slate-500'}`}><Icon size={14} /> {s.label}</span>
              {i < 2 && <ArrowRight size={14} className="text-slate-300" />}
            </div>
          )
        })}
      </div>

      {step === 'concern' && (
        <div className="mx-auto max-w-3xl">
          <div className="card p-7">
            <label className="text-lg font-bold text-navy-800">리더로서 지금 어떤 고민이 있나요?</label>
            <textarea value={concern} onChange={(e) => setConcern(e.target.value)} placeholder="예: 협력사가 위험을 이유로 작업 중지를 요청했는데 본사는 공기를 재촉합니다." className="input mt-3 min-h-[130px] resize-none text-base" />
            <PrivacyWarning />
            <div className="mt-4 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button key={p} onClick={() => setConcern(p)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-navy-300 hover:text-navy-700">{p.length > 30 ? p.slice(0, 30) + '…' : p}</button>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setStep('deck')} disabled={concern.trim().length < 5} className="btn-primary"><Layers size={16} /> 리더 카드 펼치기</button>
            </div>
          </div>
        </div>
      )}

      {step === 'deck' && (
        <div className="overflow-hidden rounded-3xl bg-[#0b1424] px-6 pb-6 pt-6 text-white">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-safety-300">Choose your leader</p>
              <p className="mt-1 text-xl font-bold">누구에게 물어볼까요?</p>
              <p className="mt-1 max-w-2xl text-sm text-white/60">"{concern}"</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {(['all', 'history', 'sports', 'story'] as const).map((c) => (
                <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === c ? 'bg-safety-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                  {c === 'all' ? `전체 ${leaders.length}` : `${categoryMeta[c].label} ${leaders.filter((l) => l.category === c).length}`}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4"><LeaderDeck list={deck} selectedId={picked?.id} onSelect={setPicked} /></div>
          <div className="mt-2 flex items-center justify-between rounded-2xl bg-white/5 px-5 py-4">
            {picked ? (
              <div className="flex items-center gap-4">
                <LeaderPortrait leader={picked} className="h-14 w-14 rounded-xl" />
                <div>
                  <p className="font-bold">{picked.name} <span className="ml-1 text-xs font-normal text-white/50">{picked.origin}</span></p>
                  <p className="text-sm text-white/70">{picked.pillars.slice(0, 3).map((p) => p.name).join(' · ')}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/60">카드를 좌우로 넘기며 한 명을 고르세요. ← → 버튼이나 트랙패드로 넘길 수 있습니다.</p>
            )}
            <div className="flex gap-2">
              <button onClick={() => setStep('concern')} className="btn border border-white/20 text-white/80 hover:bg-white/10"><ArrowLeft size={16} /> 고민 수정</button>
              <button onClick={ask} disabled={!picked} className="btn-orange"><Swords size={16} /> {picked ? `${picked.name}에게 묻기` : '카드를 고르세요'}</button>
            </div>
          </div>
        </div>
      )}

      {step === 'advice' && current && curLeader && (
        <div className="space-y-5">
          {history.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">물어본 리더</span>
              {history.map((h, i) => {
                const l = leaderById(h.leaderId)!
                return (
                  <button key={h.leaderId} onClick={() => { setActive(i); setThinking(false) }} className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm ${i === active ? 'border-safety-400 bg-safety-50 font-bold text-navy-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                    <LeaderPortrait leader={l} className="h-7 w-7 rounded-full" /> {l.name}
                  </button>
                )
              })}
            </div>
          )}
          <div className="grid grid-cols-7 gap-6">
            <aside className="col-span-2">
              <div className={`overflow-hidden rounded-3xl bg-gradient-to-br p-[3px] ${categoryMeta[curLeader.category].frame}`}>
                <div className="overflow-hidden rounded-[21px] bg-navy-900 text-white">
                  <LeaderPortrait leader={curLeader} className="h-[300px] w-full" />
                  <div className="p-4">
                    <p className="text-xl font-black">{curLeader.name}</p>
                    <p className="text-xs text-white/60">{curLeader.origin}</p>
                    <div className="mt-3 flex flex-wrap gap-1">{curLeader.traits.slice(0, 5).map((t) => <span key={t.name} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">{t.name}</span>)}</div>
                  </div>
                </div>
              </div>
              <Link to={`/course/charisma-character/leaders?leader=${curLeader.id}`} className="mt-3 flex items-center gap-1 text-xs font-semibold text-navy-600 hover:underline"><BookOpen size={12} /> {curLeader.name} 리더십 카드 자세히 보기</Link>
            </aside>
            <section className="col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600"><b className="text-navy-800">내 고민 · </b>{concern} <span className="ml-2 badge bg-slate-100 text-slate-500">{situationLabel[current.situation]}</span></div>
              {thinking ? (
                <div className="card flex items-center gap-3 p-6 text-slate-500">
                  <span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-safety-400" style={{ animationDelay: `${i * 150}ms` }} />)}</span>
                  {curLeader.name} AI가 자신의 리더십으로 상황을 살피는 중…
                </div>
              ) : (
                <div className="card relative p-7">
                  <p className="fadeup text-lg font-bold text-navy-800">{current.opener}</p>
                  <p className="fadeup fadeup-d1 mt-3 leading-relaxed text-slate-700">{current.read}</p>
                  <p className="fadeup fadeup-d1 mt-5 text-xs font-bold uppercase tracking-wider text-safety-600">나라면 이렇게 했을 것이다</p>
                  <ol className="mt-2 space-y-2.5">
                    {current.steps.map((s, i) => (
                      <li key={i} className="fadeup flex gap-3 rounded-xl bg-navy-50/70 px-4 py-3 text-[15px] leading-relaxed text-navy-800" style={{ animationDelay: `${250 + i * 180}ms` }}>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white">{i + 1}</span>{s}
                      </li>
                    ))}
                  </ol>
                  {current.example && <p className="fadeup fadeup-d3 mt-4 rounded-xl border-l-4 border-safety-400 bg-safety-50/70 px-4 py-3 text-sm text-slate-700">{current.example}</p>}
                  <p className="fadeup fadeup-d3 mt-4 text-base font-semibold italic text-navy-700">"{current.closer}"</p>
                  <p className="fadeup fadeup-d3 mt-4 text-[11px] text-slate-400">실제 인물·캐릭터의 발언이 아니라, 알려진 성격과 리더십을 학습한 가상 리더 AI의 조언입니다. 참고용이며 최종 판단은 캡틴이 합니다.</p>
                </div>
              )}
              {!thinking && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="card p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">생각해 볼 질문</p>
                    <p className="mt-2 text-sm font-medium text-navy-800">{current.reflect}</p>
                    <button onClick={() => { setPicked(null); setStep('deck') }} className="btn-ghost mt-4 w-full"><Layers size={16} /> 다른 리더에게도 묻기</button>
                  </div>
                  <div className="card p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">내 결정 (최종 판단은 캡틴이)</p>
                    <textarea value={decision} onChange={(e) => setDecision(e.target.value)} placeholder="조언을 듣고 내가 정한 방향을 적어 보세요" className="input mt-2 min-h-[70px] resize-none text-sm" />
                    <div className="mt-2 flex justify-between">
                      <button onClick={reset} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"><RotateCcw size={12} /> 새 고민</button>
                      <button onClick={save} disabled={decision.trim().length < 5} className="btn-primary"><Save size={16} /> 판단 기록 저장</button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
      <Toast message={toast} />
    </div>
  )
}
