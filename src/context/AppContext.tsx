/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DEFAULT_DEMO_WEEK, journey } from '../data/journey'
import { courses } from '../data/courses'
import { mileageRules } from '../data/classes'
import { demoUser } from '../data/team'
import { api, ApiError, getApiBase, getToken, setApiBase as persistApiBase, setToken, type ApiUser } from '../lib/api'

export interface SignalNote {
  id: string
  createdAt: string
  logId: string
  rawLog: string
  reframed: string
  response: string
}

export interface BeforeAfter {
  id: string
  createdAt: string
  source: 'coaching' | 'consult'
  context: string
  before: string
  after: string
  check: { acknowledged: boolean; specific: boolean; direction: boolean }
}

export interface PracticeLog {
  id: string
  createdAt: string
  scenarioId: string
  scenarioTitle: string
  purpose: string
  expression: string
  reaction: string
  nextChange: string
  scores?: { empathy: number; clarity: number; safety: number }
}

export interface InterviewNote {
  id: string
  createdAt: string
  memberId: string
  memberName: string
  cards: string[]
  memo: string
}

export interface Agreement {
  id: string
  createdAt: string
  profileId: string
  profileName: string
  dept: string
  task: string
  checkMethod: string
}

export interface PracticeResult {
  id: string
  createdAt: string
  scenarioId: string
  scores: { empathy: number; clarity: number; safety: number }
}

export interface MileageEntry {
  id: string
  createdAt: string
  label: string
  points: number
}

export interface ConsultAnswer {
  id: string
  createdAt: string
  grievanceId: string
  answer: string
}

export interface NewCase {
  id: string
  createdAt: string
  text: string
}

/** 질문형 리더 AI · 판단 기록 (Charisma+Character) */
export interface Judgment {
  id: string
  createdAt: string
  scenarioTitle: string
  guideName: string
  question: string
  direction: string
  followUpAnswers: { party: string; question: string; answer: string }[]
}

/** 코칭 질문 연습 노트 (Coaching) */
export interface CoachingNote {
  id: string
  createdAt: string
  memberId: string
  memberName: string
  topic: string
  questions: string[]
  score: number
}

/** 팀원 성취 경험 기록 (Coaching) */
export interface Achievement {
  id: string
  createdAt: string
  memberId: string
  memberName: string
  problem: string
  reasoning: string
  action: string
  next: string
}

interface AppState {
  demoWeek: number
  mileage: MileageEntry[]
  missionsDone: string[]
  completedLessons: string[]
  enrolledClasses: string[]
  helpfulVoted: string[]
  quizDone: string[]
  signalNotes: SignalNote[]
  beforeAfters: BeforeAfter[]
  practiceLogs: PracticeLog[]
  interviewNotes: InterviewNote[]
  agreements: Agreement[]
  practiceResults: PracticeResult[]
  consultAnswers: ConsultAnswer[]
  newCases: NewCase[]
  judgments: Judgment[]
  /** AI 위임 기준표: 업무 id → 'ai' | 'both' | 'me' */
  delegation: Record<string, 'ai' | 'both' | 'me'>
  delegationNote: string
  coachingNotes: CoachingNote[]
  achievements: Achievement[]
  kcaStep: number
}

const STORAGE_KEY = 'cc-captain-class-v1'

