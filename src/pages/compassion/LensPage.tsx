import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserCog, Users, ArrowRight } from 'lucide-react'
import { AiNotice, Callout, PageHeader, PrivacyWarning } from '../../components/ui'
import { lensPresets } from '../../data/lensPresets'
import { matchLens } from '../../lib/mockAI'
import { useApp } from '../../context/AppContext'
import type { LensPreset } from '../../data/types'

export default function LensPage() {
  const { completeLesson } = useApp()
  const [text, setText] = useState('')
  const [preset, setPreset] = useState<LensPreset | null>(null)
  const [noMatch, setNoMatch] = useState(false)

  const choose = (p: LensPreset) => {
    setPreset(p)
    setNoMatch(false)
    completeLesson('cp-b')
  }
  const analyze = () => {
    const m = matchLens(text)
    if (m) choose(m)
    else {
      setPreset(null)
      setNoMatch(true)
    }
  }

  return (
    <div>
      <PageHeader
        en="Perspective Lens"
        backTo="/course/compassion"
        backLabel="Compassion 코스"
        eyebrow={<span className="badge bg-teal-50 text-teal-700">레슨 B</span>}
        title="관점 렌즈 — 한 상황을 여러 방향에서 보기"
        description="갈등 상황을 적거나 예시를 고르면 '리더 입장'과 '구성원 입장' 두 열에 탐색 질문이 뜹니다. AI는 감정을 진단하지 않고 질문만 던집니다."
        right={<AiNotice />}
      />

      <div className="card p-6">
        <label className="label">갈등 상황 입력</label>
        <div className="mt-1.5 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="예: 입사동기인 이강 대리에게 작업 지시를 해야 하는데 자꾸 미루게 됩니다"
            className="input"
          />
          <button onClick={analyze} disabled={text.trim().length < 3} className="btn-teal shrink-0"><Search size={16} /> 렌즈 열기</button>
        </div>
        <PrivacyWarning />
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-slate-500 self-center">예시 상황:</span>
          {lensPresets.map((p) => (
            <button key={p.id} onClick={() => choose(p)} className={`badge border px-3 py-1.5 transition ${preset?.id === p.id ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {noMatch && (
        <div className="mt-4">
          <Callout tone="warn">입력한 상황과 가까운 렌즈 프리셋을 찾지 못했습니다. 위 예시 중 가장 비슷한 상황을 고르거나, 키워드(안전모·지연·동기·신입·공문 등)를 포함해 다시 적어 보세요.</Callout>
        </div>
      )}

      {preset && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-navy-700 px-6 py-5 text-white">
            <p className="text-xs text-navy-200">선택된 상황</p>
            <p className="mt-1 text-lg font-bold">{preset.title}</p>
            <p className="mt-1 text-sm text-navy-100">{preset.situation}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <LensColumn icon={<UserCog size={18} />} title="리더 입장에서 살필 것" hint="품질·일정·안전 책임, 놓치고 있는 업무상 제약" color="navy" questions={preset.leaderQuestions} />
            <LensColumn icon={<Users size={18} />} title="구성원 입장에서 살필 것" hint="노력에 대한 인정, 업무 기준의 명확성" color="teal" questions={preset.memberQuestions} />
          </div>
          <div className="flex items-center justify-between">
            <Callout tone="info">AI의 질문은 정답이 아니라 관점을 넓히는 도구입니다. 상대의 감정을 확정하는 문장은 이 화면에 없습니다.</Callout>
            <Link to={`/pnancheo?q=${encodeURIComponent(preset.title)}`} className="btn-primary ml-4 shrink-0">이 상황의 유사 사례 보기 <ArrowRight size={16} /></Link>
          </div>
        </div>
      )}
    </div>
  )
}

function LensColumn({ icon, title, hint, color, questions }: { icon: React.ReactNode; title: string; hint: string; color: 'navy' | 'teal'; questions: string[] }) {
  const head = color === 'navy' ? 'bg-navy-50 text-navy-700' : 'bg-teal-50 text-teal-700'
  const dot = color === 'navy' ? 'bg-navy-700' : 'bg-teal-500'
  return (
    <div className="card overflow-hidden">
      <div className={`flex items-center gap-2 px-5 py-3 ${head}`}>
        {icon}
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="text-[11px] opacity-80">{hint}</p>
        </div>
      </div>
      <ul className="space-y-3 p-5">
        {questions.map((q, i) => (
          <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
            {q}
          </li>
        ))}
      </ul>
    </div>
  )
}
