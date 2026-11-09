/**
 * 백엔드 API 클라이언트.
 * - 기본 주소: VITE_API_URL(빌드 시) → localStorage 'cc-api-url'(런타임 설정) → '' (같은 출처: 개발 프록시·Render)
 * - 서버가 없으면 모든 화면은 로컬 모드(localStorage)로 그대로 동작한다.
 */
import type { CaseItem, CommunityPost, Grievance } from '../data/types'

export interface ApiUser {
  id: string
  name: string
  display: string
  role: 'captain' | 'leader'
  rank: string
}
export interface Solution {
  id: string
  authorName: string
  authorRank: string
  text: string
  createdAt: string
}
export interface SharedCase extends CaseItem {
  origin: 'seed' | 'user'
  createdAt: string
  solutions: Solution[]
  votedByMe: boolean
  mine: boolean
}
export interface SharedAnswer {
  id: string
  text: string
  check?: { acknowledged: boolean; specific: boolean; direction: boolean }
  createdAt: string
  mine: boolean
}
export interface SharedGrievance extends Grievance {
  origin: 'seed' | 'user'
  mine: boolean
  answers: SharedAnswer[]
}
export interface SharedPost extends CommunityPost {
  origin: 'seed' | 'user'
  createdAt: string
}
export interface LeaderboardRow {
  display: string
  role: 'captain' | 'leader'
  rank: string
  mileage: number
  records: number
  week: number
  practices: number
}

const TOKEN_KEY = 'cc-token'
const URL_KEY = 'cc-api-url'

export function getApiBase(): string {
  const env = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  const runtime = localStorage.getItem(URL_KEY)?.trim()
  return (runtime || env || '').replace(/\/$/, '')
}
export function setApiBase(url: string) {
  if (url.trim()) localStorage.setItem(URL_KEY, url.trim())
  else localStorage.removeItem(URL_KEY)
}
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string | null) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY))

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}, timeoutMs = 8000): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const headers: Record<string, string> = { ...(init.headers as Record<string, string> | undefined) }
    if (init.body) headers['content-type'] = 'application/json'
    const token = getToken()
    if (token) headers.authorization = `Bearer ${token}`
    const res = await fetch(`${getApiBase()}${path}`, { ...init, headers, signal: ctrl.signal })
    const text = await res.text()
    const data = text ? JSON.parse(text) : {}
    if (!res.ok) throw new ApiError(res.status, data?.error ?? `요청 실패 (${res.status})`)
    return data as T
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  health: () => request<{ ok: boolean; version: string; counts: { users: number; cases: number; grievances: number } }>('/api/health', {}, 4000),
  login: (name: string, pin: string, initialState?: unknown) =>
    request<{ token: string; user: ApiUser; created: boolean; state: unknown | null; stateUpdatedAt: string | null }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ name, pin, initialState }) }),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  me: () => request<{ user: ApiUser; state: unknown | null; stateUpdatedAt: string | null }>('/api/me'),
  putState: (state: unknown) => request<{ updatedAt: string }>('/api/me/state', { method: 'PUT', body: JSON.stringify({ state }) }),

  cases: () => request<{ cases: SharedCase[] }>('/api/cases'),
  addCase: (text: string) => request<{ case: SharedCase }>('/api/cases', { method: 'POST', body: JSON.stringify({ text }) }),
  toggleHelpful: (id: string) => request<{ helpful: number; votedByMe: boolean }>(`/api/cases/${id}/helpful`, { method: 'POST' }),
  addSolution: (id: string, text: string) => request<{ case: SharedCase }>(`/api/cases/${id}/solutions`, { method: 'POST', body: JSON.stringify({ text }) }),
  posts: () => request<{ posts: SharedPost[] }>('/api/posts'),
  addPost: (title: string, excerpt: string) => request<{ post: SharedPost }>('/api/posts', { method: 'POST', body: JSON.stringify({ title, excerpt }) }),

  grievances: () => request<{ grievances: SharedGrievance[] }>('/api/grievances'),
  addGrievance: (content: string, dept: string, source: 'text' | 'voice', envData?: { temp: number; hours: number; zone: string }) =>
    request<{ grievance: SharedGrievance }>('/api/grievances', { method: 'POST', body: JSON.stringify({ content, dept, source, envData }) }),
  answer: (id: string, text: string) => request<{ grievance: SharedGrievance; check: SharedAnswer['check'] }>(`/api/grievances/${id}/answers`, { method: 'POST', body: JSON.stringify({ text }) }),

  leaderboard: () => request<{ board: LeaderboardRow[] }>('/api/leaderboard'),
}
