import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Anchor, Award, Coins, Flame, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { demoUser } from '../data/team'
import { stageForWeek } from '../data/journey'
import ForestScene from './ForestScene'

const menu = [
  { to: '/', label: '홈', en: 'HOME', end: true },
  { to: '/curriculum', label: '커리큘럼', en: 'CURRICULUM' },
  { to: '/courses', label: '5C 코스', en: 'COURSES' },
  { to: '/practice', label: '대화 연습실', en: 'PRACTICE' },
  { to: '/bridge', label: '익명 브릿지', en: 'BRIDGE' },
  { to: '/records', label: '내 기록', en: 'RECORDS' },
]

export default function Layout() {
  const { state, setDemoWeek, totalMileage, isLeader, resetAll } = useApp()
  const stage = stageForWeek(state.demoWeek)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const isRefuge = pathname.startsWith('/pnancheo')
  const [scrolled, setScrolled] = useState(false)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goRefuge = () => {
    if (entering) return
    setEntering(true)
    setTimeout(() => navigate('/pnancheo'), 850)
    setTimeout(() => setEntering(false), 1400)
  }

  // 헤더 톤: 홈 상단은 투명(흰 글자), 피난처는 어둡게, 그 외는 흰색
  const transparent = isHome && !scrolled
  const dark = isRefuge
  const headerCls = transparent
    ? 'bg-transparent border-transparent text-white'
    : dark
      ? 'bg-forest-900/80 border-white/10 text-white backdrop-blur'
      : 'bg-white/90 border-slate-200 text-navy-800 backdrop-blur'
  const navIdle = transparent || dark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-navy-800'
  const navActive = transparent ? 'text-white' : dark ? 'text-ember-300' : 'text-navy-800'
  const pill = transparent || dark ? 'border-white/20 text-white/90' : 'border-slate-200 text-slate-700'

  return (
    <div className={`min-h-full ${dark ? 'bg-forest-900 text-white' : ''}`}>
      {isRefuge && <ForestScene className="pointer-events-none fixed inset-0 h-full w-full" />}

      <header className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500 ${headerCls}`}>
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-10 px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg font-bold tracking-tight ${transparent || dark ? 'bg-white/10 text-safety-400' : 'bg-navy-700 text-safety-400'}`}>CC</span>
            <span className="leading-tight">
              <span className="block font-display text-[17px] uppercase tracking-[0.08em]">Captain Class</span>
              <span className={`block text-[11px] ${transparent || dark ? 'text-white/60' : 'text-slate-500'}`}>공감 리더십 사내 교육 포털</span>
            </span>
          </Link>
          <nav className="flex items-center gap-7">
            {menu.map((m) => (
              <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => `group flex flex-col items-center leading-none transition ${isActive ? navActive : navIdle}`}>
                {({ isActive }) => (
                  <>
                    <span className="font-display text-[13px] uppercase tracking-[0.14em]">{m.en}</span>
                    <span className="mt-1 text-[11px]">{m.label}</span>
                    <span className={`mt-1 h-px w-full transition-all ${isActive ? 'bg-current opacity-100' : 'opacity-0 group-hover:opacity-60 bg-current'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/completion" className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${pill} hover:opacity-80`}>
              <Coins size={15} className="text-safety-400" /> {totalMileage.toLocaleString()} M
            </Link>
            <div className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 ${pill}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${isLeader ? 'bg-safety-500' : 'bg-navy-600'}`}>
                {isLeader ? <Award size={14} /> : <Anchor size={14} />}
              </span>
              <span className="text-sm">
                <span className="font-semibold">{demoUser.name}</span>
                <span className="ml-1 text-xs opacity-70">{isLeader ? '리더' : '캡틴'} · {demoUser.title}</span>
              </span>
            </div>
            <label className={`flex items-center gap-2 rounded-full border border-dashed px-3 py-1.5 text-xs ${pill}`}>
              데모 주차
              <select
                value={state.demoWeek}
                onChange={(e) => setDemoWeek(Number(e.target.value))}
                className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-xs font-semibold text-navy-800"
                title="주차를 바꾸면 홈·커리큘럼·미션·진척도가 바뀝니다"
              >
                {Array.from({ length: 14 }, (_, i) => i).map((w) => (
                  <option key={w} value={w}>{w === 0 ? '0주 (진단)' : w === 13 ? '13주+ (유지)' : `${w}주차`}</option>
                ))}
              </select>
              <span className="opacity-60">· {stage.name}</span>
            </label>
            <button onClick={() => { if (confirm('데모 데이터(기록·마일리지·진척도)를 초기화할까요?')) resetAll() }} className="rounded-lg p-2 opacity-60 hover:opacity-100" title="데모 데이터 초기화">
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className={isHome ? '' : isRefuge ? 'relative z-10 mx-auto max-w-[1400px] px-8 pb-24 pt-[108px]' : 'mx-auto max-w-[1400px] px-8 pb-16 pt-[108px]'}>
        <Outlet />
      </main>

      <footer className={`relative z-10 mx-auto max-w-[1400px] px-8 pb-10 pt-4 text-center text-xs ${dark ? 'text-white/40' : 'text-slate-400'}`}>
        CC · Captain Class — "AI는 데이터의 맥락을, 리더는 마음의 맥락을 읽는다" · 발표 시연용 프로토타입 (목업 데이터, 실제 AI API 미사용)
      </footer>

      {/* 우측 하단 피난처(P난처) 버튼 */}
      {!isRefuge && (
        <button
          onClick={goRefuge}
          className="group fixed bottom-7 right-7 z-50 flex items-center gap-0 rounded-full bg-forest-900 pr-0 text-left shadow-2xl transition-all hover:pr-5"
          title="P난처 — 난처할 때 가는 피난처"
        >
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-forest-900">
            <span className="ember-pulse absolute inset-2 rounded-full bg-gradient-to-t from-ember-600 via-ember-500 to-ember-300" />
            <Flame size={26} className="relative text-forest-900" />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-white transition-all duration-300 group-hover:ml-3 group-hover:max-w-[220px]">
            <span className="block font-display text-sm uppercase tracking-[0.14em] text-ember-300">P난처</span>
            <span className="block text-xs text-white/70">난처할 땐, 피난처로</span>
          </span>
        </button>
      )}

      {/* 피난처로 가는 전환 */}
      {entering && (
        <div className="shelter-enter fixed inset-0 z-[60] bg-forest-900">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 100% 100%, rgba(255,138,31,0.55), rgba(255,138,31,0.08) 35%, transparent 60%)' }} />
          <div className="fadeup fadeup-d2 absolute inset-0 flex flex-col items-center justify-center text-center">
            <Flame size={34} className="mb-4 text-ember-400" />
            <p className="font-display text-3xl uppercase tracking-[0.2em] text-ember-300">Refuge</p>
            <p className="mt-2 text-sm text-white/70">숲속 피난처로 들어가는 중…</p>
          </div>
        </div>
      )}
    </div>
  )
}
