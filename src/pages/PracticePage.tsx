import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Circle, Lightbulb, MessageSquareText, PenLine, RotateCcw, Send, Sparkles } from 'lucide-react'
import { AiNotice, Callout, PageHeader, PrivacyWarning, ProgressBar, Toast } from '../components/ui'
import { scenarioById, scenarios } from '../data/scenarios'
import { hints } from '../data/hints'
import { classifyReply, clamp, replyTypeLabel, scoreDelta } from '../lib/mockAI'
import { useApp } from '../context/AppContext'
import type { ReplyType, Scenario } from '../data/types'

interface Msg {
  who: 'npc' | 'me' | 'system'
  text: string
  type?: ReplyType
}

const typeStyle: Record<ReplyType, string> = {
  control: 'bg-red-50 text-red-700',
  avoid: 'bg-slate-100 text-slate-600',
  explore: 'bg-navy-50 text-navy-700',
  empathic: 'bg-teal-50 text-teal-700',
}

export default function PracticePage() {
  const [params, setParams] = useSearchParams()
  const scenario = scenarioById(params.get('scenario'))

  if (!scenario) {
    return (
      <div>
        <PageHeader
          en="Practice Room"
          eyebrow={<span className="badge bg-teal-50 text-teal-700">핵심 기능 2</span>}
          title="캡틴 대화 연습실"
          description="어려운 대화를 시나리오로 미리 연습합니다. 매 턴 선택지를 고르거나 직접 입력하면, 공감도·명확성·심리적 안전감 지수가 실시간으로 바뀝니다."
          right={<AiNotice />}
        />
        <div className="grid grid-cols-3 gap-5">
          {scenarios.map((s) => (
            <button key={s.id} onClick={() => setParams({ scenario: s.id })} className="card group flex flex-col p-6 text-left transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><MessageSquareText size={22} /></span>
              <h3 className="text-base font-bold text-navy-800">{s.title}</h3>
              <p className="mt-1 text-xs text-slate-500">상대: {s.counterpart} · {s.counterpartRole}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{s.context}</p>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal-600">{s.turns.length}턴 분기 대화 · 시작하기 <ArrowRight size={14} /></span>
            </button>
          ))}
        </div>
        <div className="mt-6">
          <Callout tone="teal">AI가 제안한 표현을 그대로 따라 하지 말고 실제 관계에 맞게 고쳐 쓰세요. 목표는 언제나 부드럽게 말하는 것이 아니라, 존중하면서 기준을 분명히 전달하는 것입니다.</Callout>
        </div>
      </div>
    )
  }

  return <PracticeRoom key={scenario.id} scenario={scenario} onExit={() => setParams({})} />
}

