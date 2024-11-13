import './App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import { setupAxiosInterceptor } from './api/axiosInstance'

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setupAxiosInterceptor(navigate)
  }, [navigate])

  useEffect(() => {
    let lastTouchEnd = 0

    const handleTouchEnd = (event: TouchEvent) => {
      const now = new Date().getTime()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }

    const preventPinchZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    }
    document.addEventListener('touchend', handleTouchEnd, { passive: false })
    document.addEventListener('touchstart', preventPinchZoom)

    return () => {
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchstart', preventPinchZoom)
    }
  }, [])

  return (
    <div className="App">
      <AppRoutes />
      {location.pathname !== '/login' && <Footer />}
    </div>
  )
}

export default App
