import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Award, Cloud, CloudOff, Coins, Flame, Lock, MessageSquareText, PenLine, PlusCircle, ThumbsUp, UserCog, Users } from 'lucide-react'
import { AiNotice, Callout, PrivacyWarning, Tabs, Toast } from '../components/ui'
import { lensPresets } from '../data/lensPresets'
import { matchLens, looksLikePersonalInfo, matchCases } from '../lib/mockAI'
import { useApp } from '../context/AppContext'
import { useSharedCases } from '../lib/shared'
import { ApiError, type SharedCase } from '../lib/api'

type Tab = 'search' | 'waiting'

const examples = ['부하가 된 입사동기에게 지시하기', '연차 높은 경쟁 파트장과의 관계', '더위 속 안전모 반발', '본사의 로그 기반 지적 공문 대응']

export default function PnancheoPage() {
  const [params] = useSearchParams()
  const { state, isLeader, auth } = useApp()
  const shared = useSharedCases()
  const [tab, setTab] = useState<Tab>('search')
  const initialQ = params.get('q') ?? ''
  const [text, setText] = useState(initialQ)
  const [query, setQuery] = useState(initialQ)
  const [toast, setToast] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)

  const results = useMemo(() => (query ? matchCases(query, shared.cases) : []), [query, shared.cases])
  const lens = useMemo(() => {
    if (!query) return undefined
    return matchLens(query) ?? (results[0]?.item.lensPresetId ? lensPresets.find((l) => l.id === results[0].item.lensPresetId) : undefined)
  }, [query, results])
  const waiting = shared.cases.filter((c) => c.origin === 'user')

  const run = () => setQuery(text.trim())
  const notify = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(null), 2400)
  }
  const guard = async (fn: () => Promise<void>, okMsg: string) => {
    try {
      await fn()
      notify(okMsg)
    } catch (e) {
      notify(e instanceof ApiError ? e.message : '서버 요청에 실패했습니다.')
    }
  }

  return (
    <div className="text-white">
      {/* 입구 */}
      <div className="fadeup text-center">
        <p className="font-display text-[15px] uppercase tracking-[0.3em] text-ember-300/90">Refuge · Playbook of 난처</p>
        <h1 className="mt-3 font-display text-[64px] uppercase leading-none tracking-[0.04em] text-white">P난처</h1>
        <div className="mx-auto mt-3 h-[3px] w-14 bg-ember-500" />
        <p className="mt-6 text-[22px] font-medium text-white/90">난처할 땐, 피난처로.</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
          여기서는 아무도 당신을 평가하지 않습니다. 모닥불 앞에 앉아 지금 어떤 상황이 난처한지 천천히 이야기해 주세요. 관점 렌즈가 양쪽 입장을 묻고, 먼저 이 길을 지나간 선배 리더들이 남긴 이야기를 들려드립니다.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/50">
          {shared.live ? <Cloud size={12} className="text-ember-300" /> : <CloudOff size={12} />}
          {shared.live ? `서버 연결 · 모든 캡틴이 남긴 상황과 리더 솔루션이 함께 보입니다 (${shared.cases.length}건)` : auth.online ? '로그인하면 다른 캡틴의 상황과 리더 솔루션이 함께 보입니다' : '로컬 모드 · 기본 사례만 보입니다'}
        </p>
      </div>

      <div className="fadeup fadeup-d1 mx-auto mt-10 max-w-[1080px]">
        <Tabs
          dark
          tabs={[
            { id: 'search', label: '상황 입력' },
            { id: 'waiting', label: `솔루션 기다리는 상황${waiting.length ? ` ${waiting.length}` : ''}` },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'search' && (
        <div className="mx-auto max-w-[1080px] space-y-6">
          <div className="fadeup fadeup-d2 card-dark p-7">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-lg font-bold text-white"><Flame size={18} className="text-ember-400" /> 지금 어떤 상황이 난처하신가요?</label>
              <AiNotice dark />
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  run()
                }
              }}
              placeholder="예: 폭염에 안전모를 올린 작업반장이 AI 경고를 받고 반발합니다. 본사에는 이미 로그가 들어갔고요."
              className="input-dark mt-4 min-h-[120px] resize-none text-base"
            />
            <div className="mt-2 flex items-start justify-between">
              <div>
                <PrivacyWarning dark />
                {looksLikePersonalInfo(text) && <p className="mt-1 text-xs font-semibold text-red-300">연락처·이메일로 보이는 문자열이 있습니다. 개인정보를 지워 주세요.</p>}
              </div>
              <button onClick={run} disabled={text.trim().length < 2} className="btn-ember">이야기 꺼내기 <ArrowRight size={16} /></button>
            </div>
            {!query && (
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="self-center text-xs text-white/40">자주 꺼내는 이야기:</span>
                {examples.map((ex) => (
                  <button key={ex} onClick={() => { setText(ex); setQuery(ex) }} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/75 transition hover:border-ember-400/60 hover:text-ember-300">{ex}</button>
                ))}
              </div>
            )}
          </div>

          {query && (
            <>
              {lens && (
                <section className="fadeup card-dark p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold text-white">1. 관점 렌즈 <span className="ml-2 text-sm font-normal text-white/50">· {lens.title}</span></h2>
                    <Link to="/course/compassion/lens" className="text-xs font-semibold text-ember-300">렌즈 훈련으로</Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4">
                      <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-white/85"><UserCog size={15} /> 리더 입장에서</p>
                      <ul className="space-y-2 text-sm text-white/75">{lens.leaderQuestions.map((q) => <li key={q}>· {q}</li>)}</ul>
                    </div>
                    <div className="rounded-xl border border-ember-500/20 bg-ember-500/10 p-4">
                      <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ember-300"><Users size={15} /> 구성원 입장에서</p>
                      <ul className="space-y-2 text-sm text-white/80">{lens.memberQuestions.map((q) => <li key={q}>· {q}</li>)}</ul>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-white/40">AI의 질문은 정답이 아니라 관점을 넓히는 도구입니다. 상대의 감정을 확정하는 문장은 없습니다.</p>
                </section>
              )}

              <section className="fadeup fadeup-d1">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-bold text-white">2. 선배 리더가 모닥불 앞에서 남긴 이야기 <span className="ml-2 text-sm font-normal text-white/50">{results.length}건</span></h2>
                  <span className={`rounded-full border px-3 py-1.5 text-xs ${isLeader ? 'border-ember-400/50 text-ember-300' : 'border-white/15 text-white/50'}`}>
                    {isLeader ? <Award size={12} className="mr-1 inline" /> : <Lock size={12} className="mr-1 inline" />} 솔루션 작성 {isLeader ? '가능 (리더)' : '· 리더 전용'}
                  </span>
                </div>
                {results.length === 0 ? (
                  <div className="card-dark p-6">
                    <Callout tone="dark">맞는 이야기를 아직 찾지 못했습니다. 새 상황으로 남겨 두면 {shared.live ? '모든 리더에게 보이고, 솔루션이 달리면 "솔루션 기다리는 상황" 탭에서 확인할 수 있습니다.' : '선배 리더들에게 전해집니다. (로컬 모드에서는 이 브라우저에만 저장됩니다)'}</Callout>
                    <NewCaseForm initial={text} live={shared.live} disabled={auth.online && !auth.user} onSubmit={(t) => guard(async () => { await shared.addCase(t); setTab('waiting') }, shared.live ? '새 상황이 모든 리더에게 전해졌습니다.' : '새 상황이 등록되었습니다.')} />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {results.map(({ item }) => (
                        <CaseCard key={item.id} item={item} isLeader={isLeader} live={shared.live} canAct={!auth.online || !!auth.user}
                          onVote={() => guard(() => shared.toggleHelpful(item.id), item.votedByMe ? '도움돼요를 취소했습니다' : '도움돼요를 눌렀습니다')}
                          onSolution={(t) => guard(() => shared.addSolution(item.id, t), '솔루션이 등록되었습니다 (+50 M)')} />
                      ))}
                    </div>
                    <div className="card-dark mt-4 p-5">
                      <button onClick={() => setShowNew((v) => !v)} className="flex w-full items-center justify-between text-left text-sm text-white/70 hover:text-white">
                        <span>딱 맞는 이야기가 없나요? <b className="text-ember-300">내 상황을 새로 남겨 두기</b></span>
                        <PlusCircle size={16} className={`transition ${showNew ? 'rotate-45' : ''}`} />
                      </button>
                      {showNew && <NewCaseForm initial={text} live={shared.live} disabled={auth.online && !auth.user} onSubmit={(t) => guard(async () => { await shared.addCase(t); setShowNew(false); setTab('waiting') }, shared.live ? '새 상황이 모든 리더에게 전해졌습니다.' : '새 상황이 등록되었습니다.')} />}
                    </div>
                  </>
                )}
              </section>
            </>
          )}
        </div>
      )}

      {tab === 'waiting' && (
        <div className="mx-auto max-w-[1080px] space-y-4">
          <Callout tone="dark">캡틴들이 새로 남긴 상황입니다. 리더(수료자)가 솔루션을 달면 그 사례도 플레이북의 일부가 됩니다. {!shared.live && '로컬 모드에서는 이 브라우저에서 남긴 상황만 보입니다.'}</Callout>
          {waiting.length === 0 && state.newCases.length === 0 ? (
            <div className="card-dark p-8 text-center text-sm text-white/50">아직 기다리는 상황이 없습니다. 상황 입력에서 맞는 사례가 없을 때 "남겨 두기"를 누르면 여기에 쌓입니다.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {waiting.map((item) => (
                <CaseCard key={item.id} item={item} isLeader={isLeader} live={shared.live} canAct={!auth.online || !!auth.user}
                  onVote={() => guard(() => shared.toggleHelpful(item.id), '도움돼요를 눌렀습니다')}
                  onSolution={(t) => guard(() => shared.addSolution(item.id, t), '솔루션이 등록되었습니다 (+50 M)')} />
              ))}
              {!shared.live && state.newCases.map((c) => (
                <div key={c.id} className="card-dark p-6">
                  <p className="text-xs text-white/40">내가 남긴 상황 (로컬)</p>
                  <p className="mt-2 text-sm text-white/85">{c.text}</p>
                  <p className="mt-3 text-[11px] text-white/40">서버에 연결·로그인하면 리더에게 전달되어 솔루션을 받을 수 있습니다.</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Toast message={toast} />
    </div>
  )
}

function NewCaseForm({ initial, live, disabled, onSubmit }: { initial: string; live: boolean; disabled: boolean; onSubmit: (text: string) => void }) {
  const [text, setText] = useState(initial)
  return (
    <div className="mt-4">
      <label className="text-xs font-semibold uppercase tracking-wider text-white/50">새 상황 등록</label>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="input-dark mt-1.5 min-h-[90px] resize-none" placeholder="지금 상황을 5자 이상 적어 주세요" />
      <PrivacyWarning dark />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-white/40">{live ? '모든 리더에게 익명이 아닌 "캡틴 이름"으로 보입니다 (솔루션 대기)' : disabled ? '서버에 남기려면 로그인하세요' : '로컬 모드: 이 브라우저에만 저장'}</span>
        <button onClick={() => onSubmit(text.trim())} disabled={disabled || text.trim().length < 5 || looksLikePersonalInfo(text)} className="btn-ember"><PlusCircle size={16} /> 남겨 두기</button>
      </div>
    </div>
  )
}

function CaseCard({ item, isLeader, live, canAct, onVote, onSolution }: { item: SharedCase; isLeader: boolean; live: boolean; canAct: boolean; onVote: () => void; onSolution: (text: string) => void }) {
  const [writing, setWriting] = useState(false)
  const [text, setText] = useState('')
  const hasSeedSolution = !!item.solution
  return (
    <div className="card-dark flex flex-col p-6">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-white">{item.title}</h3>
        {item.origin === 'user' && <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">{item.solutions.length ? '리더 답변 있음' : '솔루션 대기'}</span>}
      </div>
      <p className="mt-2 text-sm text-white/65"><span className="font-semibold text-white/45">상황 · </span>{item.situation}</p>
      {hasSeedSolution && (
        <div className="mt-3 rounded-xl border-l-2 border-ember-500 bg-ember-500/10 p-4 text-sm leading-relaxed text-white/90">
          <span className="font-semibold text-ember-300">선배 리더의 해결 · </span>{item.solution}
        </div>
      )}
      {item.solutions.map((s) => (
        <div key={s.id} className="mt-2 rounded-xl border-l-2 border-ember-300/70 bg-white/5 p-4 text-sm leading-relaxed text-white/85">
          <span className="font-semibold text-ember-200">{s.authorName}</span> <span className="text-[11px] text-white/40">{s.authorRank}</span>
          <p className="mt-1">{s.text}</p>
        </div>
      ))}
      {!hasSeedSolution && item.solutions.length === 0 && <p className="mt-3 rounded-xl border border-dashed border-white/15 p-3 text-xs text-white/45">아직 솔루션이 없습니다. 리더가 모닥불 앞에 앉으면 이야기가 달립니다.</p>}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-white/45">{item.authorRank}</span>
        <button onClick={onVote} disabled={!canAct} className={`rounded-full border px-2.5 py-1 text-xs disabled:opacity-40 ${item.votedByMe ? 'border-ember-400/60 text-ember-300' : 'border-white/15 text-white/60 hover:border-white/30'}`}>
          <ThumbsUp size={12} className="mr-1 inline" /> 도움돼요 {item.helpful}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.scenarioId ? (
          <Link to={`/practice?scenario=${item.scenarioId}`} className="btn-ember flex-1"><MessageSquareText size={16} /> 이 상황 연습하기 <ArrowRight size={14} /></Link>
        ) : (
          <Link to="/practice" className="btn flex-1 border border-white/15 text-white/80 hover:bg-white/5"><MessageSquareText size={16} /> 비슷한 시나리오 고르기</Link>
        )}
        {isLeader && (
          <button onClick={() => setWriting((v) => !v)} className="btn border border-ember-400/50 text-ember-300 hover:bg-ember-500/10" title={live ? '' : '로컬 모드: 마일리지만 적립됩니다'}><PenLine size={14} /> 솔루션 남기기</button>
        )}
      </div>
      {writing && (
        <div className="mt-3">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="이 상황을 어떻게 풀었는지, 다음 캡틴에게 전할 방법을 적어 주세요. (10자 이상)" className="input-dark min-h-[90px] resize-none" />
          <div className="mt-2 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] text-white/40"><Coins size={11} /> 등록 시 50 M</span>
            <button onClick={() => { onSolution(text); setText(''); setWriting(false) }} disabled={text.trim().length < 10} className="btn-ember">등록</button>
          </div>
        </div>
      )}
    </div>
  )
}
