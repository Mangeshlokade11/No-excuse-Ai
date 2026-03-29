import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Zap, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [f, setF] = useState({ email:'', password:'' })
  const [show, setShow] = useState(false)
  const [loading, setL] = useState(false)
  const set = k => e => setF(p=>({...p,[k]:e.target.value}))

  const submit = async e => {
    e.preventDefault()
    if (!f.email || !f.password) return toast.error('All fields required')
    setL(true)
    try {
      await login(f.email, f.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch(e) {
      toast.error(e.response?.data?.message || 'Login failed')
    } finally { setL(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-bg">
      <div className="w-full max-w-md animate-scale-in">
        <Link to="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',boxShadow:'0 0 20px rgba(0,245,255,0.4)'}}>
            <Zap className="w-5 h-5 text-black" fill="currentColor"/>
          </div>
          <span className="font-display font-800 text-xl text-gradient-neon">NoExcuse.ai</span>
        </Link>

        <div className="rounded-2xl p-8" style={{background:'rgba(5,5,16,0.9)',border:'1px solid rgba(0,245,255,0.12)',backdropFilter:'blur(20px)',boxShadow:'0 0 60px rgba(0,245,255,0.06)'}}>
          <h1 className="font-display font-800 text-2xl text-white mb-1">Welcome back</h1>
          <p className="text-white/30 text-sm mb-8">Continue your streak. No excuses.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"/>
                <input value={f.email} onChange={set('email')} type="email" className="input-neon pl-10" placeholder="you@example.com"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"/>
                <input value={f.password} onChange={set('password')} type={show?'text':'password'} className="input-neon pl-10 pr-10" placeholder="••••••••"/>
                <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60">
                  {show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-neon w-full py-3.5 flex items-center justify-center gap-2 text-sm font-700 mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/> : <><span>Sign In</span><ArrowRight className="w-4 h-4"/></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t text-center" style={{borderColor:'rgba(255,255,255,0.06)'}}>
            <p className="text-sm text-white/30">No account? <Link to="/signup" className="font-600 text-neon-cyan hover:text-white transition-colors">Create one free</Link></p>
          </div>
        </div>
        <p className="text-center text-xs text-white/15 font-mono mt-6">"Discipline is the bridge between goals and accomplishment."</p>
      </div>
    </div>
  )
}