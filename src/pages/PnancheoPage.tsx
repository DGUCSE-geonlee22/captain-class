import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Award, Coins, Flame, Lock, MessageSquareText, PlusCircle, ThumbsUp, UserCog, Users } from 'lucide-react'
import { AiNotice, Callout, PrivacyWarning, Tabs, Toast } from '../components/ui'
import { communityPosts } from '../data/cases'
import { lensPresets } from '../data/lensPresets'
import { matchCases, matchLens, looksLikePersonalInfo } from '../lib/mockAI'
import { useApp } from '../context/AppContext'

type Tab = 'search' | 'community'

const examples = ['부하가 된 입사동기에게 지시하기', '연차 높은 경쟁 파트장과의 관계', '더위 속 안전모 반발', '본사의 로그 기반 지적 공문 대응']

export default function PnancheoPage() {
  const [params] = useSearchParams()
  const { state, voteHelpful, addNewCase, addMileage, isLeader } = useApp()
  const [tab, setTab] = useState<Tab>('search')
  const initialQ = params.get('q') ?? ''
  const [text, setText] = useState(initialQ)
  const [query, setQuery] = useState(initialQ)
  const [toast, setToast] = useState<string | null>(null)
  const [newCaseText, setNewCaseText] = useState('')
  const [solutionText, setSolutionText] = useState('')

  const results = useMemo(() => (query ? matchCases(query) : []), [query])
  const lens = useMemo(() => {
    if (!query) return undefined
    return matchLens(query) ?? (results[0] ? lensPresets.find((l) => l.id === results[0].item.lensPresetId) : undefined)
  }, [query, results])

  const run = () => setQuery(text.trim())
  const notify = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(null), 2200)
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
      </div>

      <div className="fadeup fadeup-d1 mx-auto mt-10 max-w-[1080px]">
        <Tabs dark tabs={[{ id: 'search', label: '상황 입력' }, { id: 'community', label: '교차 부서 리더 커뮤니티' }]} value={tab} onChange={setTab} />
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
                  <button onClick={() => (isLeader ? undefined : notify("솔루션 작성은 '리더' 직급(수료자)만 가능합니다"))} className={`rounded-full border px-3 py-1.5 text-xs ${isLeader ? 'border-ember-400/50 text-ember-300' : 'border-white/15 text-white/50'}`}>
                    {isLeader ? <Award size={12} className="mr-1 inline" /> : <Lock size={12} className="mr-1 inline" />} 솔루션 작성 {isLeader ? '(리더)' : '· 리더 전용'}
                  </button>
                </div>
                {results.length === 0 ? (
                  <div className="card-dark p-6">
                    <Callout tone="dark">맞는 이야기를 아직 찾지 못했습니다. 새 상황으로 남겨 두면 선배 리더들에게 전해지고, 솔루션이 달리면 알려 드립니다.</Callout>
                    <div className="mt-4">
                      <label className="text-xs font-semibold uppercase tracking-wider text-white/50">새 상황 등록</label>
                      <textarea value={newCaseText || text} onChange={(e) => setNewCaseText(e.target.value)} className="input-dark mt-1.5 min-h-[90px] resize-none" />
                      <PrivacyWarning dark />
                      <div className="mt-3 flex justify-end">
                        <button onClick={() => { addNewCase(newCaseText || text); setNewCaseText(''); notify('새 상황이 등록되었습니다. 선배 리더에게 전해집니다.') }} className="btn-ember"><PlusCircle size={16} /> 남겨 두기</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {results.map(({ item }) => {
                      const voted = state.helpfulVoted.includes(item.id)
                      return (
                        <div key={item.id} className="card-dark flex flex-col p-6">
                          <h3 className="text-base font-bold text-white">{item.title}</h3>
                          <p className="mt-2 text-sm text-white/65"><span className="font-semibold text-white/45">상황 · </span>{item.situation}</p>
                          <div className="mt-3 flex-1 rounded-xl border-l-2 border-ember-500 bg-ember-500/10 p-4 text-sm leading-relaxed text-white/90">
                            <span className="font-semibold text-ember-300">선배 리더의 해결 · </span>{item.solution}
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-white/45">{item.authorRank}</span>
                            <button onClick={() => { if (!voted) { voteHelpful(item.id); notify('도움돼요를 눌렀습니다') } }} className={`rounded-full border px-2.5 py-1 text-xs ${voted ? 'border-ember-400/60 text-ember-300' : 'border-white/15 text-white/60 hover:border-white/30'}`}>
                              <ThumbsUp size={12} className="mr-1 inline" /> 도움돼요 {item.helpful + (voted ? 1 : 0)}
                            </button>
                          </div>
                          {item.scenarioId ? (
                            <Link to={`/practice?scenario=${item.scenarioId}`} className="btn-ember mt-4"><MessageSquareText size={16} /> 이 상황 연습하기 <ArrowRight size={14} /></Link>
                          ) : (
                            <Link to="/practice" className="btn mt-4 border border-white/15 text-white/80 hover:bg-white/5"><MessageSquareText size={16} /> 비슷한 시나리오 고르기</Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              <section className="fadeup fadeup-d2 card-dark p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-white">3. 내 이야기도 남기기 (솔루션 작성)</h2>
                  <span className="flex items-center gap-1 text-xs text-white/45"><Coins size={12} /> 등록 시 50 M 지급</span>
                </div>
                {isLeader ? (
                  <div className="mt-3">
                    <textarea value={solutionText} onChange={(e) => setSolutionText(e.target.value)} placeholder="이 상황을 어떻게 풀었는지, 다음 캡틴에게 전할 방법을 적어 주세요." className="input-dark min-h-[90px] resize-none" />
                    <div className="mt-3 flex justify-end">
                      <button onClick={() => { addMileage('m-solution'); setSolutionText(''); notify('솔루션이 등록되었습니다 (+50 M)') }} disabled={solutionText.trim().length < 10} className="btn-ember">솔루션 등록</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-white/15 px-5 py-4 text-sm text-white/60">
                    <Lock size={18} className="text-white/40" />
                    <div>
                      <p className="font-semibold text-white/80">리더 직급(12주 수료자)만 이야기를 남길 수 있습니다.</p>
                      <p className="text-xs">지금은 듣고, 연습하고, 도움돼요를 누를 수 있습니다. 수료 후 이 칸이 열립니다. (데모: 헤더에서 13주차로 바꾸면 열립니다)</p>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}

      {tab === 'community' && (
        <div className="mx-auto max-w-[1080px] space-y-3">
          <Callout tone="dark">타 부서 리더들이 올린 글입니다. 수료한 리더만 글을 쓸 수 있고, 캡틴은 읽고 질문할 수 있습니다.</Callout>
          {communityPosts.map((p) => (
            <div key={p.id} className="card-dark flex items-center gap-5 p-5">
              <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80">{p.dept}</span>
              <div className="flex-1">
                <p className="font-bold text-white">{p.title}</p>
                <p className="mt-0.5 text-sm text-white/65">{p.excerpt}</p>
              </div>
              <div className="shrink-0 text-right text-xs text-white/45"><p>{p.author}</p><p className="mt-0.5">댓글 {p.replies}</p></div>
            </div>
          ))}
          {state.newCases.length > 0 && (
            <div className="card-dark p-5">
              <p className="mb-2 text-sm font-bold text-white">내가 남긴 새 상황</p>
              <ul className="space-y-1 text-sm text-white/65">{state.newCases.map((c) => <li key={c.id}>· {c.text}</li>)}</ul>
            </div>
          )}
        </div>
      )}
      <Toast message={toast} />
    </div>
  )
}