function PracticeRoom({ scenario, onExit }: { scenario: Scenario; onExit: () => void }) {
  const navigate = useNavigate()
  const { addPracticeResult, addPracticeLog, completeLesson } = useApp()
  const [turn, setTurn] = useState(0)
  const [messages, setMessages] = useState<Msg[]>([{ who: 'npc', text: scenario.turns[0].npc }])
  const [scores, setScores] = useState({ empathy: 50, clarity: 50, safety: 50 })
  const [types, setTypes] = useState<ReplyType[]>([])
  const [input, setInput] = useState('')
  const [finished, setFinished] = useState(false)
  const [hintIdx, setHintIdx] = useState(0)
  const [showLog, setShowLog] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [log, setLog] = useState({ purpose: '', expression: '', reaction: '', nextChange: '' })
  const bottomRef = useRef<HTMLDivElement>(null)
  const savedRef = useRef(false)

  const hintList = hints[scenario.id] ?? hints.default
  const current = scenario.turns[turn]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (finished && !savedRef.current) {
      savedRef.current = true
      addPracticeResult({ scenarioId: scenario.id, scores })
      completeLesson('cc-a')
    }
  }, [finished, scores, scenario.id, addPracticeResult, completeLesson])

  const respond = (type: ReplyType, text: string) => {
    if (finished) return
    const d = scoreDelta[type]
    const next = { empathy: clamp(scores.empathy + d.empathy), clarity: clamp(scores.clarity + d.clarity), safety: clamp(scores.safety + d.safety) }
    setScores(next)
    setTypes((t) => [...t, type])
    const reaction = current.reactions[type]
    const isLast = turn + 1 >= scenario.turns.length
    const newMsgs: Msg[] = [{ who: 'me', text, type }, { who: 'npc', text: reaction }]
    if (!isLast) newMsgs.push({ who: 'npc', text: scenario.turns[turn + 1].npc })
    else newMsgs.push({ who: 'system', text: scenario.closing })
    setMessages((m) => [...m, ...newMsgs])
    setInput('')
    if (isLast) setFinished(true)
    else setTurn(turn + 1)
  }

  const sendFree = () => {
    const t = input.trim()
    if (!t) return
    respond(classifyReply(t), t)
  }

  const useHint = () => {
    setMessages((m) => [...m, { who: 'system', text: `리더 AI · ${hintList[hintIdx % hintList.length]}` }])
    setHintIdx((i) => i + 1)
  }

  const checklist = useMemo(() => {
    const has = (t: ReplyType) => types.includes(t)
    return [
      { label: '문제를 구체적으로 설명했는가', ok: has('empathic') || (has('control') && has('explore')) },
      { label: '노력을 인정했는가', ok: has('empathic') || has('explore') },
      { label: '개선 방향을 제시했는가', ok: types[types.length - 1] === 'empathic' },
    ]
  }, [types])

  const saveLog = () => {
    addPracticeLog({ scenarioId: scenario.id, scenarioTitle: scenario.title, ...log, scores })
    setToast('실천 Log를 내 기록에 저장했습니다 (+15 M)')
    setTimeout(() => navigate('/records?tab=practice'), 900)
  }

  return (
    <div>
      <PageHeader
        en="Practice Room"
        backTo="/practice"
        backLabel="시나리오 선택"
        eyebrow={<span className="badge bg-teal-50 text-teal-700">캡틴 대화 연습실</span>}
        title={scenario.title}
        description={scenario.context}
        right={<AiNotice />}
      />

      <div className="grid grid-cols-5 gap-6">
        {/* 채팅 */}
        <section className="col-span-3 card flex h-[640px] flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white">{scenario.counterpart.slice(0, 1)}</span>
            <div>
              <p className="text-sm font-bold text-navy-800">{scenario.counterpart}</p>
              <p className="text-[11px] text-slate-500">{scenario.counterpartRole}</p>
            </div>
            <span className="ml-auto text-xs text-slate-500">{finished ? '대화 종료' : `${turn + 1} / ${scenario.turns.length} 턴`}</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-5">
            {messages.map((m, i) =>
              m.who === 'system' ? (
                <div key={i} className="mx-auto max-w-[85%] rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2 text-center text-xs text-slate-600">{m.text}</div>
              ) : (
                <div key={i} className={`flex ${m.who === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${m.who === 'me' ? 'bg-navy-700 text-white' : 'bg-white text-slate-800'}`}>
                    {m.type && <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeStyle[m.type]}`}>{replyTypeLabel[m.type]}</span>}
                    <p>{m.text}</p>
                  </div>
                </div>
              ),
            )}
            <div ref={bottomRef} />
          </div>

          {!finished ? (
            <div className="border-t border-slate-100 p-4">
              <div className="mb-3 grid grid-cols-2 gap-2">
                {current.choices.map((c) => (
                  <button key={c.type} onClick={() => respond(c.type, c.text)} className="rounded-xl border border-slate-200 bg-white p-3 text-left text-xs leading-relaxed text-slate-700 transition hover:border-teal-300 hover:bg-teal-50/40">
                    {c.text}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendFree()} placeholder="직접 입력하면 가장 가까운 유형으로 매칭됩니다" className="input" />
                <button onClick={useHint} className="btn-ghost shrink-0" title="막히면 리더 AI가 짧은 질문을 던집니다"><Lightbulb size={16} /> 리더 AI</button>
                <button onClick={sendFree} disabled={!input.trim()} className="btn-primary shrink-0"><Send size={16} /></button>
              </div>
              <PrivacyWarning text="실제 구성원의 실명·개인 사정은 입력하지 마세요. 연습용 상황만 적습니다." />
            </div>
          ) : (
            <div className="flex items-center justify-between border-t border-slate-100 p-4">
              <button onClick={onExit} className="btn-ghost"><RotateCcw size={16} /> 다른 시나리오</button>
              <button onClick={() => setShowLog(true)} className="btn-orange"><PenLine size={16} /> 실제 면담·TBM 후 기록하기</button>
            </div>
          )}
        </section>

        {/* 지수 패널 / 리포트 */}
        <aside className="col-span-2 space-y-4">
          <div className="card p-6">
            <p className="font-bold text-navy-800">실시간 지수</p>
            <div className="mt-4 space-y-4">
              <Gauge label="공감도" value={scores.empathy} color="#1F9E8F" />
              <Gauge label="명확성" value={scores.clarity} color="#1E2A4A" />
              <Gauge label="심리적 안전감" value={scores.safety} color="#F28C28" />
            </div>
            {types.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {types.map((t, i) => <span key={i} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${typeStyle[t]}`}>{i + 1}턴 {replyTypeLabel[t]}</span>)}
              </div>
            )}
          </div>

          {finished ? (
            <div className="card border-teal-200 p-6">
              <p className="flex items-center gap-2 font-bold text-navy-800"><Sparkles size={16} className="text-teal-500" /> 종료 리포트</p>
              <ul className="mt-4 space-y-2">
                {checklist.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-sm">
                    {c.ok ? <CheckCircle2 size={16} className="text-teal-600" /> : <Circle size={16} className="text-slate-300" />}
                    <span className={c.ok ? 'text-slate-800' : 'text-slate-500'}>{c.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl bg-navy-50 p-4 text-sm leading-relaxed text-navy-800">
                <p className="mb-1 text-xs font-bold text-navy-500">문장 교정 가이드</p>
                {scenario.correctionGuide}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">AI가 제안한 표현을 그대로 따라 하지 말고 실제 관계에 맞게 고쳐 쓰세요. 목표는 언제나 부드럽게 말하는 것이 아니라, 존중하면서 기준을 분명히 전달하는 것입니다.</p>
              <Link to={`/pnancheo?q=${encodeURIComponent(scenario.title)}`} className="btn-ghost mt-4 w-full">이 상황의 선배 사례 다시 보기</Link>
            </div>
          ) : (
            <Callout tone="info">막히면 <b>리더 AI</b> 버튼을 누르세요. 더 깊이 묻고 싶다면 <Link to={`/course/charisma-character/leader-ai?q=${encodeURIComponent(scenario.context)}`} className="font-semibold underline">흰수염·이순신에게 이 상황 묻기 →</Link></Callout>
          )}
        </aside>
      </div>

      {/* 실천 Log 양식 */}
      {showLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-6" onClick={() => setShowLog(false)}>
          <div className="card w-[640px] p-7" onClick={(e) => e.stopPropagation()}>
            <p className="text-lg font-bold text-navy-800">실천 Log — 실제 면담·TBM 후 기록</p>
            <p className="mt-1 text-sm text-slate-500">연습이 아니라 실제 대화를 복기합니다. 비포/애프터와 함께 '내 기록'에 저장됩니다.</p>
            <div className="mt-5 space-y-3">
              <Field label="대화 목적" value={log.purpose} onChange={(v) => setLog({ ...log, purpose: v })} placeholder="예: 폭염일 교대 휴식 운영을 반장과 합의" />
              <Field label="사용한 표현" value={log.expression} onChange={(v) => setLog({ ...log, expression: v })} placeholder="예: '벌점 얘기 전에, 몇 시간째 쉬지 않고 하신 거예요?'" />
              <Field label="상대 반응" value={log.reaction} onChange={(v) => setLog({ ...log, reaction: v })} placeholder="예: 처음엔 경계했지만 그늘막 얘기를 먼저 꺼냄" />
              <Field label="다음에 바꿀 점" value={log.nextChange} onChange={(v) => setLog({ ...log, nextChange: v })} placeholder="예: 본사 소명 계획을 먼저 말하고 부탁하기" />
            </div>
            <PrivacyWarning />
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowLog(false)} className="btn-ghost">닫기</button>
              <button onClick={saveLog} disabled={!log.purpose.trim() || !log.expression.trim()} className="btn-teal">내 기록에 저장</button>
            </div>
          </div>
        </div>
      )}
      <Toast message={toast} />
    </div>
  )
}

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-bold" style={{ color }}>{value}</span>
      </div>
      <ProgressBar value={value} color={color} height={10} />
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input mt-1" />
    </div>
  )
}
