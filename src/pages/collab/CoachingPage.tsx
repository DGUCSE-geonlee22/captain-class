import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ban, CheckCircle2, Circle, Save } from 'lucide-react'
import { AiNotice, Callout, PageHeader, PrivacyWarning, Toast } from '../../components/ui'
import { coachingCheck, coachingPointLabels } from '../../lib/mockAI'
import { useApp } from '../../context/AppContext'

const examples = [
  '이대로는 승인 못 합니다. 다시 하세요.',
  'B열 철근 간격 틀렸습니다. 수정 바랍니다.',
  '보고서 수치가 또 틀렸네요. 세 번째입니다.',
]

export default function CoachingPage() {
  const { addBeforeAfter, completeLesson } = useApp()
  const [context, setContext] = useState('')
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [phase, setPhase] = useState<'draft' | 'revise'>('draft')
  const [toast, setToast] = useState<string | null>(null)

  const beforeCheck = useMemo(() => coachingCheck(before), [before])
  const afterCheck = useMemo(() => coachingCheck(after), [after])
  const score = (c: typeof beforeCheck) => [c.acknowledged, c.specific, c.direction].filter(Boolean).length

  const save = () => {
    addBeforeAfter({ source: 'coaching', context: context || '반려문·지적 코칭', before, after, check: afterCheck })
    completeLesson('cc-d')
    setToast('비포/애프터 기록에 저장했습니다 (+10 M)')
    setTimeout(() => setToast(null), 2200)
    setBefore('')
    setAfter('')
    setContext('')
    setPhase('draft')
  }

  return (
    <div>
      <PageHeader
        en="Feedback Coaching"
        backTo="/course/collab-comm"
        backLabel="Collaboration+Communication 코스"
        eyebrow={<span className="badge bg-teal-50 text-teal-700">레슨 D</span>}
        title="반려문·지적 코칭과 비포/애프터"
        description="작업 반려 또는 지적 문장 초안을 쓰면 규칙 기반 코칭 포인트 3가지를 점검합니다. AI는 고친 문장을 대신 써 주지 않습니다. 캡틴이 직접 수정합니다."
        right={<AiNotice />}
      />

      <div className="grid grid-cols-5 gap-6">
        <section className="col-span-3 space-y-4">
          <div className="card p-6">
            <label className="label">상황 (선택)</label>
            <input value={context} onChange={(e) => setContext(e.target.value)} placeholder="예: 이강 대리의 B열 철근 검측 보고서 반려" className="input mt-1.5" />

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label className="label">① 초안 (Before)</label>
                <div className="flex gap-1.5">
                  {examples.map((ex) => (
                    <button key={ex} onClick={() => { setBefore(ex); setPhase('draft') }} className="badge border border-slate-200 bg-white text-slate-500 hover:border-slate-300">예시</button>
                  ))}
                </div>
              </div>
              <textarea
                value={before}
                onChange={(e) => setBefore(e.target.value)}
                disabled={phase === 'revise'}
                placeholder="지금 머릿속에 있는 반려·지적 문장을 그대로 적어 보세요."
                className="input mt-1.5 min-h-[100px] resize-none disabled:bg-slate-50"
              />
              <PrivacyWarning />
            </div>

            {phase === 'draft' ? (
              <div className="mt-4 flex justify-end">
                <button onClick={() => { setAfter(before); setPhase('revise') }} disabled={before.trim().length < 5} className="btn-primary">코칭 포인트 확인하고 직접 고치기</button>
              </div>
            ) : (
              <div className="mt-5">
                <label className="label">② 직접 수정한 문장 (After)</label>
                <textarea value={after} onChange={(e) => setAfter(e.target.value)} className="input mt-1.5 min-h-[120px] resize-none border-teal-300" />
                <div className="mt-4 flex justify-between">
                  <button onClick={() => setPhase('draft')} className="btn-ghost">초안 다시 쓰기</button>
                  <div className="flex gap-2">
                    <Link to="/records?tab=beforeafter" className="btn-ghost">내 비포/애프터</Link>
                    <button onClick={save} disabled={after.trim().length < 5 || after.trim() === before.trim()} className="btn-teal"><Save size={16} /> 비포/애프터로 저장</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Callout tone="warn">
            <span className="flex items-center gap-1.5 font-bold"><Ban size={14} /> 대필 금지</span>
            AI는 문장을 대신 만들어 주지 않습니다. 코칭 포인트는 "무엇이 빠졌는가"만 알려 줍니다. 그 빈칸을 채우는 것은 리더의 일입니다.
          </Callout>
        </section>

        <aside className="col-span-2 space-y-4">
          <div className="card p-6">
            <p className="font-bold text-navy-800">코칭 포인트 3가지</p>
            <p className="mt-1 text-xs text-slate-500">입력할 때마다 규칙으로 다시 점검합니다.</p>
            <div className="mt-4 space-y-3">
              {coachingPointLabels.map((p) => {
                const b = beforeCheck[p.key]
                const a = afterCheck[p.key]
                const showAfter = phase === 'revise'
                return (
                  <div key={p.key} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">{p.label}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className={`flex items-center gap-1 ${b ? 'text-teal-600' : 'text-slate-400'}`}>{b ? <CheckCircle2 size={14} /> : <Circle size={14} />} Before</span>
                        {showAfter && <span className={`flex items-center gap-1 ${a ? 'text-teal-600' : 'text-safety-600'}`}>{a ? <CheckCircle2 size={14} /> : <Circle size={14} />} After</span>}
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{p.hint}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <span className="text-slate-600">충족 개수</span>
              <span className="font-bold text-navy-800">
                Before {score(beforeCheck)}/3 {phase === 'revise' && <>→ <span className={score(afterCheck) > score(beforeCheck) ? 'text-teal-600' : ''}>After {score(afterCheck)}/3</span></>}
              </span>
            </div>
          </div>
          <div className="card p-6 text-sm text-slate-600">
            <p className="font-bold text-navy-800">목표</p>
            <p className="mt-1 leading-relaxed">언제나 부드럽게 말하는 것이 아니라, <b>존중하면서 기준을 분명히</b> 전달하는 것입니다.</p>
          </div>
        </aside>
      </div>
      <Toast message={toast} />
    </div>
  )
}
