import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AudioLines, CheckCircle2, Circle, Handshake, MessageCircleHeart, Save, ShieldCheck, Thermometer, Timer, Users } from 'lucide-react'
import { AiNotice, Callout, PageHeader, PrivacyWarning, Tabs, Toast } from '../components/ui'
import { agreementExamples, bridgeProfiles, grievances, interviewQuestions } from '../data/bridge'
import { coachingCheck, coachingPointLabels } from '../lib/mockAI'
import { useApp } from '../context/AppContext'

type Tab = 'received' | 'consult' | 'matching'
const tabList: { id: Tab; label: string }[] = [
  { id: 'received', label: '받은 고충' },
  { id: 'consult', label: '상담 체험' },
  { id: 'matching', label: '브릿지 매칭' },
]

export default function BridgePage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab') as Tab | null
  const tab: Tab = raw && tabList.some((t) => t.id === raw) ? raw : 'received'

  return (
    <div>
      <PageHeader
        en="Anonymous Bridge"
        eyebrow={<span className="badge bg-safety-50 text-safety-700">핵심 기능 3</span>}
        title="익명 브릿지"
        description="타 파트·타 부서 구성원과 작업자의 고충이 익명으로 도착합니다. 들어 보고, 답해 보고, 타 부서 리더와 연결됩니다."
        right={<AiNotice />}
      />
      <Callout tone="info">
        <span className="flex items-center gap-1.5 font-bold"><ShieldCheck size={14} /> 익명성 원칙</span>
        제보자와 상담자는 서로 식별되지 않습니다. 텍스트 고충은 AI가 말투를 가공하고, 음성 제보는 텍스트 변환과 톤 변조를 거칩니다. 실명·소속·개인 식별 정보 입력은 경고됩니다.
      </Callout>
      <div className="mt-6">
        <Tabs tabs={tabList} value={tab} onChange={(t) => setParams({ tab: t })} />
      </div>
      {tab === 'received' && <Received />}
      {tab === 'consult' && <Consult />}
      {tab === 'matching' && <Matching />}
    </div>
  )
}

function SourceBadge({ source }: { source: 'text' | 'voice' }) {
  return source === 'voice' ? (
    <span className="badge bg-navy-50 text-navy-700"><AudioLines size={11} /> 음성→텍스트 · 톤 변조</span>
  ) : (
    <span className="badge bg-teal-50 text-teal-700">AI 말투 가공 완료</span>
  )
}

