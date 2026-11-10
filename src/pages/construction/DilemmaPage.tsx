import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Save } from 'lucide-react'
import { Callout, PageHeader, PrivacyWarning, Toast } from '../../components/ui'
import { dilemmaScenarios } from '../../data/construction'
import { courseById } from '../../data/courses'
import { useApp } from '../../context/AppContext'

export default function DilemmaPage() {
  const { state, saveDilemma, completeLesson } = useApp()
  const [picked, setPicked] = useState(state.dilemma?.scenarioId ?? '')
  const [response, setResponse] = useState(state.dilemma?.response ?? '')
  const [toast, setToast] = useState<string | null>(null)
  const sc = dilemmaScenarios.find((d) => d.id === picked)

  const save = () => {
    saveDilemma({ scenarioId: picked, response })
    completeLesson('cn-b')
    setToast('딜레마 진단을 저장했습니다 (+10 M)')
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <div>
      <PageHeader
        en="Dilemma Check"
        backTo="/course/construction"
        backLabel="Construction 코스"
        eyebrow={<span className="badge bg-safety-50 text-safety-700">0주차 · 프로그램 2</span>}
        title="현장 딜레마 시나리오 선택형 진단"
        description="신임 리더가 현장에서 실제로 직면할 수 있는 3가지 대표 딜레마 중 본인 파트 상황에 가장 가까운 항목을 고르고, 지금 시점의 초기 대응 방안을 적습니다. 12주 뒤 같은 상황을 다시 보며 변화를 확인합니다."
      />
      <div className="grid grid-cols-3 gap-4">
        {dilemmaScenarios.map((d) => (
          <button key={d.id} onClick={() => setPicked(d.id)} className={`card p-5 text-left transition ${picked === d.id ? 'border-safety-400 ring-2 ring-safety-100' : 'hover:border-slate-300'}`}>
            <span className="badge bg-safety-50 text-safety-700">{d.type}</span>
            <p className="mt-2 font-bold text-navy-800">{d.title}</p>
            <p className="mt-2 text-sm text-slate-600">{d.situation}</p>
            <p className="mt-3 text-[11px] text-slate-400">연결 코스 · {courseById(d.linkedCourse)?.name}</p>
          </button>
        ))}
      </div>
      {sc && (
        <div className="card mt-6 p-6">
          <p className="font-bold text-navy-800">지금의 나라면 — 초기 대응 방안</p>
          <p className="mt-1 text-xs text-slate-500">정답을 찾는 게 아닙니다. 교육 전 내 첫 반응을 그대로 남겨 두는 것이 목적입니다.</p>
          <textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="예: 일단 작업을 멈추게 하고 본사에는 나중에 설명한다…" className="input mt-3 min-h-[120px] resize-none" />
          <PrivacyWarning />
          <div className="mt-4 flex items-center justify-between">
            <Link to={`/course/${sc.linkedCourse}`} className="text-xs font-semibold text-navy-600">이 딜레마를 다루는 코스 보기 <ArrowRight size={12} className="inline" /></Link>
            <div className="flex gap-2">
              <button onClick={save} disabled={response.trim().length < 10} className="btn-orange"><Save size={16} /> 진단 저장</button>
              {state.dilemma && <Link to="/course/construction/field-mission" className="btn-ghost">다음: 현장 실천 미션 <ArrowRight size={14} /></Link>}
            </div>
          </div>
        </div>
      )}
      <div className="mt-6"><Callout tone="info">선택한 딜레마는 P난처의 유사 사례, 대화 연습실 시나리오와 이어집니다. 12주차 수료 때 같은 시나리오에 다시 답해 사전·사후를 비교합니다.</Callout></div>
      <Toast message={toast} />
    </div>
  )
}
