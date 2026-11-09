// 공통 타입 정의. 데이터 파일(src/data/*.ts)은 모두 이 타입을 따른다.

export type Axis = 'compassion' | 'leadership' | 'foundation'

export type CourseId =
  | 'construction'
  | 'compassion'
  | 'collab-comm'
  | 'charisma-character'
  | 'coaching'

export type CourseStatus = 'ready' | 'skeleton'

export interface Lesson {
  id: string
  title: string
  summary: string
  /** 라우트 경로. 뼈대 코스는 비워 둔다 */
  path?: string
}

/** 코스 프레임(곽경은 공감 축 정리 기준): 목표·핵심 질문·교육 목적·중심 요소·보조 수단 */
export interface CourseFramework {
  goal: string
  keyQuestion: string
  purpose: string
  /** 중심 교육 요소 (레슨 id) */
  coreLessonIds: string[]
  /** 보조 수단 (레슨 id) */
  supportLessonIds: string[]
  /** 코스 흐름 한 줄 (예: 듣기 → 이해) */
  flow: string[]
}

export interface Course {
  id: CourseId
  name: string
  /** 한국어 짧은 이름 (예: 공감) */
  nameKo: string
  axis: Axis
  axisLabel: string
  tagline: string
  description: string
  status: CourseStatus
  owner: string
  lessons: Lesson[]
  framework?: CourseFramework
}

/** 주차별 커리큘럼 한 줄 */
export interface WeekPlan {
  week: number
  stageId: string
  courseId: CourseId | 'common' | 'mixed'
  courseLabel: string
  title: string
  topics: string[]
  lessonIds: string[]
  mission: string
  output: string
  status: 'ready' | 'skeleton' | 'common'
}

export interface JourneyStage {
  id: string
  order: number
  name: string
  /** 포함 주차 (예: [1,2,3]). 진단은 0주차, 유지는 13 */
  weeks: number[]
  weekLabel: string
  courseIds: CourseId[]
  courseLabel: string
  mission: string
  output: string
  axis: Axis | 'common' | 'mixed' | 'finish'
}

export interface TeamMember {
  id: string
  name: string
  role: string
  situation: string
  overloadIndex: number
  recentTurningPoint: string
}

export interface SafetyLog {
  id: string
  rawLog: string
  time: string
  feelsLike: number
  continuousHours: number
  materialWeight: string
  zone: string
  reframed: string
  reflectionQuestions: string[]
}

export interface LensPreset {
  id: string
  title: string
  situation: string
  leaderQuestions: string[]
  memberQuestions: string[]
  keywords: string[]
}

export interface CaseItem {
  id: string
  title: string
  situation: string
  solution: string
  authorRank: string
  helpful: number
  keywords: string[]
  lensPresetId: string
  scenarioId?: string
}

export interface CommunityPost {
  id: string
  dept: string
  author: string
  title: string
  excerpt: string
  replies: number
}

export type ReplyType = 'control' | 'avoid' | 'explore' | 'empathic'

export interface ScenarioChoice {
  type: ReplyType
  text: string
}

export interface ScenarioTurn {
  /** 상대(NPC)의 발화 */
  npc: string
  /** 선택지 4개 (유형별 1개) */
  choices: ScenarioChoice[]
  /** 유형별 상대의 다음 반응 */
  reactions: Record<ReplyType, string>
}

export interface Scenario {
  id: string
  title: string
  counterpart: string
  counterpartRole: string
  context: string
  turns: ScenarioTurn[]
  /** 종료 리포트용 문장 교정 가이드 */
  correctionGuide: string
  closing: string
}

export interface Grievance {
  id: string
  source: 'text' | 'voice'
  from: string
  dept: string
  content: string
  envData?: { temp: number; hours: number; zone: string }
  receivedAt: string
}

export interface BridgeProfile {
  id: string
  name: string
  dept: string
  role: string
  intro: string
  interests: string[]
}

export interface QuizQuestion {
  id: string
  category: 'listening' | 'meeting' | 'feedback'
  prompt: string
  passage?: string
  options: string[]
  answer: number
  explanation: string
}

export interface PulseCardSet {
  memberId: string
  cards: string[]
}

export interface VoiceReport {
  id: string
  content: string
  zone: string
  temp: number
  hours: number
  receivedAt: string
  improvementOptions: string[]
  explorationQuestions: string[]
}

export interface HrdClass {
  id: string
  title: string
  instructor: string
  schedule: string
  summary: string
}

export interface MileageRule {
  id: string
  label: string
  points: number
}
