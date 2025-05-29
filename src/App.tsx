import { Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import ProfessionalNewsPage from './components/ProfessionalNewsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/news" element={<ProfessionalNewsPage />} />
    </Routes>
  )
}

export default App
