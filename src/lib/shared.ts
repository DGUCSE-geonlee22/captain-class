/**
 * 공유 데이터 훅. 서버에 연결돼 있으면 서버 데이터를, 아니면 로컬 목업 데이터를 같은 모양으로 돌려준다.
 * 화면은 online 여부를 거의 신경 쓰지 않고 이 훅만 쓰면 된다.
 */
import { useCallback, useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { api, type LeaderboardRow, type SharedCase, type SharedGrievance, type SharedPost } from './api'
import { cases as seedCases, communityPosts as seedPosts } from '../data/cases'
import { grievances as seedGrievances } from '../data/bridge'

const REFRESH_MS = 12_000

/** 마운트·로그인 변경 시 조회하고, 서버 모드에서는 주기적으로 + 창이 다시 활성화될 때 다시 조회한다 */
function useLiveRefresh(reload: () => Promise<void>, online: boolean, userId: string | undefined) {
  useEffect(() => {
    let cancelled = false
    const run = () => {
      if (!cancelled) void reload()
    }
    const first = window.setTimeout(run, 0)
    if (!online) return () => window.clearTimeout(first)
    const timer = window.setInterval(run, REFRESH_MS)
    const onFocus = () => {
      if (document.visibilityState === 'visible') run()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      cancelled = true
      window.clearTimeout(first)
      window.clearInterval(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [reload, online, userId])
}

const localCases = (): SharedCase[] => seedCases.map((c) => ({ ...c, origin: 'seed', createdAt: '', solutions: [], votedByMe: false, mine: false }))
const localGrievances = (): SharedGrievance[] => seedGrievances.map((g) => ({ ...g, origin: 'seed', mine: false, answers: [] }))
const localPosts = (): SharedPost[] => seedPosts.map((p) => ({ ...p, origin: 'seed', createdAt: '' }))

/** P난처 사례 + 커뮤니티 글 */
export function useSharedCases() {
  const { auth, state, voteHelpful, addNewCase, addMileage } = useApp()
  const live = auth.online && !!auth.user
  const [cases, setCases] = useState<SharedCase[]>(localCases)
  const [posts, setPosts] = useState<SharedPost[]>(localPosts)
  const [loading, setLoading] = useState(false)

  const reload = useCallback(async () => {
    if (!auth.online) {
      await Promise.resolve()
      setCases(localCases())
      setPosts(localPosts())
      return
    }
    setLoading(true)
    try {
      const [c, p] = await Promise.all([api.cases(), api.posts()])
      setCases(c.cases)
      setPosts(p.posts)
    } catch {
      setCases(localCases())
      setPosts(localPosts())
    } finally {
      setLoading(false)
    }
  }, [auth.online])

  useLiveRefresh(reload, auth.online, auth.user?.id)

  // 로컬 모드에서는 도움돼요 표시를 로컬 상태로 보정
  const merged = live ? cases : cases.map((c) => ({ ...c, votedByMe: state.helpfulVoted.includes(c.id), helpful: c.helpful + (state.helpfulVoted.includes(c.id) ? 1 : 0) }))

  return {
    live,
    loading,
    cases: merged,
    posts,
    reload,
    toggleHelpful: async (id: string) => {
      if (!live) return voteHelpful(id)
      const r = await api.toggleHelpful(id)
      setCases((cs) => cs.map((c) => (c.id === id ? { ...c, helpful: r.helpful, votedByMe: r.votedByMe } : c)))
    },
    addCase: async (text: string) => {
      if (!live) return addNewCase(text)
      const r = await api.addCase(text)
      setCases((cs) => [r.case, ...cs])
    },
    addSolution: async (id: string, text: string) => {
      if (!live) {
        addMileage('m-solution')
        return
      }
      const r = await api.addSolution(id, text)
      setCases((cs) => cs.map((c) => (c.id === id ? r.case : c)))
      addMileage('m-solution')
    },
    addPost: async (title: string, excerpt: string) => {
      if (!live) return
      const r = await api.addPost(title, excerpt)
      setPosts((ps) => [r.post, ...ps])
    },
  }
}

/** 익명 브릿지 고충 + 답변 */
export function useSharedGrievances() {
  const { auth, addConsultAnswer } = useApp()
  const live = auth.online && !!auth.user
  const [grievances, setGrievances] = useState<SharedGrievance[]>(localGrievances)
  const [loading, setLoading] = useState(false)

  const reload = useCallback(async () => {
    if (!auth.online) {
      await Promise.resolve()
      setGrievances(localGrievances())
      return
    }
    setLoading(true)
    try {
      const r = await api.grievances()
      setGrievances(r.grievances)
    } catch {
      setGrievances(localGrievances())
    } finally {
      setLoading(false)
    }
  }, [auth.online])

  useLiveRefresh(reload, auth.online, auth.user?.id)

  return {
    live,
    loading,
    grievances,
    reload,
    submit: async (content: string, dept: string, source: 'text' | 'voice', envData?: { temp: number; hours: number; zone: string }) => {
      const r = await api.addGrievance(content, dept, source, envData)
      setGrievances((gs) => [r.grievance, ...gs])
      return r.grievance
    },
    answer: async (id: string, text: string, localCheck: { acknowledged: boolean; specific: boolean; direction: boolean }) => {
      addConsultAnswer({ grievanceId: id, answer: text })
      if (!live) return localCheck
      const r = await api.answer(id, text)
      setGrievances((gs) => gs.map((g) => (g.id === id ? r.grievance : g)))
      return r.check ?? localCheck
    },
  }
}

/** 캡틴 랭킹 (서버 전용) */
export function useLeaderboard() {
  const { auth } = useApp()
  const [board, setBoard] = useState<LeaderboardRow[] | null>(null)
  useEffect(() => {
    let cancelled = false
    const run = auth.online ? api.leaderboard().then((r) => r.board).catch(() => null) : Promise.resolve(null)
    run.then((b) => {
      if (!cancelled) setBoard(b)
    })
    return () => {
      cancelled = true
    }
  }, [auth.online, auth.sync, auth.user?.id])
  return board
}
