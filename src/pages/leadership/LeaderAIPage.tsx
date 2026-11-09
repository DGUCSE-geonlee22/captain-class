import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Compass, HelpCircle, Save, Sparkles } from 'lucide-react'
import { AiNotice, Callout, PageHeader, PrivacyWarning, Toast } from '../../components/ui'
import { guides, leaderAIPrinciple, leaderAIScenarios, matchLeaderScenario, type Guide, type LeaderAIScenario } from '../../data/leaderAI'
import { useApp } from '../../context/AppContext'

type Step = 1 | 2 | 3 | 4

export default function LeaderAIPage() {
  const { addJudgment, completeLesson } = useApp()
  const [step, setStep] = useState<Step>(1)
  const [text, setText] = useState('')
  const [scenario, setScenario] = useState<LeaderAIScenario | null>(null)
  const [guide, setGuide] = useState<Guide | null>(null)
  const [direction, setDirection] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<string | null>(null)

  const situationText = scenario?.situation ?? text
  const followUps = useMemo(() => scenario?.followUps ?? [
    { party: '구성원', question: '이 방향을 들은 구성원은 무엇을 먼저 걱정할까?' },
    { party: '상대 부서', question: '이 방향이 상대 부서에 주는 영향은 무엇이고, 그쪽은 어떤 자료를 요구할까?' },
    { party: '나', question: '이 판단의 근거를 한 문장으로 말한다면 무엇인가?' },
  ], [scenario])

  const choosePreset = (s: LeaderAIScenario) => {
    setScenario(s)
    setText(s.situation)
    setStep(2)
  }
  const useFreeText = () => {
    setScenario(matchLeaderScenario(text) ?? null)
    setStep(2)
  }
  const save = () => {
    addJudgment({
      scenarioTitle: scenario?.title ?? text.slice(0, 40),
      guideName: guide?.name ?? '',
      question: guide?.questions[0] ?? '',
      direction,
      followUpAnswers: followUps.map((f) => ({ party: f.party, question: f.question, answer: answers[f.party] ?? '' })),
    })
    completeLesson('ch-a')
    setToast('판단 기록에 저장했습니다 (+15 M)')
    setTimeout(() => setToast(null), 2200)
    setStep(1)
    setText('')
    setScenario(null)
    setGuide(null)
    setDirection('')
    setAnswers({})
  }

  return (
    <div>
      <PageHeader
        en="Leader AI"
        backTo="/course/charisma-character"
        backLabel="Charisma+Character 코스"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">레슨 A</span>}
        title="질문형 리더 AI — 답 대신 질문을 던지는 안내자"
        description={leaderAIPrinciple.body}
        right={<AiNotice />}
      />

      <div className="mb-6 flex items-center gap-2">
        {['상황', '안내자의 질문', '내 방향', '영향 되묻기'].map((label, i) => {
          const n = (i + 1) as Step
          return (
            <div key={label} className="flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${n === step ? 'bg-navy-700 text-white' : n < step ? 'bg-navy-100 text-navy-700' : 'bg-slate-100 text-slate-400'}`}>{n}</span>
              <span className={`text-sm ${n === step ? 'font-bold text-navy-800' : 'text-slate-500'}`}>{label}</span>
              {i < 3 && <span className="mx-2 h-px w-10 bg-slate-200" />}
            </div>
          )
        })}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-5 gap-6">
          <div className="card col-span-3 p-6">
            <h3 className="text-lg font-bold text-navy-800">지금 어떤 판단 앞에 서 있나요?</h3>
            <p className="mt-1 text-sm text-slate-500">리더 AI는 해결책을 주지 않습니다. 상황을 적으면 안내자가 먼저 물어야 할 것을 묻습니다.</p>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="예: 협력사가 위험을 이유로 작업 중지를 요청했는데 본사는 공기를 재촉합니다." className="input mt-4 min-h-[120px] resize-none" />
            <PrivacyWarning />
            <div className="mt-4 flex justify-end">
              <button onClick={useFreeText} disabled={text.trim().length < 5} className="btn-primary">안내자에게 가기 <ArrowRight size={16} /></button>
            </div>
          </div>
          <div className="col-span-2 space-y-3">
            <p className="label">가상 시나리오</p>
            {leaderAIScenarios.map((s) => (
              <button key={s.id} onClick={() => choosePreset(s)} className="card w-full p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex items-center gap-2 font-bold text-navy-800"><Compass size={16} className="text-navy-500" /> {s.title}</span>
                <span className="mt-2 block text-sm text-slate-600">{s.situation}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-navy-700 px-6 py-5 text-white">
            <p className="text-xs text-navy-200">상황</p>
            <p className="mt-1 text-base">{situationText}</p>
          </div>
          <div>
            <p className="label mb-3">누구의 눈으로 먼저 물어볼까요? — 안내자를 고르세요</p>
            <div className="grid grid-cols-3 gap-4">
              {guides.map((g) => (
                <button key={g.id} onClick={() => setGuide(g)} className={`card p-5 text-left transition ${guide?.id === g.id ? 'border-navy-400 ring-2 ring-navy-100' : 'hover:border-slate-300'}`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white">{g.name.slice(0, 1)}</span>
                  <p className="mt-3 font-bold text-navy-800">{g.name}</p>
                  <p className="text-xs text-slate-500">{g.from}</p>
                  <p className="mt-2 text-xs text-slate-600">{g.focus}</p>
                </button>
              ))}
            </div>
          </div>
          {guide && (
            <div className="grid grid-cols-5 gap-5">
              <div className="card col-span-3 p-6">
                <p className="flex items-center gap-2 text-sm font-bold text-navy-800"><HelpCircle size={16} className="text-navy-500" /> {guide.name}이라면 먼저 이렇게 물었을 겁니다</p>
                <ul className="mt-4 space-y-3">
                  {guide.questions.map((q) => (
                    <li key={q} className="rounded-xl bg-navy-50 px-4 py-3 text-base font-medium text-navy-800">"{q}"</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-500">→ {guide.focus}</p>
              </div>
              <div className="card col-span-2 p-6">
                <p className="flex items-center gap-2 text-sm font-bold text-navy-800"><BookOpen size={16} className="text-safety-500" /> 판단에 참고할 자료</p>
                {scenario?.references.length ? (
                  <ul className="mt-3 space-y-3">
                    {scenario.references.map((r) => (
                      <li key={r.title} className="rounded-xl border border-slate-200 p-3">
                        <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{r.summary}</p>
                        <p className="mt-1 text-[11px] text-slate-400">출처: {r.source}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">이 상황에 맞는 참고 자료가 아직 없습니다. 안내자의 질문만으로 생각을 넓혀 보세요.</p>
                )}
                <p className="mt-3 text-[11px] text-slate-400">AI는 판단을 대신하지 않고 근거가 될 자료만 제시합니다.</p>
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-ghost">이전</button>
            <button onClick={() => setStep(3)} disabled={!guide} className="btn-primary">질문에 답하며 방향 정하기 <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 3 && guide && (
        <div className="card p-6">
          <p className="text-sm text-slate-500">안내자의 질문</p>
          <p className="mt-1 text-lg font-bold text-navy-800">"{guide.questions[0]}"</p>
          <label className="label mt-5 block">내가 정한 방향 (AI가 써 주지 않습니다)</label>
          <textarea value={direction} onChange={(e) => setDirection(e.target.value)} placeholder="예: 오늘 오후 작업은 중지하고 현장 위험 요소를 사진·측정값으로 정리한다. 본사에는 작업중지권 운영 사례와 손실 보전 방식을 근거로 협의를 요청한다." className="input mt-1.5 min-h-[130px] resize-none" />
          <div className="mt-4 flex justify-between">
            <button onClick={() => setStep(2)} className="btn-ghost">이전</button>
            <button onClick={() => setStep(4)} disabled={direction.trim().length < 10} className="btn-primary">이 방향의 영향 되묻기 <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <Callout tone="info">리더가 방향을 정하면 리더 AI는 그 방향이 협력사·본사·작업자에게 어떤 영향을 주는지 다시 묻습니다. '중지한다 / 하지 않는다'의 이분법을 넘어 무엇을 조정해야 하는지 생각을 넓히기 위해서입니다.</Callout>
          <div className="rounded-2xl border border-navy-100 bg-navy-50 px-5 py-4 text-sm text-navy-800"><b>내 방향 · </b>{direction}</div>
          <div className="grid grid-cols-3 gap-4">
            {followUps.map((f) => (
              <div key={f.party} className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{f.party}에게 미치는 영향</p>
                <p className="mt-2 text-sm font-medium text-navy-800">"{f.question}"</p>
                <textarea value={answers[f.party] ?? ''} onChange={(e) => setAnswers({ ...answers, [f.party]: e.target.value })} placeholder="내 생각" className="input mt-3 min-h-[90px] resize-none text-sm" />
              </div>
            ))}
          </div>
          <div className="card flex items-center justify-between p-5">
            <p className="flex items-center gap-2 text-sm text-slate-600"><Sparkles size={16} className="text-navy-500" /> {leaderAIPrinciple.effect}</p>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="btn-ghost">이전</button>
            <div className="flex gap-2">
              <Link to="/records?tab=judgment" className="btn-ghost">내 판단 기록</Link>
              <button onClick={save} className="btn-primary"><Save size={16} /> 판단 기록으로 저장</button>
            </div>
          </div>
        </div>
      )}
      <Toast message={toast} />
    </div>
  )
}
