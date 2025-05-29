import { Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import ProfessionalNewsPage from './components/ProfessionalNewsPage'
import MarketToolsPage from './components/MarketToolsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/news" element={<ProfessionalNewsPage />} />
      <Route path="/tools" element={<MarketToolsPage />} />
    </Routes>
  )
}

export default App
