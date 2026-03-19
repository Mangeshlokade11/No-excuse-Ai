import { useState, useCallback } from 'react'
import { Search, UserPlus, UserMinus } from 'lucide-react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function SearchPage() {
  const { user: me } = useAuth()
  const navigate     = useNavigate()
  const [q, setQ]         = useState('')
  const [results, setRes] = useState([])
  const [loading, setL]   = useState(false)
  const [following, setF] = useState(new Set(me?.following?.map(id=>id.toString())||[]))

  const search = useCallback(async (val) => {
    setQ(val)
    if (val.length<2) { setRes([]); return }
    setL(true)
    try { const { data } = await api.get(`/users/search?q=${val}`); setRes(data) }
    catch {} finally { setL(false) }
  },[])

  const follow = async uid => {
    try {
      const { data } = await api.post(`/social/follow/${uid}`)
      setF(s=>{ const n=new Set(s); if(data.following)n.add(uid); else n.delete(uid); return n })
      toast.success(data.following?'Following!':'Unfollowed')
    } catch { toast.error('Failed') }
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-800 text-2xl text-white flex items-center gap-2"><Search className="w-6 h-6 text-neon-cyan"/>Search</h1>
        <p className="text-white/30 text-sm font-mono mt-0.5">Find users by name or @username</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"/>
        <input value={q} onChange={e=>search(e.target.value)} className="input-neon pl-11 py-4 text-base" placeholder="Search @username or name…" autoFocus/>
        {loading&&<div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"/>}
      </div>

      {q.length>=2&&results.length===0&&!loading&&(
        <div className="text-center py-12 text-white/20 font-mono text-sm">No users found for "{q}"</div>
      )}

      {q.length<2&&(
        <div className="text-center py-12" style={{border:'1px dashed rgba(0,245,255,0.08)',borderRadius:16}}>
          <Search className="w-10 h-10 mx-auto mb-3" style={{color:'rgba(0,245,255,0.15)'}}/>
          <p className="text-white/20 font-mono text-sm">Type at least 2 characters to search</p>
        </div>
      )}

      <div className="space-y-3">
        {results.map(u=>(
          <div key={u._id} className="card flex items-center gap-4 group">
            <button onClick={()=>navigate(`/u/${u.username}`)} className="flex-shrink-0">
              {u.avatar?<img src={u.avatar} className="w-14 h-14 rounded-xl object-cover" style={{boxShadow:'0 0 0 2px rgba(0,245,255,0.3)'}}/>
                :<div className="w-14 h-14 rounded-xl flex items-center justify-center font-display font-800 text-xl text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>{u.name?.[0]?.toUpperCase()}</div>}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <button onClick={()=>navigate(`/u/${u.username}`)} className="font-display font-700 text-white hover:text-neon-cyan transition-colors">{u.name}</button>
                {u.isVerified&&<span className="text-[10px] font-mono" style={{color:'#00f5ff'}}>✓ Verified</span>}
              </div>
              <div className="text-sm font-mono" style={{color:'rgba(0,245,255,0.6)'}}>@{u.username}</div>
              <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-white/30">
                <span>Lv{u.level}</span>
                <span>{u.xp} XP</span>
                <span>{u.currentStreak}d streak</span>
                <span>{u.disciplineScore}% disc.</span>
              </div>
            </div>
            {u._id!==me?._id&&(
              <button onClick={()=>follow(u._id.toString())}
                className={`flex items-center gap-1.5 text-xs font-mono font-600 px-3 py-2 rounded-xl flex-shrink-0 transition-all ${following.has(u._id.toString())?'text-white/40 hover:text-red-400':'text-neon-cyan'}`}
                style={following.has(u._id.toString())?{border:'1px solid rgba(255,255,255,0.08)'}:{border:'1px solid rgba(0,245,255,0.3)',background:'rgba(0,245,255,0.07)'}}>
                {following.has(u._id.toString())?<><UserMinus className="w-3 h-3"/>Following</>:<><UserPlus className="w-3 h-3"/>Follow</>}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
