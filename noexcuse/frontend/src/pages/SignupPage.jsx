import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Zap, Eye, EyeOff, Mail, Lock, User, AtSign, CheckCircle, XCircle } from 'lucide-react'
import api from '../lib/api'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate   = useNavigate()
  const [f, setF]  = useState({ name:'', email:'', password:'', username:'' })
  const [show, setShow]   = useState(false)
  const [loading, setL]   = useState(false)
  const [unCheck, setUn]  = useState(null) // null | 'checking' | true | false
  const set = k => e => setF(p=>({...p,[k]:e.target.value}))

  const checkUsername = async (val) => {
    if (val.length < 3) { setUn(null); return }
    setUn('checking')
    try { const { data } = await api.get(`/auth/check-username/${val}`); setUn(data.available) }
    catch { setUn(null) }
  }

  const pw = f.password; let pwStr = 0
  if (pw.length>=6) pwStr++; if (pw.length>=10) pwStr++; if (/[A-Z]/.test(pw)) pwStr++; if (/[0-9]/.test(pw)) pwStr++; if (/[^A-Za-z0-9]/.test(pw)) pwStr++
  const pwColors = ['#ff0080','#ff0080','#f59e0b','#00f5ff','#00ff88']
  const pwLabels = ['','Weak','Fair','Good','Strong','Elite']

  const submit = async e => {
    e.preventDefault()
    if (!f.name||!f.email||!f.password||!f.username) return toast.error('All fields required')
    if (f.password.length<6) return toast.error('Password min 6 chars')
    if (unCheck===false) return toast.error('Username is taken')
    setL(true)
    try { await signup(f.name, f.email, f.password, f.username); toast.success('Account created!'); navigate('/dashboard') }
    catch(e) { toast.error(e.response?.data?.message||'Signup failed') }
    finally { setL(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 grid-bg">
      <div className="w-full max-w-md animate-scale-in">
        <Link to="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',boxShadow:'0 0 20px rgba(0,245,255,0.4)'}}>
            <Zap className="w-5 h-5 text-black" fill="currentColor"/>
          </div>
          <span className="font-display font-800 text-xl text-gradient-neon">NoExcuse.ai</span>
        </Link>

        <div className="rounded-2xl p-8" style={{background:'rgba(5,5,16,0.9)',border:'1px solid rgba(0,245,255,0.12)',backdropFilter:'blur(20px)',boxShadow:'0 0 60px rgba(0,245,255,0.06)'}}>
          <h1 className="font-display font-800 text-2xl text-white mb-1">Create your account</h1>
          <p className="text-white/30 text-sm mb-8">Join 50,000+ performers. No excuses, just results.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"/>
                <input value={f.name} onChange={set('name')} className="input-neon pl-10" placeholder="Alex Johnson"/></div>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Username</label>
              <div className="relative"><AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"/>
                <input value={f.username} onChange={e=>{set('username')(e);checkUsername(e.target.value)}} className="input-neon pl-10 pr-10" placeholder="alexjohnson" pattern="[a-z0-9_.]{3,30}"/>
                {unCheck==='checking' && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border border-neon-cyan border-t-transparent rounded-full animate-spin"/>}
                {unCheck===true  && <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'#00ff88'}}/>}
                {unCheck===false && <XCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'#ff0080'}}/>}
              </div>
              {unCheck===false && <p className="text-xs mt-1" style={{color:'#ff0080'}}>Username taken — try another</p>}
            </div>

            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Email</label>
              <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"/>
                <input value={f.email} onChange={set('email')} type="email" className="input-neon pl-10" placeholder="you@example.com"/></div>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Password</label>
              <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"/>
                <input value={f.password} onChange={set('password')} type={show?'text':'password'} className="input-neon pl-10 pr-10" placeholder="Min 6 characters"/>
                <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60">
                  {show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                </button>
              </div>
              {f.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">{[...Array(5)].map((_,i)=><div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{background:i<pwStr?pwColors[pwStr-1]:'rgba(255,255,255,0.06)'}}/>)}</div>
                  <span className="text-xs font-mono text-white/30">{pwLabels[pwStr]}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading||unCheck===false} className="btn-neon w-full py-3.5 text-sm font-700 mt-2">
              {loading?<span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto block"/>:'Create Account — Free'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t text-center" style={{borderColor:'rgba(255,255,255,0.06)'}}>
            <p className="text-sm text-white/30">Have an account? <Link to="/login" className="font-600 text-neon-cyan hover:text-white transition-colors">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
