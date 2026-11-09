import { useState } from 'react'
import { AudioLines, CheckCircle2, HelpCircle, Thermometer, Timer, MapPin, Wrench } from 'lucide-react'
import { AiNotice, Callout, PageHeader, Toast } from '../../components/ui'
import { voiceReports } from '../../data/voice'
import { useApp } from '../../context/AppContext'

export default function VoicePage() {
  const { completeLesson } = useApp()
  const [chosen, setChosen] = useState<Record<string, { type: 'improve' | 'explore'; value: string }>>({})
  const [toast, setToast] = useState<string | null>(null)

  const choose = (id: string, type: 'improve' | 'explore', value: string) => {
    setChosen((c) => ({ ...c, [id]: { type, value } }))
    completeLesson('cc-e')
    setToast(type === 'improve' ? '환경 개선 조치로 기록했습니다' : '원인 탐색 질문을 선택했습니다')
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div>
      <PageHeader
        en="Field Voice"
        backTo="/course/collab-comm"
        backLabel="Collaboration+Communication 코스"
        eyebrow={<span className="badge bg-teal-50 text-teal-700">레슨 E</span>}
        title="현장 직통 보이스 — 익명 음성 제보"
        description="작업자 고충이 음성에서 텍스트로 바뀌어 도착합니다. 같은 구역의 환경 데이터를 옆에 함께 봅니다. 징계 버튼은 없습니다. 환경 개선 조치 또는 원인 탐색 질문 중에서 고릅니다."
        right={<AiNotice />}
      />
      <div className="space-y-5">
        {voiceReports.map((v) => {
          const sel = chosen[v.id]
          return (
            <div key={v.id} className="card grid grid-cols-5 gap-0 overflow-hidden">
              <div className="col-span-3 p-6">
                <div className="flex items-center gap-2">
                  <span className="badge bg-navy-50 text-navy-700"><AudioLines size={12} /> 음성→텍스트</span>
                  <span className="badge bg-teal-50 text-teal-700">노이즈 제거 완료</span>
                  <span className="badge bg-teal-50 text-teal-700">톤 변조 완료</span>
                  <span className="ml-auto text-xs text-slate-400">{v.receivedAt}</span>
                </div>
                <p className="mt-4 text-base leading-relaxed text-slate-800">"{v.content}"</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div>
                    <p className="label flex items-center gap-1"><Wrench size={12} /> 환경 개선 조치</p>
                    <div className="mt-1.5 space-y-1.5">
                      {v.improvementOptions.map((o) => (
                        <button key={o} onClick={() => choose(v.id, 'improve', o)} className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${sel?.value === o ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 hover:border-slate-300'}`}>
                          {sel?.value === o && <CheckCircle2 size={12} className="mr-1 inline" />}{o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="label flex items-center gap-1"><HelpCircle size={12} /> 원인 탐색 질문하기</p>
                    <div className="mt-1.5 space-y-1.5">
                      {v.explorationQuestions.map((q) => (
                        <button key={q} onClick={() => choose(v.id, 'explore', q)} className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${sel?.value === q ? 'border-navy-500 bg-navy-50 text-navy-800' : 'border-slate-200 hover:border-slate-300'}`}>
                          {sel?.value === q && <CheckCircle2 size={12} className="mr-1 inline" />}{q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 border-l border-slate-100 bg-slate-50/60 p-6">
                <p className="label">같은 구역 환경 데이터</p>
                <div className="mt-3 space-y-3">
                  <Env icon={<MapPin size={16} />} label="구역" value={v.zone} />
                  <Env icon={<Thermometer size={16} />} label="체감온도" value={`${v.temp}°C`} warn={v.temp >= 30} />
                  <Env icon={<Timer size={16} />} label="연속 작업 시간" value={`${v.hours}시간`} warn={v.hours >= 4} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6">
        <Callout tone="info">제보자는 식별되지 않습니다. 제보 내용으로 특정 작업자를 찾아내려는 시도는 익명 보장 원칙에 어긋납니다.</Callout>
      </div>
      <Toast message={toast} />
    </div>
  )
}

function Env({ icon, label, value, warn }: { icon: React.ReactNode; label: string; value: string; warn?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border bg-white p-3 ${warn ? 'border-safety-200' : 'border-slate-200'}`}>
      <span className={warn ? 'text-safety-600' : 'text-slate-400'}>{icon}</span>
      <div>
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className={`text-sm font-bold ${warn ? 'text-safety-700' : 'text-navy-800'}`}>{value}</p>
      </div>
    </div>
  )
}
