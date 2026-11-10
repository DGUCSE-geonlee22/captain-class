import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AudioLines, CheckCircle2, Circle, Cloud, CloudOff, Handshake, MessageCircleHeart, Save, Send, ShieldCheck, Thermometer, Timer, Users } from 'lucide-react'
import { AiNotice, Callout, PageHeader, PrivacyWarning, Tabs, Toast } from '../components/ui'
import { agreementExamples, bridgeProfiles, interviewQuestions } from '../data/bridge'
import { coachingCheck, coachingPointLabels, looksLikePersonalInfo } from '../lib/mockAI'
import { useApp } from '../context/AppContext'
import { useSharedGrievances } from '../lib/shared'
import { ApiError, type SharedGrievance } from '../lib/api'

type Tab = 'received' | 'send' | 'consult' | 'matching'
const tabList: { id: Tab; label: string }[] = [
  { id: 'received', label: '받은 고충' },
  { id: 'send', label: '고충 보내기' },
  { id: 'consult', label: '상담 체험' },
  { id: 'matching', label: '브릿지 매칭' },
]

export default function BridgePage() {
  const [params, setParams] = useSearchParams()
  const { auth } = useApp()
  const shared = useSharedGrievances()
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
        <span className="ml-2 inline-flex items-center gap-1 text-xs opacity-70">
          {shared.live ? <Cloud size={12} /> : <CloudOff size={12} />}
          {shared.live ? `서버 연결 · 다른 캡틴이 보낸 고충과 답변이 함께 보입니다 (${shared.grievances.length}건)` : auth.online ? '로그인하면 고충을 보내고 다른 캡틴의 답변을 볼 수 있습니다' : '로컬 모드 · 기본 고충만 보입니다'}
        </span>
      </Callout>
      <div className="mt-6">
        <Tabs tabs={tabList} value={tab} onChange={(t) => setParams({ tab: t })} />
      </div>
      {tab === 'received' && <Received items={shared.grievances} />}
      {tab === 'send' && <SendGrievance shared={shared} onSent={() => setParams({ tab: 'received' })} />}
      {tab === 'consult' && <Consult shared={shared} />}
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

function Received({ items }: { items: SharedGrievance[] }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((g) => (
        <div key={g.id} className={`card p-5 ${g.mine ? 'border-teal-200' : ''}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{g.from} · {g.dept} {g.mine && <span className="ml-1 badge bg-teal-50 text-teal-700">내가 보낸 고충</span>}</span>
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
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-500">익명 답변 <b className="text-navy-800">{g.answers.length}</b>건</span>
            <div className="flex gap-2">
              {g.answers.length > 0 && <button onClick={() => setOpen(open === g.id ? null : g.id)} className="text-xs font-semibold text-teal-600">{open === g.id ? '접기' : '답변 보기'}</button>}
              {!g.mine && <Link to="/bridge?tab=consult" className="text-xs font-semibold text-navy-700">답해 보기</Link>}
            </div>
          </div>
          {open === g.id && (
            <ul className="mt-3 space-y-2">
              {g.answers.map((a) => (
                <li key={a.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>익명 캡틴{a.mine ? ' (나)' : ''}</span>
                    {a.check && <span>{[a.check.acknowledged, a.check.specific, a.check.direction].filter(Boolean).length}/3 코칭 포인트</span>}
                  </div>
                  {a.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

function SendGrievance({ shared, onSent }: { shared: ReturnType<typeof useSharedGrievances>; onSent: () => void }) {
  const { auth } = useApp()
  const [content, setContent] = useState('')
  const [dept, setDept] = useState('')
  const [source, setSource] = useState<'text' | 'voice'>('text')
  const [toast, setToast] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const pii = looksLikePersonalInfo(content)
  const canSend = shared.live && content.trim().length >= 10 && !pii && !busy

  const send = async () => {
    setBusy(true)
    try {
      await shared.submit(content.trim(), dept.trim() || '소속 비공개', source)
      setContent('')
      setDept('')
      setToast('익명으로 전달되었습니다. 다른 캡틴·리더가 답하면 "받은 고충"에서 볼 수 있습니다.')
      setTimeout(() => { setToast(null); onSent() }, 1800)
    } catch (e) {
      setToast(e instanceof ApiError ? e.message : '전송에 실패했습니다.')
      setTimeout(() => setToast(null), 2400)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {!shared.live && <Callout tone="warn">{auth.online ? '고충을 보내려면 먼저 로그인하세요. 보낸 사람 정보는 다른 사용자에게 절대 노출되지 않습니다.' : '고충 보내기는 서버에 연결됐을 때만 동작합니다. 지금은 로컬 모드입니다.'}</Callout>}
      <div className="card p-6">
        <p className="flex items-center gap-2 font-bold text-navy-800"><Send size={16} className="text-teal-500" /> 익명으로 고충 보내기</p>
        <p className="mt-1 text-xs text-slate-500">누가 보냈는지는 저장되지만 아무에게도 표시되지 않습니다. 작업자의 음성 제보를 대신 올릴 때는 '음성 제보'를 고르세요.</p>
        <div className="mt-4 flex gap-2">
          {(['text', 'voice'] as const).map((s) => (
            <button key={s} onClick={() => setSource(s)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${source === s ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600'}`}>{s === 'text' ? '텍스트 (AI 말투 가공)' : '음성 제보 (톤 변조)'}</button>
          ))}
        </div>
        <label className="label mt-4 block">소속 (선택 · 파트·반 수준까지만)</label>
        <input value={dept} onChange={(e) => setDept(e.target.value)} placeholder="예: C파트 · 타설반 / 본사 공무팀" className="input mt-1" maxLength={30} />
        <label className="label mt-4 block">고충 내용</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="상황, 언제부터, 무엇이 가장 힘든지. 실명과 개인 사정은 빼고 적어 주세요." className="input mt-1 min-h-[130px] resize-none" />
        <PrivacyWarning text="실명·연락처·특정인을 가리키는 표현은 쓰지 마세요. 연락처가 감지되면 전송이 막힙니다." />
        {pii && <p className="mt-1 text-xs font-semibold text-red-600">연락처·이메일로 보이는 문자열이 있습니다.</p>}
        <div className="mt-4 flex justify-end">
          <button onClick={send} disabled={!canSend} className="btn-teal"><Send size={16} /> {busy ? '전송 중…' : '익명으로 보내기'}</button>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  )
}

