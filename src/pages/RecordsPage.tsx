import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeftRight, CheckCircle2, Circle, Compass, FileText, Handshake, MessageSquareText, Radio, Users } from 'lucide-react'
import { delegationChoices, delegationTasks, growthStepTypes } from '../data/coaching'
import { dilemmaScenarios, tendencyLabel } from '../data/construction'
import { EmptyState, PageHeader, Tabs } from '../components/ui'
import { formatDate, useApp } from '../context/AppContext'
import { axisMeta } from '../data/courses'

type Tab = 'diagnosis' | 'signal' | 'beforeafter' | 'practice' | 'interview' | 'agreement' | 'judgment' | 'coaching'
const tabs: { id: Tab; label: string }[] = [
  { id: 'diagnosis', label: '2축 진단' },
  { id: 'signal', label: '신호 노트' },
  { id: 'beforeafter', label: '비포/애프터' },
  { id: 'practice', label: '실천 Log' },
  { id: 'interview', label: '면담 준비 노트' },
  { id: 'agreement', label: '협업 합의서' },
  { id: 'judgment', label: '판단·위임 기준' },
  { id: 'coaching', label: '코칭·성취' },
]

/** 2축 사전 진단 점수 기본값 (0주차 진단을 하지 않았을 때의 목업) */
const defaultBaseline = { compassion: 38, leadership: 44 }

