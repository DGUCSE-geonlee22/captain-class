import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Circle, Flame, HardHat, MessageSquareText, Mic, PenLine, Radio, Users, Waypoints } from 'lucide-react'
import HeroScene from '../components/HeroScene'
import { CurriculumTable, WeekStrip } from '../components/Curriculum'
import { AiNotice, ProgressBar, Reveal, SectionHead } from '../components/ui'
import { useApp } from '../context/AppContext'
import { organization } from '../data/team'
import { construction, stageForWeek, TOTAL_WEEKS, weekPlanFor } from '../data/journey'
import { safetyLogs } from '../data/logs'
import { grievances } from '../data/bridge'
import { axisMeta, courses } from '../data/courses'

export default function HomePage() {
  const { state, toggleMission, progress, isLeader, profile } = useApp()
  const week = state.demoWeek
  const stage = stageForWeek(week)
  const plan = weekPlanFor(week)
  const weeksLeft = Math.max(0, TOTAL_WEEKS - week)
  const missionDone = state.missionsDone.includes(stage.id)
  const todaysLogs = [...safetyLogs].slice(week % 2, (week % 2) + 3)
  const compassionAxis = courses.filter((c) => c.axis === 'compassion')
  const leadershipAxis = courses.filter((c) => c.axis === 'leadership')

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[100vh] min-h-[720px] w-full overflow-hidden">
        <HeroScene className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/40 via-transparent to-navy-900/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <p className="fadeup font-display text-[22px] uppercase tracking-[0.28em] text-white/85">CC · Empathy Leadership Portal</p>
          <h1 className="fadeup fadeup-d1 mt-3 font-display text-[132px] font-semibold uppercase leading-[0.92] tracking-[0.02em]">
            Captain<br />Class
          </h1>
          <p className="fadeup fadeup-d2 mt-7 text-xl font-medium tracking-[0.04em] text-white/95">"누구나 캡틴이 될 수 있지만 아무나 리더가 될 수는 없다"</p>
          <p className="fadeup fadeup-d3 mt-3 text-sm text-white/65">직책만 받은 '캡틴'이 12주 항해를 거쳐 사람을 이끄는 '리더'가 되는 사내 교육 포털</p>
        </div>
        <div className="absolute bottom-10 left-10 text-white/85">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Now sailing</p>
          <p className="mt-1 text-lg font-semibold">{profile.name} {isLeader ? '리더' : '캡틴'} · {week === 0 ? '출항 전' : week >= 13 ? '13주+ 유지 단계' : `${week}주차 · ${stage.name} 단계`}</p>
        </div>
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center text-white/70">
          <span className="font-display text-[11px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="scroll-cue mt-2 block h-12 w-px bg-white/70" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-[1400px] px-8 pb-16 pt-24">
        <SectionHead
          en="About"
          ko={<>직책만 받은 캡틴이,<br />사람을 이끄는 리더가 되는 12주</>}
          sub={`${organization.name}(${organization.size}). ${organization.background}`}
        />
        <Reveal className="mt-14 grid grid-cols-2 gap-1" delay={100}>
          <div className="relative flex h-[560px] items-center justify-center overflow-hidden rounded-l-3xl bg-gradient-to-br from-navy-900 via-navy-700 to-navy-500">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 60px)' }} />
            <p className="vertical-rl relative text-[28px] font-medium tracking-[0.22em] text-white">AI는 데이터의 맥락을,</p>
            <span className="absolute bottom-5 left-6 font-display text-xs uppercase tracking-[0.25em] text-white/50">Data context</span>
          </div>
          <div className="relative flex h-[560px] items-center justify-center overflow-hidden rounded-r-3xl bg-gradient-to-bl from-teal-700 via-teal-500 to-teal-300">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
            <p className="vertical-rl relative text-[28px] font-medium tracking-[0.22em] text-white">리더는 마음의 맥락을 읽는다.</p>
            <span className="absolute bottom-5 right-6 font-display text-xs uppercase tracking-[0.25em] text-white/60">Heart context</span>
          </div>
        </Reveal>
        <Reveal className="mx-auto mt-10 max-w-3xl text-center" delay={200}>
          <p className="text-[15px] leading-relaxed text-slate-700">
            <b className="text-navy-800">공감 리더십</b>이란, 구성원의 마음을 이해하고 소통하는 <span className="font-semibold text-teal-700">'공감'</span>과, 믿고 따를 수 있는 카리스마와 품격으로 이끄는 <span className="font-semibold text-navy-700">'리더십'</span>을 함께 갖추어 '캡틴'의 역할에서 '리더'의 행동으로 나아가는 것입니다.
            <br />AI는 대신 판단하는 존재가 아니라 판단을 돕는 조력자입니다.
          </p>
        </Reveal>
      </section>

      {/* MY VOYAGE */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1400px] px-8">
          <SectionHead
            en="My Voyage"
            ko={isLeader ? <>{profile.name} 리더, 리더 직급을 획득했어요</> : weeksLeft === 0 ? <>{profile.name} 캡틴, 이번 주가 마지막 항해예요</> : <>{profile.name} 캡틴, 리더까지 <span className="text-safety-500">{weeksLeft}주</span> 남았어요</>}
            sub={`${profile.org} · ${profile.title} · 현재 ${stage.order}. ${stage.name} 단계 (${stage.weekLabel})`}
          />
          <Reveal className="mt-12" delay={100}><WeekStrip /></Reveal>
          <Reveal className="mt-6 grid grid-cols-5 gap-6" delay={200}>
            <div className="card col-span-3 flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-safety-50 text-safety-600"><Waypoints size={26} /></div>
              <div className="flex-1">
                <p className="label">이번 주 수업 · {plan.courseLabel}</p>
                <p className="mt-0.5 text-lg font-bold text-navy-800">{plan.title}</p>
                <p className="mt-1 text-sm text-slate-600"><span className="font-semibold text-slate-500">현업 미션 · </span>{stage.mission}</p>
                <p className="text-xs text-slate-400">산출물: {stage.output}</p>
              </div>
              <button onClick={() => toggleMission(stage.id)} className={missionDone ? 'btn-teal' : 'btn-ghost'}>
                {missionDone ? <CheckCircle2 size={16} /> : <Circle size={16} />} {missionDone ? '미션 완료함' : '미션 완료 체크'}
              </button>
              <Link to="/records?tab=practice" className="btn-primary"><PenLine size={16} /> 기록 작성</Link>
            </div>
            <div className="card col-span-2 p-6">
              <p className="label mb-4">2축 진척도</p>
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm"><span className="font-semibold text-teal-700">공감 축</span><span className="font-bold">{progress.compassion}%</span></div>
                  <ProgressBar value={progress.compassion} color={axisMeta.compassion.color} />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm"><span className="font-semibold text-navy-700">리더십 축</span><span className="font-bold">{progress.leadership}%</span></div>
                  <ProgressBar value={progress.leadership} color={axisMeta.leadership.color} />
                </div>
                <div className="flex items-center justify-between rounded-xl border-2 border-dashed px-3 py-2 text-xs" style={{ borderColor: axisMeta.foundation.color }}>
                  <span className="flex items-center gap-1.5 font-semibold text-safety-700"><HardHat size={13} /> Construction</span>
                  <span className="text-slate-500">{construction.note}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="mx-auto max-w-[1400px] px-8 py-20">
        <SectionHead en="Curriculum" ko={<>12주 주차별 수강 코스</>} sub="매주 하나의 코스 수업과 하나의 현업 미션. 수업에서 배운 것을 그 주에 현장에서 적용하고 기록해야 다음 주로 넘어갑니다." />
        <Reveal className="mt-12" delay={100}><CurriculumTable compact /></Reveal>
        <Reveal className="mt-6 text-center" delay={200}>
          <Link to="/curriculum" className="btn-primary">주차별 수업 내용·레슨 전체 보기 <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      {/* 5C COURSES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1400px] px-8">
          <SectionHead en="5C Courses" ko="2축 프레임워크 위에 세운 5C" sub="공감 축(Compassion, Collaboration+Communication)과 리더십 축(Charisma+Character, Coaching)이 두 기둥이고, 그 아래 현장 업종의 기초 역량 Construction이 깔립니다." />
          <Reveal className="mt-12 grid grid-cols-2 gap-6" delay={100}>
            {[{ title: '공감 축', sub: '구성원의 마음을 이해하고 소통으로 전달한다', list: compassionAxis, color: axisMeta.compassion.color }, { title: '리더십 축', sub: '믿고 따를 수 있는 카리스마와 품격으로 이끈다', list: leadershipAxis, color: axisMeta.leadership.color }].map((col) => (
              <div key={col.title} className="rounded-3xl border border-slate-200 bg-[#f6f8fa] p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold" style={{ color: col.color }}><span className="h-3 w-3 rounded-full" style={{ background: col.color }} /> {col.title}</h3>
                <p className="text-sm text-slate-500">{col.sub}</p>
                <div className="mt-5 space-y-3">
                  {col.list.map((c) => (
                    <Link key={c.id} to={`/course/${c.id}`} className={`card flex items-center justify-between p-4 transition hover:-translate-y-0.5 hover:shadow-md ${c.status === 'skeleton' ? 'border-dashed' : ''}`}>
                      <span>
                        <span className="block font-bold text-navy-800">{c.name} <span className="ml-1 text-xs font-medium text-slate-400">{c.nameKo}</span></span>
                        <span className="block text-sm text-slate-600">{c.tagline}</span>
                      </span>
                      {c.status === 'skeleton' ? <span className="badge shrink-0 bg-slate-100 text-slate-500">준비 중 · {c.owner}</span> : <ArrowRight size={16} className="shrink-0 text-slate-300" />}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={200}>
            <Link to="/course/construction" className="mt-6 flex items-center gap-5 rounded-2xl border-2 border-dashed bg-safety-50/40 px-7 py-5 transition hover:bg-safety-50" style={{ borderColor: axisMeta.foundation.color }}>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-safety-600 shadow-sm"><HardHat size={24} /></span>
              <span className="flex-1">
                <span className="text-lg font-bold text-safety-700">Construction</span>
                <span className="ml-2 badge bg-safety-100 text-safety-700">기초 역량 · 콘텐츠 준비 중 · 담당 주우상</span>
                <span className="block text-sm text-slate-600">현장 업종의 큰 흐름과 관리감독 역량의 기초</span>
              </span>
              <ArrowRight className="text-safety-400" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-[1400px] px-8 py-20">
        <SectionHead en="Features" ko="핵심 기능 3가지" sub="세 기능은 서로 이어집니다. 피난처에서 상황을 꺼내고, 연습실에서 말해 보고, 브릿지로 다른 사람의 목소리를 듣습니다." />
        <div className="mt-12 grid grid-cols-3 gap-6">
          <Reveal delay={0}>
            <Link to="/pnancheo" className="group relative block h-[340px] overflow-hidden rounded-3xl bg-forest-900 p-7 text-white">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(255,138,31,0.55), rgba(255,138,31,0.1) 45%, transparent 70%), linear-gradient(180deg, #06111c, #12304a 60%, #0d0b08)' }} />
              <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.6) 0 14px, transparent 14px 70px)' }} />
              <div className="relative flex h-full flex-col">
                <span className="font-display text-sm uppercase tracking-[0.2em] text-ember-300">Refuge · 핵심 기능 1</span>
                <h3 className="mt-2 text-2xl font-bold">P난처 2.0</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">난처한 상황을 적으면 관점 렌즈 질문과 선배 리더들의 해결 사례를 모닥불 앞에서 들려줍니다. 화면 우측 하단의 불씨가 언제나 입구입니다.</p>
                <span className="mt-auto flex items-center gap-2 text-sm font-semibold text-ember-300"><Flame size={16} /> 피난처로 들어가기 <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <Link to="/practice" className="group card flex h-[340px] flex-col p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><MessageSquareText size={24} /></span>
              <span className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-teal-600">Practice · 핵심 기능 2</span>
              <h3 className="mt-1 text-2xl font-bold text-navy-800">캡틴 대화 연습실</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">AI가 작업반장·이강 대리·김두현 역할을 맡습니다. 매 턴 선택하거나 직접 입력하면 공감도·명확성·심리적 안전감 지수가 바뀌고, 끝나면 리포트와 실천 Log 양식이 열립니다.</p>
              <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-teal-600">시나리오 고르기 <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
            </Link>
          </Reveal>
          <Reveal delay={240}>
            <Link to="/bridge" className="group card flex h-[340px] flex-col p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-safety-50 text-safety-600"><Users size={24} /></span>
              <span className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-safety-600">Bridge · 핵심 기능 3</span>
              <h3 className="mt-1 text-2xl font-bold text-navy-800">익명 브릿지</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">타 파트·타 부서 구성원과 작업자의 고충이 익명으로 도착합니다. 직접 답해 보고, Link 단계에서는 본사·타 현장 리더와 15분 교환 인터뷰로 이어집니다.</p>
              <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-safety-600">고충 듣기 <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SIGNALS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1400px] px-8">
          <SectionHead en="Signals" ko="오늘의 현장 신호" sub="AI 경고 로그를 환경 맥락으로 다시 읽은 문장입니다. 원래 로그는 작은 회색 글씨로 남겨 두었습니다." />
          <div className="mt-12 grid grid-cols-5 gap-6">
            <Reveal className="col-span-3 card p-6" delay={0}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-navy-800"><Radio size={18} className="text-teal-500" /> Reframing 로그</h3>
                <AiNotice />
              </div>
              <div className="space-y-3">
                {todaysLogs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <p className="font-mono text-[11px] text-slate-400">{log.rawLog}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-800">{log.reframed}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-2 text-[11px] text-slate-500">
                        <span className="badge bg-white">{log.time}</span><span className="badge bg-white">체감 {log.feelsLike}°</span><span className="badge bg-white">연속 {log.continuousHours}h</span>
                      </div>
                      <Link to={`/course/compassion/reframing?log=${log.id}`} className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700">자세히 보기 <ArrowRight size={13} /></Link>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal className="col-span-2 card p-6" delay={120}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-navy-800"><Mic size={18} className="text-navy-500" /> 익명 브릿지에 새로 온 고충</h3>
                <Link to="/bridge" className="text-xs font-semibold text-teal-600">전체 보기</Link>
              </div>
              <div className="space-y-3">
                {grievances.slice(0, 3).map((g) => (
                  <Link key={g.id} to="/bridge" className="block rounded-xl border border-slate-100 p-4 transition hover:border-teal-200 hover:bg-teal-50/40">
                    <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{g.dept}</span>
                      <span className={`badge ${g.source === 'voice' ? 'bg-navy-50 text-navy-700' : 'bg-teal-50 text-teal-700'}`}>{g.source === 'voice' ? '음성→텍스트 · 톤 변조' : 'AI 말투 가공 완료'}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-700">{g.content}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
