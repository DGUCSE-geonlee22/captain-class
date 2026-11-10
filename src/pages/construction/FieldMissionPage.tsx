import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Footprints, Save } from 'lucide-react'
import { Callout, PageHeader, PrivacyWarning, Toast } from '../../components/ui'
import { fieldMission } from '../../data/construction'
import { useApp } from '../../context/AppContext'

export default function FieldMissionPage() {
  const { state, saveFieldReport, completeLesson } = useApp()
  const [counterpart, setCounterpart] = useState(state.fieldReport?.counterpart ?? fieldMission.counterparts[0])
  const [reaction, setReaction] = useState(state.fieldReport?.reaction ?? '')
  const [insight, setInsight] = useState(state.fieldReport?.insight ?? '')
  const [toast, setToast] = useState<string | null>(null)

  const save = () => {
    saveFieldReport({ counterpart, reaction, insight })
    completeLesson('cn-b')
    setToast('현장 대면 소통 리포트를 저장했습니다 (+20 M) · 0주차 미션 완료')
    setTimeout(() => setToast(null), 2600)
  }

  return (
    <div>
      <PageHeader
        en="Field Mission"
        backTo="/course/construction"
        backLabel="Construction 코스"
        eyebrow={<span className="badge bg-safety-50 text-safety-700">0주차 · 레슨 B</span>}
        title="현장 실천 미션 — 작업자 1명에게 첫 마디 건네기"
        description={fieldMission.intent}
      />
      <div className="grid grid-cols-5 gap-6">
        <section className="col-span-3 card p-6">
          <div className="rounded-2xl bg-safety-500 px-6 py-5 text-white">
            <p className="text-xs text-white/80">교육 시작 전, 직접 현장에 나가 이렇게 물어 보세요</p>
            <p className="mt-1 text-lg font-bold">"{fieldMission.question}"</p>
          </div>
          <label className="label mt-5 block">누구에게 물었나요</label>
          <div className="mt-1.5 flex gap-2">
            {fieldMission.counterparts.map((c) => (
              <button key={c} onClick={() => setCounterpart(c)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${counterpart === c ? 'border-safety-400 bg-safety-50 text-safety-700' : 'border-slate-200 text-slate-600'}`}>{c}</button>
            ))}
          </div>
          <label className="label mt-4 block">작업자의 반응 · 들은 애로사항 (그대로)</label>
          <textarea value={reaction} onChange={(e) => setReaction(e.target.value)} placeholder="예: 오후엔 그늘이 하나도 없는데 쉬는 시간은 똑같다고 했다. 휴게소 비콘에 찍힐까 봐 참는다고도 했다." className="input mt-1.5 min-h-[120px] resize-none" />
          <PrivacyWarning text="작업자의 실명·소속은 적지 마세요. 내용만 기록합니다." />
          <label className="label mt-4 block">모니터 앞에서는 보이지 않던 것</label>
          <textarea value={insight} onChange={(e) => setInsight(e.target.value)} placeholder="예: 로그에는 '휴식 초과'로만 찍히던 것이 실제로는 그늘 부족 문제였다." className="input mt-1.5 min-h-[80px] resize-none" />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">산출물 · 현장 대면 소통 리포트</span>
            <div className="flex gap-2">
              <button onClick={save} disabled={reaction.trim().length < 10} className="btn-orange"><Save size={16} /> 리포트 저장</button>
              {state.fieldReport && <Link to="/course/compassion/reframing" className="btn-ghost">Reframing 모듈로 연계 <ArrowRight size={14} /></Link>}
            </div>
          </div>
        </section>
        <aside className="col-span-2 space-y-4">
          <div className="card p-6">
            <p className="flex items-center gap-2 font-bold text-navy-800"><Footprints size={16} className="text-safety-500" /> 왜 첫날부터 현장인가</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{fieldMission.intent}</p>
          </div>
          <Callout tone="teal">이 리포트는 Compassion 코스 '현장 공감형 Reframing 모듈'의 실제 분석 데이터로 곧바로 연계됩니다. 1주차 Read 단계에서 AI 로그와 이 기록을 나란히 놓고 다시 읽습니다.</Callout>
        </aside>
      </div>
      <Toast message={toast} />
    </div>
  )
}
