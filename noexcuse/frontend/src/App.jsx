import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppLayout      from './components/layout/AppLayout'
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import SignupPage     from './pages/SignupPage'
import DashboardPage  from './pages/DashboardPage'

const Guard = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

const Public = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Public><LandingPage/></Public>} />
          <Route path="/login" element={<Public><LoginPage/></Public>} />
          <Route path="/signup" element={<Public><SignupPage/></Public>} />
          <Route element={<Guard><AppLayout/></Guard>}>
            <Route path="/dashboard" element={<DashboardPage/>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  )
}