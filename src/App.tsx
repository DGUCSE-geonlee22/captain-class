import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CurriculumPage from './pages/CurriculumPage'
import WeekPage from './pages/WeekPage'
import CourseDetailPage from './pages/CourseDetailPage'
import ReframingPage from './pages/compassion/ReframingPage'
import LensPage from './pages/compassion/LensPage'
import PulsePage from './pages/collab/PulsePage'
import CoachingPage from './pages/collab/CoachingPage'
import LeaderAIPage from './pages/leadership/LeaderAIPage'
import LeadersPage from './pages/leadership/LeadersPage'
import CoachingSessionPage from './pages/leadership/CoachingSessionPage'
import GrowthPlanPage from './pages/leadership/GrowthPlanPage'
import DiagnosisPage from './pages/construction/DiagnosisPage'
import FieldMissionPage from './pages/construction/FieldMissionPage'
import PnancheoPage from './pages/PnancheoPage'
import PracticePage from './pages/PracticePage'
import BridgePage from './pages/BridgePage'
import RecordsPage from './pages/RecordsPage'
import CompletionPage from './pages/CompletionPage'
import NotFoundPage from './pages/NotFoundPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// HashRouter: 정적 서버(학교 서버·GitHub Pages 등)의 하위 폴더에서도 새로고침 404 없이 동작
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/curriculum/week/:week" element={<WeekPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/compassion/reframing" element={<ReframingPage />} />
          <Route path="/course/compassion/lens" element={<LensPage />} />
          <Route path="/course/collab-comm/pulse" element={<PulsePage />} />
          <Route path="/course/collab-comm/coaching" element={<CoachingPage />} />
          <Route path="/course/charisma-character/leaders" element={<LeadersPage />} />
          <Route path="/course/charisma-character/leader-ai" element={<LeaderAIPage />} />
          <Route path="/course/coaching/session" element={<CoachingSessionPage />} />
          <Route path="/course/coaching/growth" element={<GrowthPlanPage />} />
          <Route path="/course/construction/diagnosis" element={<DiagnosisPage />} />
          <Route path="/course/construction/field-mission" element={<FieldMissionPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/pnancheo" element={<PnancheoPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/bridge" element={<BridgePage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/completion" element={<CompletionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
