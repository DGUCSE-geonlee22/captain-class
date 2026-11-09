/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_DEMO_WEEK, journey } from '../data/journey'
import { courses } from '../data/courses'
import { mileageRules } from '../data/classes'

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
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<AppState>
    return { ...initialState, ...parsed }
  } catch {
    return initialState
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10)
export const now = () => new Date().toISOString()

interface AppContextValue {
  state: AppState
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
  resetAll: () => void
  progress: { compassion: number; leadership: number; foundation: 'TBD' }
  isLeader: boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

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
    const activityLead = Math.min(1, (state.practiceResults.length + state.practiceLogs.length + state.agreements.length) / 6)
    const leadership = Math.round((weekFrac(leadershipWeeks) * 0.5 + weekFrac(linkWeeks) * 0.2) * 100 + activityLead * 30)

    return {
      state,
      totalMileage,
      isLeader: w >= 13,
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
      resetAll: () => {
        localStorage.removeItem(STORAGE_KEY)
        setState(initialState)
      },
    }
  }, [state, update, addMileage])

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
