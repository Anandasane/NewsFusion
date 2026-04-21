import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

import ExamPrepPage from './pages/ExamPrepPage'
import HomePage from './pages/HomePage'
import PersonalizedPage from './pages/PersonalizedPage'
import TrendingPage from './pages/TrendingPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/personalized" element={<PersonalizedPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/exam-prep" element={<ExamPrepPage />} />

      </Routes>
    </Layout>
  )
}