const initialState: AppState = {
  demoWeek: DEFAULT_DEMO_WEEK,
  mileage: [
    { id: 'seed-1', createdAt: '2026-10-05T09:00:00', label: '2축 사전 진단 완료', points: 20 },
    { id: 'seed-2', createdAt: '2026-10-12T17:30:00', label: '신호 노트 작성', points: 10 },
    { id: 'seed-3', createdAt: '2026-10-19T18:10:00', label: '주차 현업 미션 완료', points: 30 },
    { id: 'seed-4', createdAt: '2026-10-26T12:00:00', label: '퀵 테스트 완료', points: 5 },
  ],
  missionsDone: ['diagnose', 'read'],
  completedLessons: ['cp-a'],
  enrolledClasses: [],
  helpfulVoted: [],
  quizDone: [],
  signalNotes: [
    {
      id: 'seed-sn-1',
      createdAt: '2026-10-12T17:30:00',
      logId: 'log-route',
      rawLog: '[규정 위반: 지정 동선 이탈] B구역 IoT-GATE-2 · 10:48:05',
      reframed: '지정 통로에 자재 차량이 정차해 있어 거푸집 패널을 든 작업자가 비지정 구간으로 돌아간 상황',
      response: '자재 차량 정차 구역을 따로 지정하고, 동선 이탈 로그에 통로 상태를 같이 적어 본사에 보내기로 함.',
    },
  ],
  beforeAfters: [],
  practiceLogs: [],
  interviewNotes: [],
  agreements: [],
  practiceResults: [],
  consultAnswers: [],
  newCases: [],
  judgments: [],
  delegation: {},
  delegationNote: '',
  coachingNotes: [],
  achievements: [],
  kcaStep: 0,
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<AppState>
    return sanitizeState({ ...initialState, ...parsed })
  } catch {
    return initialState
  }
}

/** 서버에서 온 상태를 안전한 모양으로 정리한다 (배열은 id 있는 객체만, 문자열 배열은 문자열만, 주차는 0~13) */
function sanitizeState(raw: Partial<AppState>): AppState {
  const objArr = <T extends { id: string }>(v: unknown, fallback: T[]): T[] =>
    Array.isArray(v) ? (v.filter((x) => x && typeof x === 'object' && typeof (x as { id?: unknown }).id === 'string') as T[]) : fallback
  const strArr = (v: unknown, fallback: string[]): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : fallback)
  const week = Number(raw.demoWeek)
  return {
    demoWeek: Number.isFinite(week) ? Math.max(0, Math.min(13, Math.round(week))) : initialState.demoWeek,
    mileage: objArr(raw.mileage, initialState.mileage),
    missionsDone: strArr(raw.missionsDone, initialState.missionsDone),
    completedLessons: strArr(raw.completedLessons, initialState.completedLessons),
    enrolledClasses: strArr(raw.enrolledClasses, []),
    helpfulVoted: strArr(raw.helpfulVoted, []),
    quizDone: strArr(raw.quizDone, []),
    signalNotes: objArr(raw.signalNotes, initialState.signalNotes),
    beforeAfters: objArr(raw.beforeAfters, []),
    practiceLogs: objArr(raw.practiceLogs, []),
    interviewNotes: objArr(raw.interviewNotes, []),
    agreements: objArr(raw.agreements, []),
    practiceResults: objArr(raw.practiceResults, []),
    consultAnswers: objArr(raw.consultAnswers, []),
    newCases: objArr(raw.newCases, []),
    judgments: objArr(raw.judgments, []),
    delegation: raw.delegation && typeof raw.delegation === 'object' && !Array.isArray(raw.delegation)
      ? Object.fromEntries(Object.entries(raw.delegation).filter(([, v]) => v === 'ai' || v === 'both' || v === 'me')) as AppState['delegation']
      : {},
    delegationNote: typeof raw.delegationNote === 'string' ? raw.delegationNote : '',
    coachingNotes: objArr(raw.coachingNotes, []),
    achievements: objArr(raw.achievements, []),
    kcaStep: Number.isFinite(Number(raw.kcaStep)) ? Math.max(0, Math.min(4, Math.round(Number(raw.kcaStep)))) : 0,
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10)
export const now = () => new Date().toISOString()

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface AuthInfo {
  /** 서버 연결 여부 (health 체크) */
  online: boolean
  /** 첫 health 체크 진행 중 */
  checking: boolean
  user: ApiUser | null
  sync: SyncStatus
  lastSyncAt: string | null
  apiBase: string
  serverInfo: { version: string; users: number; cases: number; grievances: number } | null
  login: (name: string, pin: string) => Promise<{ created: boolean }>
  logout: () => Promise<void>
  setApiBase: (url: string) => Promise<void>
  recheck: () => Promise<boolean>
}

