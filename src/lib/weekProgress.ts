/**
 * 주차 이수 판정 (완료 기준). 강의 모두 수강 + 확인 활동 완료 = 주차 이수.
 * 데모에서는 현재 데모 주차보다 앞선 주차를 이미 이수한 것으로 본다.
 */
import { weekLecturesFor } from '../data/lectures'

interface StateLike {
  demoWeek: number
  lecturesDone: string[]
  checksDone: number[]
  weekMissions: number[]
  completedLessons: string[]
}

export type WeekStatus = 'done' | 'current' | 'inprogress' | 'upcoming'

export function weekProgress(state: StateLike, week: number) {
  const w = weekLecturesFor(week)
  const past = week < state.demoWeek
  const watched = w.lectures.filter((l) => past || state.lecturesDone.includes(l.id)).length
  const checkDone = past || state.checksDone.includes(week) || (!!w.check.lessonId && state.completedLessons.includes(w.check.lessonId) && week <= state.demoWeek)
  const missionDone = past || state.weekMissions.includes(week)
  const complete = watched === w.lectures.length && checkDone
  const started = watched > 0 || checkDone
  const status: WeekStatus = complete ? 'done' : week === state.demoWeek ? 'current' : started ? 'inprogress' : 'upcoming'
  return { w, watched, total: w.lectures.length, checkDone, missionDone, complete, status, isLectureDone: (id: string) => past || state.lecturesDone.includes(id) }
}

export const statusLabel: Record<WeekStatus, { label: string; cls: string }> = {
  done: { label: '이수 완료', cls: 'bg-teal-50 text-teal-700' },
  current: { label: '이번 주', cls: 'bg-safety-500 text-white' },
  inprogress: { label: '수강 중', cls: 'bg-navy-50 text-navy-700' },
  upcoming: { label: '예정', cls: 'bg-slate-100 text-slate-500' },
}
