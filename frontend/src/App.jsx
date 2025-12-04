import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Calculator from './components/Calculator'
import EmbedPage from './components/EmbedPage'
import DesktopPage from './components/DesktopPage'
import './App.css'

function HomePage() {
  const [isIframe, setIsIframe] = useState(false)

  useEffect(() => {
    setIsIframe(window.self !== window.top)
  }, [])

  return (
    <div className={`${isIframe ? 'min-h-fit' : 'min-h-screen'} ${isIframe ? 'bg-transparent' : 'bg-gradient-to-br from-primary-50 to-secondary-50'}`}>
      <div className={`${isIframe ? 'p-2' : 'container mx-auto px-4 py-8'}`}>
        <div className={`${isIframe ? 'w-full' : 'max-w-2xl mx-auto'}`}>
          <Calculator isIframe={isIframe} />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/embed" element={<EmbedPage />} />
        <Route path="/desktop" element={<DesktopPage />} />
      </Routes>
    </Router>
  )
}

export default App