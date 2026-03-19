import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, BarChart3, Target, Users, MessageSquare, Trophy, User, Search, LogOut, Zap, Menu, X, Bell } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to:'/dashboard',   icon:LayoutDashboard, label:'Dashboard' },
  { to:'/analytics',   icon:BarChart3,       label:'Analytics' },
  { to:'/plans',       icon:Target,          label:'Plans'     },
  { to:'/social',      icon:Users,           label:'Social'    },
  { to:'/messages',    icon:MessageSquare,   label:'Messages'  },
  { to:'/leaderboard', icon:Trophy,          label:'Rankings'  },
  { to:'/search',      icon:Search,          label:'Search'    },
  { to:'/profile',     icon:User,            label:'Profile'   },
]

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',boxShadow:'0 0 20px rgba(0,245,255,0.4)'}}>
      <Zap className="w-5 h-5 text-black" fill="currentColor"/>
    </div>
    <div>
      <div className="font-display font-800 text-sm leading-none text-gradient-neon tracking-tight">NoExcuse.ai</div>
      <div className="text-[9px] text-white/30 font-mono tracking-[2px] uppercase mt-0.5">v2.0</div>
    </div>
  </div>
)

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [open, setOpen]  = useState(false)

  const xpNext = (user?.level||1)*100
  const xpIn   = (user?.xp||0) % xpNext
  const xpPct  = Math.min(Math.round(xpIn/xpNext*100), 100)

  const SideContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/[0.04]">
        <Logo/>
      </div>

      {user && (
        <div className="px-4 py-4 border-b border-white/[0.04]">
          <div className="rounded-xl p-3" style={{background:'rgba(0,245,255,0.04)',border:'1px solid rgba(0,245,255,0.1)'}}>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-shrink-0">
                {user.avatar
                  ? <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" style={{boxShadow:'0 0 0 2px rgba(0,245,255,0.3)'}}/>
                  : <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-700 text-sm text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>{user.name?.[0]?.toUpperCase()}</div>
                }
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-dark-800" style={{background:'#00ff88',boxShadow:'0 0 6px #00ff88'}}/>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display font-700 text-white text-sm truncate">{user.name}</div>
                <div className="text-xs text-white/30 font-mono truncate">@{user.username}</div>
              </div>
              {user.currentStreak>0 && (
                <div className="flex-shrink-0 text-xs font-700 font-mono" style={{color:'#ff6600',textShadow:'0 0 8px rgba(255,102,0,0.6)'}}>
                  {user.currentStreak}d
                </div>
              )}
            </div>
            <div className="xp-track mb-1">
              <div className="xp-fill" style={{width:`${xpPct}%`}}/>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/25 font-mono">LVL {user.level}</span>
              <span className="text-[10px] font-mono" style={{color:'#00f5ff'}}>{xpPct}%</span>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto no-scroll">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
               ${isActive ? 'nav-active font-600' : 'text-white/40 hover:text-white/80 border-transparent hover:bg-white/[0.03]'}`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0"/>
            <span className="font-body">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 border-t border-white/[0.04] pt-3">
        <button onClick={() => { logout(); navigate('/') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200">
          <LogOut className="w-4 h-4"/>
          <span>Sign Out</span>
        </button>
        <div className="mt-3 px-3">
          <div className="text-[10px] text-white/15 font-mono">NoExcuse.ai © 2025</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 fixed h-full" style={{background:'rgba(5,5,16,0.95)',backdropFilter:'blur(20px)',borderRight:'1px solid rgba(255,255,255,0.05)'}}>
        <SideContent/>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}/>
          <aside className="relative w-64 flex flex-col h-full" style={{background:'rgba(5,5,16,0.98)',backdropFilter:'blur(20px)',borderRight:'1px solid rgba(0,245,255,0.1)'}}>
            <SideContent/>
          </aside>
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white p-2">
            <X className="w-5 h-5"/>
          </button>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40" style={{background:'rgba(5,5,16,0.95)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <Logo/>
          <button onClick={() => setOpen(true)} className="text-white/50 hover:text-white p-1">
            <Menu className="w-5 h-5"/>
          </button>
        </header>
        <div className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full page-enter">
          <Outlet/>
        </div>
      </main>
    </div>
  )
}