interface AppContextValue {
  state: AppState
  auth: AuthInfo
  /** 화면에 표시할 현재 사용자 (로그인 시 서버 계정, 아니면 데모 사용자) */
  profile: { name: string; title: string; org: string }
  setDemoWeek: (w: number) => void
  addMileage: (ruleId: string) => void
  totalMileage: number
  toggleMission: (stageId: string) => void
  completeLesson: (lessonId: string) => void
  toggleEnroll: (classId: string) => void
  voteHelpful: (caseId: string) => void
  markQuizDone: (category: string) => void
  addSignalNote: (n: Omit<SignalNote, 'id' | 'createdAt'>) => void
  addBeforeAfter: (b: Omit<BeforeAfter, 'id' | 'createdAt'>) => void
  addPracticeLog: (p: Omit<PracticeLog, 'id' | 'createdAt'>) => void
  addInterviewNote: (n: Omit<InterviewNote, 'id' | 'createdAt'>) => void
  addAgreement: (a: Omit<Agreement, 'id' | 'createdAt'>) => void
  addPracticeResult: (r: Omit<PracticeResult, 'id' | 'createdAt'>) => void
  addConsultAnswer: (c: Omit<ConsultAnswer, 'id' | 'createdAt'>) => void
  addNewCase: (text: string) => void
  addJudgment: (j: Omit<Judgment, 'id' | 'createdAt'>) => void
  setDelegation: (taskId: string, choice: 'ai' | 'both' | 'me') => void
  saveDelegationNote: (note: string) => void
  addCoachingNote: (n: Omit<CoachingNote, 'id' | 'createdAt'>) => void
  addAchievement: (a: Omit<Achievement, 'id' | 'createdAt'>) => void
  setKcaStep: (step: number) => void
  resetAll: () => void
  progress: { compassion: number; leadership: number; foundation: 'TBD' }
  isLeader: boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)
  const [online, setOnline] = useState(false)
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState<ApiUser | null>(null)
  const [sync, setSync] = useState<SyncStatus>('idle')
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null)
  const [apiBase, setApiBaseState] = useState(getApiBase())
  const [serverInfo, setServerInfo] = useState<AuthInfo['serverInfo']>(null)
  /** 서버에서 받은 상태를 적용하는 동안에는 되돌려 올리지 않는다 */
  const skipNextSync = useRef(false)
  const syncTimer = useRef<number | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const applyServerState = useCallback((s: unknown) => {
    if (!s || typeof s !== 'object') return
    skipNextSync.current = true
    setState(sanitizeState(s as Partial<AppState>))
  }, [])

  const recheck = useCallback(async () => {
    setChecking(true)
    try {
      const h = await api.health()
      setOnline(true)
      setServerInfo({ version: h.version, ...h.counts })
      return true
    } catch {
      setOnline(false)
      setServerInfo(null)
      return false
    } finally {
      setChecking(false)
    }
  }, [])

  // 최초: 서버 확인 → 토큰이 있으면 내 정보·상태 복원
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const ok = await recheck()
      if (!ok || cancelled || !getToken()) return
      try {
        const me = await api.me()
        if (cancelled) return
        setUser(me.user)
        if (me.state) applyServerState(me.state)
        else await api.putState(load())
        setLastSyncAt(me.stateUpdatedAt)
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) setToken(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [recheck, applyServerState])

  // 상태가 바뀌면 (로그인·온라인일 때) 디바운스 저장
  useEffect(() => {
    if (!user || !online) return
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }
    if (syncTimer.current) window.clearTimeout(syncTimer.current)
    setSync('saving')
    syncTimer.current = window.setTimeout(async () => {
      try {
        const r = await api.putState(state)
        setSync('saved')
        setLastSyncAt(r.updatedAt)
      } catch {
        setSync('error')
      }
    }, 900)
    return () => {
      if (syncTimer.current) window.clearTimeout(syncTimer.current)
    }
  }, [state, user, online])

  const login = useCallback(
    async (name: string, pin: string) => {
      const r = await api.login(name, pin, state)
      setToken(r.token)
      setUser(r.user)
      if (r.state) applyServerState(r.state)
      setLastSyncAt(r.stateUpdatedAt ?? now())
      setSync('saved')
      return { created: r.created }
    },
    [state, applyServerState],
  )

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      /* 토큰이 이미 무효여도 로컬은 정리 */
    }
    setToken(null)
    setUser(null)
    setSync('idle')
    setLastSyncAt(null)
  }, [])

  const setApiBase = useCallback(
    async (url: string) => {
      persistApiBase(url)
      setApiBaseState(getApiBase())
      await recheck()
    },
    [recheck],
  )

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), [])

  const addMileage = useCallback(
    (ruleId: string) => {
      const rule = mileageRules.find((r) => r.id === ruleId)
      if (!rule) return
      update((s) => ({ ...s, mileage: [{ id: uid(), createdAt: now(), label: rule.label, points: rule.points }, ...s.mileage] }))
    },
    [update],
  )

  const value = useMemo<AppContextValue>(() => {
    const totalMileage = state.mileage.reduce((a, m) => a + m.points, 0)

    // 2축 진척도: 주차 기반(70%) + 활동 기반(30%)
    const w = state.demoWeek
    const compassionWeeks = journey.filter((s) => s.axis === 'compassion').flatMap((s) => s.weeks)
    const leadershipWeeks = journey.filter((s) => s.axis === 'leadership').flatMap((s) => s.weeks)
    const linkWeeks = journey.find((s) => s.id === 'link')!.weeks
    const weekFrac = (weeks: number[]) => (weeks.length ? weeks.filter((x) => x <= w).length / weeks.length : 0)
    const compassionLessons = courses.filter((c) => c.axis === 'compassion').flatMap((c) => c.lessons)
    const lessonFrac = compassionLessons.length ? state.completedLessons.filter((l) => compassionLessons.some((x) => x.id === l)).length / compassionLessons.length : 0
    const activityComp = Math.min(1, (state.signalNotes.length + state.beforeAfters.length + state.interviewNotes.length + state.consultAnswers.length) / 8)
    const compassion = Math.round((weekFrac(compassionWeeks) * 0.5 + weekFrac(linkWeeks) * 0.2) * 100 * 1 + (lessonFrac * 0.15 + activityComp * 0.15) * 100)
    const activityLead = Math.min(1, (state.practiceResults.length + state.practiceLogs.length + state.agreements.length + state.judgments.length + state.coachingNotes.length + state.achievements.length + (Object.keys(state.delegation).length >= 4 ? 1 : 0)) / 8)
    const leadership = Math.round((weekFrac(leadershipWeeks) * 0.5 + weekFrac(linkWeeks) * 0.2) * 100 + activityLead * 30)

    const isLeader = user?.role === 'leader' || w >= 13
    const profile = user
      ? { name: user.name, title: user.role === 'leader' ? user.rank : user.rank || '신임 리더', org: user.role === 'leader' ? '리더 (수료)' : '캡틴 (수강 중)' }
      : { name: demoUser.name, title: demoUser.title, org: demoUser.org }

    return {
      state,
      auth: { online, checking, user, sync, lastSyncAt, apiBase, serverInfo, login, logout, setApiBase, recheck },
      profile,
      totalMileage,
      isLeader,
      progress: { compassion: Math.min(100, compassion), leadership: Math.min(100, leadership), foundation: 'TBD' },
      setDemoWeek: (demoWeek) => update((s) => ({ ...s, demoWeek })),
      addMileage,
      toggleMission: (stageId) =>
        update((s) => {
          const done = s.missionsDone.includes(stageId)
          const missionsDone = done ? s.missionsDone.filter((x) => x !== stageId) : [...s.missionsDone, stageId]
          const rule = mileageRules.find((r) => r.id === 'm-mission')!
          const mileage = done ? s.mileage : [{ id: uid(), createdAt: now(), label: rule.label, points: rule.points }, ...s.mileage]
          return { ...s, missionsDone, mileage }
        }),
      completeLesson: (lessonId) => update((s) => (s.completedLessons.includes(lessonId) ? s : { ...s, completedLessons: [...s.completedLessons, lessonId] })),
      toggleEnroll: (classId) =>
        update((s) => ({ ...s, enrolledClasses: s.enrolledClasses.includes(classId) ? s.enrolledClasses.filter((x) => x !== classId) : [...s.enrolledClasses, classId] })),
      voteHelpful: (caseId) => update((s) => (s.helpfulVoted.includes(caseId) ? s : { ...s, helpfulVoted: [...s.helpfulVoted, caseId] })),
      markQuizDone: (category) =>
        update((s) => {
          if (s.quizDone.includes(category)) return s
          const rule = mileageRules.find((r) => r.id === 'm-quiz')!
          return { ...s, quizDone: [...s.quizDone, category], mileage: [{ id: uid(), createdAt: now(), label: rule.label, points: rule.points }, ...s.mileage] }
        }),
      addSignalNote: (n) => {
        update((s) => ({ ...s, signalNotes: [{ ...n, id: uid(), createdAt: now() }, ...s.signalNotes] }))
        addMileage('m-signal')
      },
      addBeforeAfter: (b) => {
        update((s) => ({ ...s, beforeAfters: [{ ...b, id: uid(), createdAt: now() }, ...s.beforeAfters] }))
        addMileage('m-beforeafter')
      },
      addPracticeLog: (p) => {
        update((s) => ({ ...s, practiceLogs: [{ ...p, id: uid(), createdAt: now() }, ...s.practiceLogs] }))
        addMileage('m-log')
      },
      addInterviewNote: (n) => {
        update((s) => ({ ...s, interviewNotes: [{ ...n, id: uid(), createdAt: now() }, ...s.interviewNotes] }))
        addMileage('m-interview')
      },
      addAgreement: (a) => {
        update((s) => ({ ...s, agreements: [{ ...a, id: uid(), createdAt: now() }, ...s.agreements] }))
        addMileage('m-agreement')
      },
      addPracticeResult: (r) => {
        update((s) => ({ ...s, practiceResults: [{ ...r, id: uid(), createdAt: now() }, ...s.practiceResults] }))
        addMileage('m-practice')
      },
      addConsultAnswer: (c) => {
        update((s) => ({ ...s, consultAnswers: [{ ...c, id: uid(), createdAt: now() }, ...s.consultAnswers] }))
        addMileage('m-consult')
      },
      addNewCase: (text) => update((s) => ({ ...s, newCases: [{ id: uid(), createdAt: now(), text }, ...s.newCases] })),
      addJudgment: (j) => {
        update((s) => ({ ...s, judgments: [{ ...j, id: uid(), createdAt: now() }, ...s.judgments] }))
        addMileage('m-judgment')
      },
      setDelegation: (taskId, choice) => update((s) => ({ ...s, delegation: { ...s.delegation, [taskId]: choice } })),
      saveDelegationNote: (note) => {
        update((s) => ({ ...s, delegationNote: note }))
        addMileage('m-delegation')
      },
      addCoachingNote: (n) => {
        update((s) => ({ ...s, coachingNotes: [{ ...n, id: uid(), createdAt: now() }, ...s.coachingNotes] }))
        addMileage('m-coaching')
      },
      addAchievement: (a) => {
        update((s) => ({ ...s, achievements: [{ ...a, id: uid(), createdAt: now() }, ...s.achievements] }))
        addMileage('m-achievement')
      },
      setKcaStep: (step) => update((s) => ({ ...s, kcaStep: Math.max(0, Math.min(4, step)) })),
      resetAll: () => {
        localStorage.removeItem(STORAGE_KEY)
        setState(initialState)
      },
    }
  }, [state, update, addMileage, online, checking, user, sync, lastSyncAt, apiBase, serverInfo, login, logout, setApiBase, recheck])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