export default function RecordsPage() {
  const [params, setParams] = useSearchParams()
  const { state, progress, auth } = useApp()
  const raw = params.get('tab') as Tab | null
  const tab: Tab = raw && tabs.some((t) => t.id === raw) ? raw : 'diagnosis'

  const baseline = state.diagnosis ? { compassion: state.diagnosis.empathy, leadership: state.diagnosis.leadership } : defaultBaseline
  const counts: Record<Tab, number> = {
    diagnosis: 0,
    signal: state.signalNotes.length,
    beforeafter: state.beforeAfters.length,
    practice: state.practiceLogs.length,
    interview: state.interviewNotes.length,
    agreement: state.agreements.length,
    judgment: state.judgments.length + state.memberDelegations.length,
    coaching: state.coachingNotes.length + state.growthPlans.length,
  }

  return (
    <div>
      <PageHeader
        en="My Records"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">내 기록</span>}
        title="캡틴의 항해 일지"
        description={`훈련과 현장에서 남긴 기록이 쌓입니다. 사전 진단과 지금을 비교해 보세요. ${auth.user ? `(${auth.user.display} 계정에 서버 저장 중 · 다른 기기에서 로그인해도 이어집니다)` : auth.online ? "(로그인하면 기록이 서버에 저장됩니다)" : "(로컬 모드 · 이 브라우저에만 저장)"}`}
        right={<Link to="/completion" className="btn-ghost">수료·리워드 보기</Link>}
      />
      <Tabs tabs={tabs.map((t) => ({ id: t.id, label: counts[t.id] ? `${t.label} ${counts[t.id]}` : t.label }))} value={tab} onChange={(t) => setParams({ tab: t })} />

      {tab === 'diagnosis' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="card col-span-2 p-7">
            <p className="font-bold text-navy-800">2축 진단 비교 · 사전(0주차) vs 현재({state.demoWeek}주차)</p>
            <p className="mt-1 text-xs text-slate-500">{state.diagnosis ? `사전 점수는 0주차 자기진단 결과(${tendencyLabel[state.diagnosis.tendency].label})이며,` : '사전 점수는 기본값(0주차 자기진단 미실시)이며,'} 현재 점수는 주차 진행과 활동 기록으로 계산됩니다.</p>
            <div className="mt-8 space-y-8">
              <CompareBar label="공감 축" before={baseline.compassion} after={progress.compassion} color={axisMeta.compassion.color} />
              <CompareBar label="리더십 축" before={baseline.leadership} after={progress.leadership} color={axisMeta.leadership.color} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-6">
              <p className="label">0주차 Construction</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li className="flex items-center gap-1.5">{state.diagnosis ? <CheckCircle2 size={15} className="text-teal-600" /> : <Circle size={15} className="text-slate-300" />} 2축 자기진단</li>
                <li className="flex items-center gap-1.5">{state.dilemma ? <CheckCircle2 size={15} className="text-teal-600" /> : <Circle size={15} className="text-slate-300" />} 딜레마 시나리오 {state.dilemma && <span className="text-xs text-slate-500">· {dilemmaScenarios.find((d) => d.id === state.dilemma!.scenarioId)?.title}</span>}</li>
                <li className="flex items-center gap-1.5">{state.fieldReport ? <CheckCircle2 size={15} className="text-teal-600" /> : <Circle size={15} className="text-slate-300" />} 현장 대면 소통 리포트</li>
              </ul>
              {state.fieldReport && <p className="mt-3 rounded-xl bg-safety-50 p-3 text-xs text-slate-700"><b>{state.fieldReport.counterpart}</b> · "{state.fieldReport.reaction}"</p>}
              {!state.diagnosis && <Link to="/course/construction/diagnosis" className="btn-ghost mt-3 w-full">0주차 진단 시작</Link>}
            </div>
            <div className="card p-6">
              <p className="label">기록 합계</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                <li className="flex justify-between"><span>신호 노트</span><b>{counts.signal}</b></li>
                <li className="flex justify-between"><span>비포/애프터</span><b>{counts.beforeafter}</b></li>
                <li className="flex justify-between"><span>실천 Log</span><b>{counts.practice}</b></li>
                <li className="flex justify-between"><span>면담 준비 노트</span><b>{counts.interview}</b></li>
                <li className="flex justify-between"><span>협업 합의서</span><b>{counts.agreement}</b></li>
                <li className="flex justify-between"><span>대화 연습 완주</span><b>{state.practiceResults.length}</b></li>
                <li className="flex justify-between"><span>리더 AI 판단 기록</span><b>{state.judgments.length}</b></li>
                <li className="flex justify-between"><span>코칭 노트 · 성취 기록</span><b>{state.coachingNotes.length} · {state.growthPlans.length}</b></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === 'signal' &&
        (state.signalNotes.length === 0 ? (
          <EmptyState icon={<Radio size={36} />} title="아직 신호 노트가 없습니다" desc="Compassion 레슨 A에서 AI 로그를 다시 읽고 대응 방향을 적으면 여기에 쌓입니다." action={<Link to="/course/compassion/reframing" className="btn-teal">Reframing 훈련으로</Link>} />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {state.signalNotes.map((n) => (
              <div key={n.id} className="card p-5">
                <p className="font-mono text-[11px] text-slate-400">{n.rawLog}</p>
                <p className="mt-2 text-sm text-slate-600">{n.reframed}</p>
                <div className="mt-3 rounded-xl bg-teal-50 p-3 text-sm text-slate-800"><span className="font-semibold text-teal-700">대응 방향 · </span>{n.response}</div>
                <p className="mt-2 text-right text-[11px] text-slate-400">{formatDate(n.createdAt)}</p>
              </div>
            ))}
          </div>
        ))}

      {tab === 'beforeafter' &&
        (state.beforeAfters.length === 0 ? (
          <EmptyState icon={<ArrowLeftRight size={36} />} title="비포/애프터 기록이 없습니다" desc="반려문·지적 코칭 레슨에서 초안을 직접 고쳐 저장하면 나란히 기록됩니다." action={<Link to="/course/collab-comm/coaching" className="btn-teal">코칭 레슨으로</Link>} />
        ) : (
          <div className="space-y-4">
            {state.beforeAfters.map((b) => (
              <div key={b.id} className="card p-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-navy-800">{b.context}</span>
                  <span>{formatDate(b.createdAt)}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4 text-sm"><p className="label mb-1">Before</p>{b.before}</div>
                  <div className="rounded-xl bg-teal-50 p-4 text-sm"><p className="label mb-1 text-teal-700">After</p>{b.after}</div>
                </div>
                <div className="mt-3 flex gap-3 text-xs">
                  <Chk ok={b.check.acknowledged} label="노력 인정" /><Chk ok={b.check.specific} label="구체적 설명" /><Chk ok={b.check.direction} label="개선 방향" />
                </div>
              </div>
            ))}
          </div>
        ))}

      {tab === 'practice' &&
        (state.practiceLogs.length === 0 ? (
          <EmptyState icon={<MessageSquareText size={36} />} title="실천 Log가 없습니다" desc="대화 연습실 시나리오를 완주한 뒤 '실제 면담·TBM 후 기록하기'로 남기면 여기에 쌓입니다." action={<Link to="/practice" className="btn-teal">대화 연습실로</Link>} />
        ) : (
          <div className="space-y-4">
            {state.practiceLogs.map((p) => (
              <div key={p.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-navy-800">{p.scenarioTitle}</p>
                  <span className="text-xs text-slate-500">{formatDate(p.createdAt)}</span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3 text-sm">
                  <Cell label="대화 목적" value={p.purpose} /><Cell label="사용한 표현" value={p.expression} /><Cell label="상대 반응" value={p.reaction} /><Cell label="다음에 바꿀 점" value={p.nextChange} />
                </div>
                {p.scores && (
                  <div className="mt-3 flex gap-2 text-[11px]">
                    <span className="badge bg-teal-50 text-teal-700">공감도 {p.scores.empathy}</span>
                    <span className="badge bg-navy-50 text-navy-700">명확성 {p.scores.clarity}</span>
                    <span className="badge bg-safety-50 text-safety-700">심리적 안전감 {p.scores.safety}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

      {tab === 'interview' &&
        (state.interviewNotes.length === 0 ? (
          <EmptyState icon={<Users size={36} />} title="면담 준비 노트가 없습니다" desc="1:1 펄스 면담 질문 카드에서 팀원을 고르고 카드를 저장하면 여기에 쌓입니다." action={<Link to="/course/collab-comm/pulse" className="btn-teal">질문 카드로</Link>} />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {state.interviewNotes.map((n) => (
              <div key={n.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-navy-800">{n.memberName}</p>
                  <span className="text-xs text-slate-500">{formatDate(n.createdAt)}</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-700">{n.cards.map((c) => <li key={c}>" {c}</li>)}</ul>
                {n.memo && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">메모 · {n.memo}</p>}
              </div>
            ))}
          </div>
        ))}

      {tab === 'agreement' &&
        (state.agreements.length === 0 ? (
          <EmptyState icon={<Handshake size={36} />} title="협업 합의서가 없습니다" desc="익명 브릿지의 브릿지 매칭에서 타 부서 리더와 공동 과제를 합의하면 여기에 쌓입니다." action={<Link to="/bridge?tab=matching" className="btn-teal">브릿지 매칭으로</Link>} />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {state.agreements.map((a) => (
              <div key={a.id} className="card p-5">
                <div className="flex items-center gap-2 text-xs text-slate-500"><FileText size={13} /> {a.profileName} · {a.dept} · {formatDate(a.createdAt)}</div>
                <p className="mt-3 text-base font-bold text-navy-800">{a.task}</p>
                {a.checkMethod && <p className="mt-1 text-sm text-slate-600">확인 방법 · {a.checkMethod}</p>}
              </div>
            ))}
          </div>
        ))}

      {tab === 'judgment' && (
        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-bold text-navy-800">팀원 판단 위임 기준표 {state.memberDelegations.length}건</p>
              <Link to="/course/coaching/delegation" className="text-xs font-semibold text-navy-600">새로 작성</Link>
            </div>
            {state.memberDelegations.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">아직 없습니다. Coaching 레슨 B에서 팀원과 함께 작성합니다.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {state.memberDelegations.map((d) => (
                  <div key={d.id} className="rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center justify-between text-xs text-slate-500"><span className="font-semibold text-navy-800">{d.memberName}</span><span>{formatDate(d.createdAt)}</span></div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      {delegationChoices.map((c) => (
                        <div key={c.id} className="rounded-lg bg-slate-50 p-2">
                          <p className="font-semibold text-slate-700">{c.label}</p>
                          <ul className="mt-1 space-y-0.5 text-slate-600">{delegationTasks.filter((t) => d.tasks[t.id] === c.id).map((t) => <li key={t.id}>· {t.task}</li>)}</ul>
                        </div>
                      ))}
                    </div>
                    {d.leaderNote && <p className="mt-2 text-xs text-navy-700"><b>리더 보완 · </b>{d.leaderNote}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          {state.judgments.length === 0 ? (
            <EmptyState icon={<Compass size={36} />} title="리더 AI 판단 기록이 없습니다" desc="질문형 리더 AI에서 안내자의 질문에 답하며 방향을 정하고 저장하면 여기에 쌓입니다." action={<Link to="/course/charisma-character/leader-ai" className="btn-primary">질문형 리더 AI로</Link>} />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {state.judgments.map((j) => (
                <div key={j.id} className="card p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-navy-800">{j.scenarioTitle}</span>
                    <span>{formatDate(j.createdAt)}</span>
                  </div>
                  {j.question && <p className="mt-2 text-sm text-slate-600">{j.guideName}의 질문 · "{j.question}"</p>}
                  <div className="mt-3 rounded-xl bg-navy-50 p-3 text-sm text-navy-800"><span className="font-semibold">내 방향 · </span>{j.direction}</div>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {j.followUpAnswers.filter((f) => f.answer).map((f) => <li key={f.party}><b className="text-slate-700">{f.party}</b> · {f.answer}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'coaching' &&
        (state.coachingNotes.length === 0 && state.growthPlans.length === 0 ? (
          <EmptyState icon={<MessageSquareText size={36} />} title="코칭 노트와 성취 기록이 없습니다" desc="Coaching 코스에서 코칭 질문을 연습하거나 팀원의 성취 경험을 기록하면 여기에 쌓입니다." action={<Link to="/course/coaching" className="btn-primary">Coaching 코스로</Link>} />
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="label">코칭 질문 노트 {state.coachingNotes.length}</p>
              {state.coachingNotes.map((n) => (
                <div key={n.id} className="card p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-navy-800">{n.memberName} · {n.topic}</span>
                    <span>{formatDate(n.createdAt)} · 점검 {n.score}/9</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">{n.questions.map((q) => <li key={q}>" {q}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="label">단계별 성취 경험 기록 {state.growthPlans.length}</p>
              {state.growthPlans.map((g) => (
                <div key={g.id} className="card p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-navy-800">{g.memberName}</span>
                    <span>{formatDate(g.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{g.plan}</p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {g.steps.map((st) => <li key={st.id}><span className="badge mr-1 bg-navy-50 text-navy-700">{growthStepTypes.find((x) => x.id === st.type)?.label}</span>{st.text}</li>)}
                  </ul>
                  {g.leaderFeedback && <p className="mt-2 text-xs text-teal-700">리더 피드백 {[g.leaderFeedback.problemDefinition, g.leaderFeedback.newAttempt, g.leaderFeedback.errorFix].filter(Boolean).length}/3 {g.leaderFeedback.note && `· ${g.leaderFeedback.note}`}</p>}
                  {g.peerFeedback && <p className="mt-1 text-xs text-slate-500">주변 피드백 · {g.peerFeedback}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}

function CompareBar({ label, before, after, color }: { label: string; before: number; after: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold" style={{ color }}>{label}</span>
        <span className="text-sm text-slate-600">{before} → <b style={{ color }}>{after}</b> <span className={`ml-1 text-xs ${after >= before ? 'text-teal-600' : 'text-red-500'}`}>({after >= before ? '+' : ''}{after - before})</span></span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3 text-xs text-slate-500"><span className="w-10">사전</span><div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-300" style={{ width: `${before}%` }} /></div></div>
        <div className="flex items-center gap-3 text-xs text-slate-500"><span className="w-10">현재</span><div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${after}%`, background: color }} /></div></div>
      </div>
    </div>
  )
}

function Chk({ ok, label }: { ok: boolean; label: string }) {
  return <span className={`flex items-center gap-1 ${ok ? 'text-teal-600' : 'text-slate-400'}`}>{ok ? <CheckCircle2 size={13} /> : <Circle size={13} />} {label}</span>
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="label mb-1">{label}</p>
      <p className="text-slate-700">{value || '—'}</p>
    </div>
  )
}
