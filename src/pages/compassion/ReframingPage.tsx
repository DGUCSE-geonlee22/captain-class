import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Clock, Thermometer, Timer, Weight, MapPin, Lock, Unlock, Save, ArrowRight } from 'lucide-react'
import { AiNotice, Callout, PageHeader, PrivacyWarning, Toast } from '../../components/ui'
import { safetyLogs } from '../../data/logs'
import { useApp } from '../../context/AppContext'

type Step = 1 | 2 | 3

export default function ReframingPage() {
  const [params, setParams] = useSearchParams()
  const { addSignalNote, completeLesson } = useApp()
  const initial = safetyLogs.find((l) => l.id === params.get('log')) ?? safetyLogs[0]
  const [logId, setLogId] = useState(initial.id)
  const log = useMemo(() => safetyLogs.find((l) => l.id === logId)!, [logId])
  const [step, setStep] = useState<Step>(1)
  const [countdown, setCountdown] = useState(10)
  const [response, setResponse] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (step !== 3) return
    const t = setInterval(() => setCountdown((c) => (c <= 1 ? 0 : c - 1)), 1000)
    return () => clearInterval(t)
  }, [step])

  const goStep3 = () => {
    setCountdown(10)
    setStep(3)
  }

  const pick = (id: string) => {
    setLogId(id)
    setStep(1)
    setResponse('')
    setParams({ log: id })
  }

  const save = () => {
    addSignalNote({ logId: log.id, rawLog: log.rawLog, reframed: log.reframed, response })
    completeLesson('cp-a')
    setToast('신호 노트에 저장했습니다 (+10 M)')
    setTimeout(() => setToast(null), 2200)
    setResponse('')
  }

  const locked = step === 3 && countdown > 0

  return (
    <div>
      <PageHeader
        en="Reframing"
        backTo="/course/compassion"
        backLabel="Compassion 코스"
        eyebrow={<span className="badge bg-teal-50 text-teal-700">레슨 A</span>}
        title="현장 공감형 Reframing 훈련"
        description="AI 경고가 들어오면 벌점 로그를 바로 띄우지 않습니다. 환경 데이터를 먼저 보고, 차가운 로그를 맥락 문장으로 다시 읽은 뒤, 10초의 생각 시간을 거쳐 대응 방향을 적습니다."
        right={<AiNotice />}
      />

      <div className="grid grid-cols-4 gap-6">
        {/* 로그 선택 */}
        <aside className="col-span-1 space-y-2">
          <p className="label mb-2">수신된 AI 경고</p>
          {safetyLogs.map((l) => (
            <button
              key={l.id}
              onClick={() => pick(l.id)}
              className={`w-full rounded-xl border p-3 text-left text-xs transition ${l.id === logId ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <span className="block font-mono text-[10px] text-slate-400">{l.rawLog.split(']')[0]}]</span>
              <span className="mt-1 block font-semibold text-slate-700">{l.zone}</span>
              <span className="text-slate-500">{l.time}</span>
            </button>
          ))}
        </aside>

        {/* 3단계 */}
        <section className="col-span-3 space-y-4">
          <Stepper step={step} />

          {step === 1 && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-navy-800">1. 데이터 융합</h3>
              <p className="mt-1 text-sm text-slate-500">벌점 로그 대신 환경 데이터를 먼저 봅니다. 이 숫자들이 작업자의 하루입니다.</p>
              <div className="mt-5 grid grid-cols-5 gap-3">
                <Env icon={<Clock size={18} />} label="시각" value={log.time} />
                <Env icon={<Thermometer size={18} />} label="체감온도" value={`${log.feelsLike}°C`} warn={log.feelsLike >= 28} />
                <Env icon={<Timer size={18} />} label="연속 작업" value={`${log.continuousHours}시간`} warn={log.continuousHours >= 4} />
                <Env icon={<Weight size={18} />} label="취급 자재" value={log.materialWeight} />
                <Env icon={<MapPin size={18} />} label="구역" value={log.zone} />
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setStep(2)} className="btn-teal">로그 다시 읽기 <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-navy-800">2. 차가운 로그 Reframing</h3>
              <p className="mt-1 text-sm text-slate-500">같은 사건을 두 가지 언어로 읽습니다.</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="label mb-2">원래 로그 (AI 관제)</p>
                  <p className="font-mono text-sm text-slate-600">{log.rawLog}</p>
                </div>
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
                  <p className="label mb-2 text-teal-700">Reframing (맥락 문장)</p>
                  <p className="text-sm leading-relaxed text-slate-800">{log.reframed}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-ghost">이전</button>
                <button onClick={goStep3} className="btn-teal">관점 전환으로 <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-navy-800">3. 관점 전환 프롬프트</h3>
                  <p className="mt-1 text-sm text-slate-500">생각의 시간 동안 지적 입력은 잠겨 있습니다. 질문을 먼저 읽어 주세요.</p>
                </div>
                <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 ${locked ? 'border-safety-400 text-safety-600' : 'border-teal-400 text-teal-600'}`}>
                  <span className="text-xl font-black leading-none">{countdown}</span>
                  <span className="text-[10px]">{locked ? '생각 중' : '열림'}</span>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {log.reflectionQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-navy-50 px-4 py-3 text-sm text-navy-800">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-700 text-[11px] font-bold text-white">{i + 1}</span>
                    {q}
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label className="label flex items-center gap-1.5">
                  {locked ? <Lock size={12} /> : <Unlock size={12} />} 대응 방향 (신호 노트)
                </label>
                <textarea
                  disabled={locked}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder={locked ? '10초 뒤에 입력할 수 있습니다…' : '예: 벌점 통보 전에 현장에 가서 체감온도와 교대 휴식 여부를 확인하고, 본사에는 환경 데이터를 함께 보낸다.'}
                  className="input mt-1.5 min-h-[110px] resize-none disabled:bg-slate-50"
                />
                <PrivacyWarning />
              </div>

              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(2)} className="btn-ghost">이전</button>
                <div className="flex gap-2">
                  <Link to="/records?tab=signal" className="btn-ghost">내 신호 노트</Link>
                  <button onClick={save} disabled={locked || response.trim().length < 5} className="btn-teal"><Save size={16} /> 신호 노트로 저장</button>
                </div>
              </div>
            </div>
          )}

          <Callout tone="teal">Reframing 문장은 벌점을 없애자는 뜻이 아닙니다. 규정을 지키면서도 그 규정이 작동할 조건을 리더가 먼저 보자는 훈련입니다.</Callout>
        </section>
      </div>
      <Toast message={toast} />
    </div>
  )
}

function Stepper({ step }: { step: Step }) {
  const items = ['데이터 융합', '로그 Reframing', '관점 전환']
  return (
    <div className="flex items-center gap-2">
      {items.map((label, i) => {
        const n = (i + 1) as Step
        const active = n === step
        const done = n < step
        return (
          <div key={label} className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-teal-500 text-white' : done ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>{n}</span>
            <span className={`text-sm ${active ? 'font-bold text-navy-800' : 'text-slate-500'}`}>{label}</span>
            {i < items.length - 1 && <span className="mx-2 h-px w-10 bg-slate-200" />}
          </div>
        )
      })}
    </div>
  )
}

function Env({ icon, label, value, warn }: { icon: React.ReactNode; label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${warn ? 'border-safety-200 bg-safety-50' : 'border-slate-200 bg-white'}`}>
      <div className={`mb-2 ${warn ? 'text-safety-600' : 'text-slate-400'}`}>{icon}</div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${warn ? 'text-safety-700' : 'text-navy-800'}`}>{value}</p>
    </div>
  )
}