function Received() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {grievances.map((g) => (
        <div key={g.id} className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{g.from} · {g.dept}</span>
            <SourceBadge source={g.source} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-800">"{g.content}"</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{g.receivedAt}</span>
            {g.envData && (
              <span className="flex gap-2">
                <span className="badge bg-slate-50"><Thermometer size={11} /> {g.envData.temp}°</span>
                <span className="badge bg-slate-50"><Timer size={11} /> {g.envData.hours}h</span>
                <span className="badge bg-slate-50">{g.envData.zone}</span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function Consult() {
  const { state, addConsultAnswer, completeLesson } = useApp()
  const others = useMemo(() => grievances.filter((g) => !g.dept.startsWith('A파트')), [])
  const [picked, setPicked] = useState(others[0].id)
  const g = others.find((x) => x.id === picked)!
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState<ReturnType<typeof coachingCheck> | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const nameWarn = /(님|씨)\s*$|[가-힣]{2,3}\s?(과장|대리|차장|부장|반장|주임)/.test(answer) && answer.length < 40

  const submit = () => {
    const check = coachingCheck(answer)
    setSubmitted(check)
    addConsultAnswer({ grievanceId: g.id, answer })
    completeLesson('cp-c')
    setToast('답변을 제출했습니다 (+15 M)')
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <div className="grid grid-cols-5 gap-6">
      <aside className="col-span-2 space-y-2">
        <p className="label mb-2">본인 파트(A파트)가 아닌 고충</p>
        {others.map((o) => (
          <button key={o.id} onClick={() => { setPicked(o.id); setAnswer(''); setSubmitted(null) }} className={`w-full rounded-xl border p-3 text-left transition ${o.id === picked ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <div className="flex items-center justify-between text-[11px] text-slate-500"><span>{o.dept}</span><SourceBadge source={o.source} /></div>
            <p className="mt-1.5 line-clamp-2 text-xs text-slate-700">{o.content}</p>
            {state.consultAnswers.some((a) => a.grievanceId === o.id) && <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600"><CheckCircle2 size={11} /> 답변함</span>}
          </button>
        ))}
      </aside>
      <section className="col-span-3 space-y-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{g.from} · {g.dept} · {g.receivedAt}</span>
            <SourceBadge source={g.source} />
          </div>
          <p className="mt-3 text-base leading-relaxed text-slate-800">"{g.content}"</p>
        </div>
        <div className="card p-6">
          <p className="flex items-center gap-2 font-bold text-navy-800"><MessageCircleHeart size={16} className="text-teal-500" /> 캡틴의 답변</p>
          <p className="mt-1 text-xs text-slate-500">이 사람의 리더가 아니라, 같은 회사의 다른 리더로서 답합니다. 제출하면 코칭 포인트 3가지를 점검합니다.</p>
          <textarea value={answer} onChange={(e) => { setAnswer(e.target.value); setSubmitted(null) }} placeholder="노력을 인정하고, 문제를 구체적으로 짚고, 개선 방향을 함께 적어 보세요." className="input mt-3 min-h-[130px] resize-none" />
          <PrivacyWarning text="실명·소속·개인 식별 정보를 쓰지 마세요. 제보자도 당신도 익명입니다." />
          {nameWarn && <p className="mt-1 text-xs font-semibold text-red-600">특정인을 가리키는 표현으로 보입니다. 익명성을 지켜 주세요.</p>}
          <div className="mt-4 flex justify-end">
            <button onClick={submit} disabled={answer.trim().length < 10} className="btn-teal"><Save size={16} /> 답변 제출</button>
          </div>
        </div>
        {submitted && (
          <div className="card border-teal-200 p-6">
            <p className="font-bold text-navy-800">코칭 포인트 점검</p>
            <ul className="mt-3 space-y-2">
              {coachingPointLabels.map((p) => (
                <li key={p.key} className="flex items-start gap-2 text-sm">
                  {submitted[p.key] ? <CheckCircle2 size={16} className="mt-0.5 text-teal-600" /> : <Circle size={16} className="mt-0.5 text-slate-300" />}
                  <div>
                    <p className={submitted[p.key] ? 'text-slate-800' : 'text-slate-500'}>{p.label}</p>
                    {!submitted[p.key] && <p className="text-xs text-slate-400">{p.hint}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/course/collab-comm/coaching" className="btn-ghost mt-4">반려문·지적 코칭 레슨에서 더 연습하기</Link>
          </div>
        )}
      </section>
      <Toast message={toast} />
    </div>
  )
}

function Matching() {
  const { state, addAgreement, completeLesson } = useApp()
  const [profileId, setProfileId] = useState(bridgeProfiles[0].id)
  const p = bridgeProfiles.find((x) => x.id === profileId)!
  const [task, setTask] = useState('')
  const [check, setCheck] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const save = () => {
    addAgreement({ profileId: p.id, profileName: p.name, dept: p.dept, task, checkMethod: check })
    completeLesson('cc-f')
    setToast('협업 합의서를 저장했습니다 (+40 M)')
    setTimeout(() => setToast(null), 2200)
    setTask('')
    setCheck('')
  }

  return (
    <div className="space-y-6">
      <Callout tone="teal">Link 단계(10~12주) 미션: 타 부서 리더와 15분 대화 후 공동 과제 1개 합의. 프로필을 고르고 교환 인터뷰 질문지로 대화한 뒤 합의서를 씁니다.</Callout>
      <div className="grid grid-cols-3 gap-4">
        {bridgeProfiles.map((bp) => (
          <button key={bp.id} onClick={() => setProfileId(bp.id)} className={`card p-5 text-left transition ${bp.id === profileId ? 'border-teal-400 ring-2 ring-teal-100' : 'hover:border-slate-300'}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white">{bp.name.slice(0, 1)}</span>
            <p className="mt-3 font-bold text-navy-800">{bp.name}</p>
            <p className="text-xs text-slate-500">{bp.dept} · {bp.role}</p>
            <p className="mt-2 text-sm text-slate-700">{bp.intro}</p>
            <div className="mt-3 flex flex-wrap gap-1">{bp.interests.map((i) => <span key={i} className="badge bg-slate-100 text-slate-600">{i}</span>)}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <p className="flex items-center gap-2 font-bold text-navy-800"><Users size={16} className="text-navy-500" /> 15분 교환 인터뷰 질문지</p>
          <ol className="mt-4 space-y-3">
            {interviewQuestions.map((q, i) => (
              <li key={q} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-bold text-navy-700">{i + 1}</span>
                {q}
              </li>
            ))}
          </ol>
        </div>
        <div className="card p-6">
          <p className="flex items-center gap-2 font-bold text-navy-800"><Handshake size={16} className="text-teal-500" /> 협업 합의서</p>
          <p className="mt-1 text-xs text-slate-500">상대: {p.name} ({p.dept})</p>
          <label className="label mt-4 block">공동 과제 1개</label>
          <input value={task} onChange={(e) => setTask(e.target.value)} placeholder={`예: ${agreementExamples[0]}`} className="input mt-1" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {agreementExamples.map((ex) => <button key={ex} onClick={() => setTask(ex)} className="badge border border-slate-200 bg-white text-slate-600 hover:border-slate-300">{ex}</button>)}
          </div>
          <label className="label mt-4 block">확인 방법·시점</label>
          <input value={check} onChange={(e) => setCheck(e.target.value)} placeholder="예: 다음 달 첫 주 공문 건수와 현장 확인 기록 대조" className="input mt-1" />
          <div className="mt-5 flex items-center justify-between">
            <Link to="/records?tab=agreement" className="text-xs font-semibold text-teal-600">내 합의서 {state.agreements.length}건</Link>
            <button onClick={save} disabled={task.trim().length < 3} className="btn-teal"><Save size={16} /> 합의서 저장</button>
          </div>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  )
}
