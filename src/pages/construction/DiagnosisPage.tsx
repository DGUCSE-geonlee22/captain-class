import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, Save } from 'lucide-react'
import { AiNotice, Callout, PageHeader, ProgressBar, Toast } from '../../components/ui'
import { diagnosisItems, scoreDiagnosis, tendencyLabel, type Tendency } from '../../data/construction'
import { axisMeta } from '../../data/courses'
import { useApp } from '../../context/AppContext'

export default function DiagnosisPage() {
  const { state, saveDiagnosis, completeLesson } = useApp()
  const [answers, setAnswers] = useState<Record<string, Tendency>>(state.diagnosis?.answers ?? {})
  const [toast, setToast] = useState<string | null>(null)
  const done = diagnosisItems.every((i) => answers[i.id])
  const result = useMemo(() => (done ? scoreDiagnosis(answers) : null), [answers, done])

  const save = () => {
    if (!result) return
    saveDiagnosis({ answers, empathy: result.empathy, leadership: result.leadership, tendency: result.tendency, recommendedAxis: result.recommendedAxis })
    completeLesson('cn-a')
    setToast('사전 진단 점수를 저장했습니다 (+20 M)')
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <div>
      <PageHeader
        en="Self Diagnosis"
        backTo="/course/construction"
        backLabel="Construction 코스"
        eyebrow={<span className="badge bg-safety-50 text-safety-700">0주차 · 프로그램 1</span>}
        title="공감 / 리더십 2축 자기진단"
        description="평소 업무를 지시하거나 문제를 지적할 때 과도한 통제형(권위적)인지, 무조건적 회피형(착한 리더)인지 진단합니다. 건설 현장의 상황(안전 규정 위반, 공정 지연 등)에서 감정적 대응과 원칙적 대응 사이의 성향을 점수로 내고, 12주 동안 어느 축을 집중 보완할지 안내합니다."
        right={<AiNotice />}
      />
      <div className="grid grid-cols-5 gap-6">
        <section className="col-span-3 space-y-3">
          {diagnosisItems.map((it, idx) => (
            <div key={it.id} className="card p-5">
              <p className="text-xs font-semibold text-slate-500">상황 {idx + 1}</p>
              <p className="mt-1 font-semibold text-navy-800">{it.situation}</p>
              <div className="mt-3 space-y-2">
                {it.options.map((o) => (
                  <button key={o.text} onClick={() => setAnswers({ ...answers, [it.id]: o.tendency })} className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${answers[it.id] === o.tendency ? 'border-safety-400 bg-safety-50 text-navy-800' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                    {o.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
        <aside className="col-span-2 space-y-4">
          <div className="card sticky top-[96px] p-6">
            <p className="flex items-center gap-2 font-bold text-navy-800"><ClipboardCheck size={16} className="text-safety-500" /> 진단 결과</p>
            <p className="mt-1 text-xs text-slate-500">{Object.keys(answers).length} / {diagnosisItems.length} 응답</p>
            {result ? (
              <>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-sm"><span className="font-semibold text-teal-700">공감 축</span><b>{result.empathy}</b></div>
                    <ProgressBar value={result.empathy} color={axisMeta.compassion.color} />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm"><span className="font-semibold text-navy-700">리더십 축</span><b>{result.leadership}</b></div>
                    <ProgressBar value={result.leadership} color={axisMeta.leadership.color} />
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-navy-800">{tendencyLabel[result.tendency].label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{tendencyLabel[result.tendency].desc}</p>
                  <p className="mt-2 text-[11px] text-slate-500">통제형 {result.counts.control} · 회피형 {result.counts.avoid} · 균형형 {result.counts.balanced}</p>
                </div>
                <div className="mt-3 rounded-xl border border-safety-200 bg-safety-50 px-4 py-3 text-sm text-safety-700">
                  <b>12주 집중 보완 축 · </b>{result.recommendedAxis === 'both' ? '두 축 고르게' : result.recommendedAxis === 'compassion' ? '공감 축 (Compassion, Collab+Comm)' : '리더십 축 (Charisma+Character, Coaching)'}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <button onClick={save} className="btn-orange"><Save size={16} /> 사전 진단 점수 저장</button>
                  {state.diagnosis && <Link to="/course/construction/dilemma" className="btn-ghost">다음: 딜레마 시나리오 진단 <ArrowRight size={14} /></Link>}
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-500">8개 상황에 모두 답하면 점수와 성향이 계산됩니다.</p>
            )}
          </div>
          <Callout tone="info">이 점수는 12주 동안 본인의 변화를 추적하는 기준 데이터가 됩니다. '내 기록 → 2축 진단'에서 현재 점수와 비교합니다.</Callout>
        </aside>
      </div>
      <Toast message={toast} />
    </div>
  )
}
