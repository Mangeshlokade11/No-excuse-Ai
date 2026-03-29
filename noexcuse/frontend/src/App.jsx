import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import PlanPage from './pages/PlanPage'
import SocialPage from './pages/SocialPage'
import MessagesPage from './pages/MessagesPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'
import UserProfilePage from './pages/UserProfilePage'

const Guard = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen grid place-items-center"><div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" style={{boxShadow:'0 0 15px rgba(0,245,255,0.5)'}}/></div>
  return user ? children : <Navigate to="/login" replace />
}

const Public = ({ children }) => {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Public><LandingPage/></Public>}/>
          <Route path="/login" element={<Public><LoginPage/></Public>}/>
          <Route path="/signup" element={<Public><SignupPage/></Public>}/>
          <Route element={<Guard><AppLayout/></Guard>}>
            <Route path="/dashboard" element={<DashboardPage/>}/>
            <Route path="/analytics" element={<AnalyticsPage/>}/>
            <Route path="/plans" element={<PlanPage/>}/>
            <Route path="/social" element={<SocialPage/>}/>
            <Route path="/messages" element={<MessagesPage/>}/>
            <Route path="/leaderboard" element={<LeaderboardPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/u/:username" element={<UserProfilePage/>}/>
          </Route>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
        <Toaster position="top-right" toastOptions={{
          style:{ background:'#08081a', color:'#fff', border:'1px solid rgba(0,245,255,0.2)', borderRadius:'12px', fontSize:'14px', fontFamily:'"DM Sans",sans-serif', boxShadow:'0 0 20px rgba(0,245,255,0.1)' },
          success:{ iconTheme:{ primary:'#00ff88', secondary:'#000' } },
          error:{   iconTheme:{ primary:'#ff0080', secondary:'#fff' } },
        }}/>
      </BrowserRouter>
    </AuthProvider>
  )
}