function Consult({ shared }: { shared: ReturnType<typeof useSharedGrievances> }) {
  const { state, completeLesson, auth } = useApp()
  const others = useMemo(() => shared.grievances.filter((g) => !g.dept.startsWith('A파트') && !g.mine), [shared.grievances])
  const [picked, setPicked] = useState<string | null>(null)
  const g = others.find((x) => x.id === picked) ?? others[0]
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState<ReturnType<typeof coachingCheck> | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const nameWarn = /(님|씨)\s*$|[가-힣]{2,3}\s?(과장|대리|차장|부장|반장|주임)/.test(answer) && answer.length < 40
  const canSubmit = answer.trim().length >= 10 && (!auth.online || !!auth.user)

  const submit = async () => {
    if (!g) return
    try {
      const check = await shared.answer(g.id, answer, coachingCheck(answer))
      setSubmitted(check)
      completeLesson('cp-c')
      setToast(shared.live ? '답변이 익명으로 전달되었습니다 (+15 M)' : '답변을 제출했습니다 (+15 M)')
    } catch (e) {
      setToast(e instanceof ApiError ? e.message : '전송에 실패했습니다.')
    }
    setTimeout(() => setToast(null), 2400)
  }

  if (!g) return <div className="card p-8 text-center text-sm text-slate-500">아직 답할 고충이 없습니다. 다른 캡틴이 고충을 보내면 여기에 나타납니다.</div>

  return (
    <div className="grid grid-cols-5 gap-6">
      <aside className="col-span-2 space-y-2">
        <p className="label mb-2">본인 파트(A파트)가 아닌 고충</p>
        {others.map((o) => (
          <button key={o.id} onClick={() => { setPicked(o.id); setAnswer(''); setSubmitted(null) }} className={`w-full rounded-xl border p-3 text-left transition ${o.id === g.id ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <div className="flex items-center justify-between text-[11px] text-slate-500"><span>{o.dept}</span><SourceBadge source={o.source} /></div>
            <p className="mt-1.5 line-clamp-2 text-xs text-slate-700">{o.content}</p>
            <div className="mt-1.5 flex items-center gap-2 text-[11px]">
              {o.answers.length > 0 && <span className="text-slate-400">답변 {o.answers.length}</span>}
              {(o.answers.some((a) => a.mine) || state.consultAnswers.some((a) => a.grievanceId === o.id)) && <span className="inline-flex items-center gap-1 font-semibold text-teal-600"><CheckCircle2 size={11} /> 답변함</span>}
            </div>
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
          {g.answers.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="mb-2 text-xs font-semibold text-slate-500">먼저 답한 캡틴들 ({g.answers.length})</p>
              <ul className="space-y-2">{g.answers.map((a) => <li key={a.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{a.text}</li>)}</ul>
            </div>
          )}
        </div>
        <div className="card p-6">
          <p className="flex items-center gap-2 font-bold text-navy-800"><MessageCircleHeart size={16} className="text-teal-500" /> 캡틴의 답변</p>
          <p className="mt-1 text-xs text-slate-500">이 사람의 리더가 아니라, 같은 회사의 다른 리더로서 답합니다. 제출하면 코칭 포인트 3가지를 점검하고, 제보자에게 익명으로 전달됩니다.</p>
          <textarea value={answer} onChange={(e) => { setAnswer(e.target.value); setSubmitted(null) }} placeholder="노력을 인정하고, 문제를 구체적으로 짚고, 개선 방향을 함께 적어 보세요." className="input mt-3 min-h-[130px] resize-none" />
          <PrivacyWarning text="실명·소속·개인 식별 정보를 쓰지 마세요. 제보자도 당신도 익명입니다." />
          {nameWarn && <p className="mt-1 text-xs font-semibold text-red-600">특정인을 가리키는 표현으로 보입니다. 익명성을 지켜 주세요.</p>}
          {auth.online && !auth.user && <p className="mt-1 text-xs text-slate-500">서버에 전달하려면 로그인하세요.</p>}
          <div className="mt-4 flex justify-end">
            <button onClick={submit} disabled={!canSubmit} className="btn-teal"><Save size={16} /> 답변 제출</button>
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
      <Callout tone="teal">10주차 미션: 타 부서 리더와 15분 대화 후 함께 바꿀 작은 절차 1개 합의. 프로필을 고르고 교환 인터뷰 질문지로 대화한 뒤 합의서를 씁니다.</Callout>
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
