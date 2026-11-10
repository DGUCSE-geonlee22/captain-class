import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, Circle, Compass, HardHat, Heart, Footprints } from 'lucide-react'
import { EmptyState, PageHeader, Tabs } from '../components/ui'
import { formatDate, useApp } from '../context/AppContext'
import { axisMeta } from '../data/courses'
import { delegationChoices, delegationTasks, growthStepTypes } from '../data/coaching'
import { dilemmaScenarios, tendencyLabel } from '../data/construction'

type Tab = 'diagnosis' | 'empathy' | 'leadership' | 'field'
const tabs: { id: Tab; label: string }[] = [
  { id: 'diagnosis', label: '진단' },
  { id: 'empathy', label: '공감 축 기록' },
  { id: 'leadership', label: '리더십 축 기록' },
  { id: 'field', label: '현장 실천' },
]
/** 예전 탭 주소 호환 */
const legacy: Record<string, Tab> = { signal: 'empathy', beforeafter: 'empathy', interview: 'empathy', judgment: 'leadership', coaching: 'leadership', practice: 'field', agreement: 'field' }

/** 0주차 진단을 하지 않았을 때의 기본 사전 점수 */
const defaultBaseline = { compassion: 38, leadership: 44 }

export default function RecordsPage() {
  const [params, setParams] = useSearchParams()
  const { state, progress, auth } = useApp()
  const raw = params.get('tab') ?? ''
  const tab: Tab = (tabs.some((t) => t.id === raw) ? (raw as Tab) : legacy[raw]) ?? 'diagnosis'
  const baseline = state.diagnosis ? { compassion: state.diagnosis.empathy, leadership: state.diagnosis.leadership } : defaultBaseline

  const counts: Record<Tab, number> = {
    diagnosis: [state.diagnosis, state.fieldReport].filter(Boolean).length,
    empathy: state.signalNotes.length + state.beforeAfters.length + state.interviewNotes.length,
    leadership: state.judgments.length + state.memberDelegations.length + state.growthPlans.length,
    field: state.practiceLogs.length + state.agreements.length,
  }

  return (
    <div>
      <PageHeader
        en="My Records"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">내 기록</span>}
        title="캡틴의 항해 일지"
        description={`2축 구조 그대로 기록이 쌓입니다. ${auth.user ? `(${auth.user.display} 계정에 서버 저장 중)` : auth.online ? '(로그인하면 서버에 저장됩니다)' : '(로컬 모드 · 이 브라우저에만 저장)'}`}
        right={<Link to="/completion" className="btn-ghost">수료 보기</Link>}
      />
      <Tabs tabs={tabs.map((t) => ({ id: t.id, label: counts[t.id] ? `${t.label} ${counts[t.id]}` : t.label }))} value={tab} onChange={(t) => setParams({ tab: t })} />

      {tab === 'diagnosis' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="card col-span-2 p-7">
            <p className="font-bold text-navy-800">2축 비교 · 사전(0주차) vs 현재({state.demoWeek}주차)</p>
            <p className="mt-1 text-xs text-slate-500">{state.diagnosis ? `사전 점수는 0주차 자기진단 결과(${tendencyLabel[state.diagnosis.tendency].label})이며,` : '사전 점수는 기본값(0주차 진단 미실시)이며,'} 현재 점수는 주차 진행과 활동 기록으로 계산됩니다.</p>
            <div className="mt-8 space-y-8">
              <CompareBar label="공감 축" before={baseline.compassion} after={progress.compassion} color={axisMeta.compassion.color} />
              <CompareBar label="리더십 축" before={baseline.leadership} after={progress.leadership} color={axisMeta.leadership.color} />
            </div>
          </div>
          <div className="card p-6">
            <p className="flex items-center gap-2 font-bold text-navy-800"><HardHat size={16} className="text-safety-500" /> 0주차 Construction</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex items-center gap-1.5">{state.diagnosis ? <CheckCircle2 size={15} className="text-teal-600" /> : <Circle size={15} className="text-slate-300" />} 2축 자기진단 {state.dilemma && <span className="text-xs text-slate-500">· {dilemmaScenarios.find((d) => d.id === state.dilemma!.scenarioId)?.type}</span>}</li>
              <li className="flex items-center gap-1.5">{state.fieldReport ? <CheckCircle2 size={15} className="text-teal-600" /> : <Circle size={15} className="text-slate-300" />} 현장 첫 마디 리포트</li>
            </ul>
            {state.fieldReport && <p className="mt-3 rounded-xl bg-safety-50 p-3 text-xs text-slate-700"><b>{state.fieldReport.counterpart}</b> · "{state.fieldReport.reaction}"</p>}
            {!state.diagnosis && <Link to="/course/construction/diagnosis" className="btn-ghost mt-3 w-full">0주차 진단 시작</Link>}
          </div>
        </div>
      )}

      {tab === 'empathy' && (
        counts.empathy === 0 ? (
          <EmptyState icon={<Heart size={36} />} title="공감 축 기록이 없습니다" desc="Reframing 신호 노트, 반려문 비포/애프터, 펄스 면담 노트가 여기에 쌓입니다." action={<Link to="/course/compassion" className="btn-teal">Compassion 코스로</Link>} />
        ) : (
          <div className="grid grid-cols-3 gap-5">
            <Column title={`신호 노트 ${state.signalNotes.length}`}>
              {state.signalNotes.map((n) => (
                <Item key={n.id} date={n.createdAt}>
                  <p className="text-xs text-slate-500">{n.reframed}</p>
                  <p className="mt-1.5 text-sm text-slate-800"><b className="text-teal-700">대응 · </b>{n.response}</p>
                </Item>
              ))}
            </Column>
            <Column title={`비포/애프터 ${state.beforeAfters.length}`}>
              {state.beforeAfters.map((b) => (
                <Item key={b.id} date={b.createdAt}>
                  <p className="text-xs text-slate-400 line-through">{b.before}</p>
                  <p className="mt-1 text-sm text-slate-800">{b.after}</p>
                  <p className="mt-1 text-[11px] text-teal-700">코칭 포인트 {[b.check.acknowledged, b.check.specific, b.check.direction].filter(Boolean).length}/3</p>
                </Item>
              ))}
            </Column>
            <Column title={`면담 준비 노트 ${state.interviewNotes.length}`}>
              {state.interviewNotes.map((n) => (
                <Item key={n.id} date={n.createdAt}>
                  <p className="text-sm font-semibold text-navy-800">{n.memberName}</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-slate-700">{n.cards.map((c) => <li key={c}>" {c}</li>)}</ul>
                </Item>
              ))}
            </Column>
          </div>
        )
      )}

      {tab === 'leadership' && (
        counts.leadership === 0 ? (
          <EmptyState icon={<Compass size={36} />} title="리더십 축 기록이 없습니다" desc="리더 AI 판단 기록, 팀원 판단 위임 기준표, 단계별 성장 기록이 여기에 쌓입니다." action={<Link to="/course/charisma-character" className="btn-primary">Charisma+Character 코스로</Link>} />
        ) : (
          <div className="grid grid-cols-3 gap-5">
            <Column title={`리더 AI 판단 기록 ${state.judgments.length}`}>
              {state.judgments.map((j) => (
                <Item key={j.id} date={j.createdAt}>
                  <p className="text-xs text-slate-500">{j.scenarioTitle}</p>
                  {j.guideName && <p className="mt-1 text-[11px] text-navy-600">물어본 리더 · {j.guideName}</p>}
                  <p className="mt-1.5 text-sm text-slate-800"><b className="text-navy-700">내 결정 · </b>{j.direction}</p>
                </Item>
              ))}
            </Column>
            <Column title={`팀원 판단 위임 기준표 ${state.memberDelegations.length}`}>
              {state.memberDelegations.map((d) => (
                <Item key={d.id} date={d.createdAt}>
                  <p className="text-sm font-semibold text-navy-800">{d.memberName}</p>
                  {delegationChoices.map((c) => {
                    const ts = delegationTasks.filter((t) => d.tasks[t.id] === c.id)
                    return ts.length ? <p key={c.id} className="mt-1 text-[11px] text-slate-600"><b>{c.label}</b> · {ts.map((t) => t.task).join(', ')}</p> : null
                  })}
                  {d.leaderNote && <p className="mt-1 text-[11px] text-navy-700">리더 보완 · {d.leaderNote}</p>}
                </Item>
              ))}
            </Column>
            <Column title={`단계별 성장 기록 ${state.growthPlans.length}`}>
              {state.growthPlans.map((g) => (
                <Item key={g.id} date={g.createdAt}>
                  <p className="text-sm font-semibold text-navy-800">{g.memberName} · {g.plan}</p>
                  <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600">{g.steps.map((st) => <li key={st.id}><b>{growthStepTypes.find((x) => x.id === st.type)?.label}</b> · {st.text}</li>)}</ul>
                  {g.leaderFeedback && <p className="mt-1 text-[11px] text-teal-700">리더 피드백 {[g.leaderFeedback.problemDefinition, g.leaderFeedback.newAttempt, g.leaderFeedback.errorFix].filter(Boolean).length}/3</p>}
                </Item>
              ))}
            </Column>
          </div>
        )
      )}

      {tab === 'field' && (
        counts.field === 0 ? (
          <EmptyState icon={<Footprints size={36} />} title="현장 실천 기록이 없습니다" desc="대화 연습 뒤 실제 면담·TBM을 복기한 실천 Log와 타 부서와의 협업 합의서가 여기에 쌓입니다." action={<Link to="/practice" className="btn-teal">대화 연습실로</Link>} />
        ) : (
          <div className="grid grid-cols-2 gap-5">
            <Column title={`실천 Log ${state.practiceLogs.length}`}>
              {state.practiceLogs.map((p) => (
                <Item key={p.id} date={p.createdAt}>
                  <p className="text-sm font-semibold text-navy-800">{p.scenarioTitle}</p>
                  <p className="mt-1 text-xs text-slate-700"><b>목적</b> {p.purpose} · <b>표현</b> {p.expression}</p>
                  {p.reaction && <p className="text-xs text-slate-600"><b>반응</b> {p.reaction}</p>}
                  {p.nextChange && <p className="text-xs text-slate-600"><b>다음</b> {p.nextChange}</p>}
                </Item>
              ))}
            </Column>
            <Column title={`협업 합의서 ${state.agreements.length}`}>
              {state.agreements.map((a) => (
                <Item key={a.id} date={a.createdAt}>
                  <p className="text-xs text-slate-500">{a.profileName} · {a.dept}</p>
                  <p className="mt-1 text-sm font-bold text-navy-800">{a.task}</p>
                  {a.checkMethod && <p className="text-xs text-slate-600">확인 · {a.checkMethod}</p>}
                </Item>
              ))}
            </Column>
          </div>
        )
      )}
    </div>
  )
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="label">{title}</p>
      {children}
    </div>
  )
}

function Item({ date, children }: { date: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      {children}
      <p className="mt-2 text-right text-[10px] text-slate-400">{formatDate(date)}</p>
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
