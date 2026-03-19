import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Edit3, Save, Camera, Bell, Moon, Globe, MapPin, Link, ShieldCheck, AtSign } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import ScoreGraph from '../components/dashboard/ScoreGraph'

const ALL_BADGES = [
  {name:'First Step',icon:'🌱'},{name:'Week Warrior',icon:'🔥'},{name:'Fortnight Force',icon:'⚡'},
  {name:'Month Master',icon:'👑'},{name:'Century Club',icon:'💯'},{name:'Rising Star',icon:'⭐'},
  {name:'Elite Performer',icon:'🏆'},{name:'Iron Discipline',icon:'🦾'},{name:'Connector',icon:'🤝'},
  {name:'Half Century',icon:'🎯'},{name:'Legend',icon:'🌟'},{name:'1K Club',icon:'💎'},
]

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEdit]  = useState(false)
  const [saving, setSav]    = useState(false)
  const [form, setForm]     = useState({
    name: user?.name||'', username: user?.username||'', bio: user?.bio||'',
    location: user?.location||'', website: user?.website||'',
    emailNotifications: user?.emailNotifications??true,
    notifyOnLogin: user?.notifyOnLogin??true,
    notifyOnGoal: user?.notifyOnGoal??true,
    isPrivate: user?.isPrivate??false
  })

  const set = k => v => setForm(p=>({...p,[k]:v}))

  const handleAvatarUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const { data } = await api.put('/users/me/update', { avatar: reader.result })
        updateUser({ avatar: data.avatar })
        toast.success('Avatar updated!')
      } catch { toast.error('Upload failed') }
    }
    reader.readAsDataURL(file)
  }

  const save = async () => {
    setSav(true)
    try {
      const { data } = await api.put('/users/me/update', form)
      updateUser(data)
      setEdit(false)
      toast.success('Profile updated!')
    } catch(e) { toast.error(e.response?.data?.message||'Failed') }
    finally { setSav(false) }
  }

  const xpNext = (user?.level||1)*100
  const xpIn   = (user?.xp||0)%xpNext
  const xpPct  = Math.min(Math.round(xpIn/xpNext*100),100)

  const Toggle = ({ label, sub, value, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b" style={{borderColor:'rgba(255,255,255,0.05)'}}>
      <div><div className="text-sm text-white">{label}</div>{sub&&<div className="text-xs text-white/30 mt-0.5">{sub}</div>}</div>
      <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value?'bg-neon-cyan':'bg-white/10'}`}
        style={value?{boxShadow:'0 0 10px rgba(0,245,255,0.4)'}:{}}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${value?'left-5':'left-0.5'}`}/>
      </button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-800 text-2xl text-white">Profile</h1>
        {editing
          ? <div className="flex gap-2">
              <button onClick={()=>setEdit(false)} className="btn-outline text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-neon text-sm px-4 py-2 flex items-center gap-2">
                {saving?<span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"/>:<Save className="w-3.5 h-3.5"/>}Save
              </button>
            </div>
          : <button onClick={()=>setEdit(true)} className="btn-ghost-neon text-sm flex items-center gap-2"><Edit3 className="w-3.5 h-3.5"/>Edit Profile</button>
        }
      </div>

      {/* Avatar + name card */}
      <div className="card">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            {user?.avatar?<img src={user.avatar} className="w-20 h-20 rounded-2xl object-cover" style={{boxShadow:'0 0 0 2px rgba(0,245,255,0.4),0 0 20px rgba(0,245,255,0.2)'}}/>
              :<div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-900 text-3xl text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',boxShadow:'0 0 20px rgba(0,245,255,0.4)'}}>{user?.name?.[0]?.toUpperCase()}</div>}
            <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>
              <Camera className="w-3.5 h-3.5 text-black"/>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload}/>
            </label>
          </div>
          <div className="flex-1 min-w-0">
            {editing?(
              <div className="space-y-3">
                <input value={form.name} onChange={e=>set('name')(e.target.value)} className="input-neon font-700 text-lg py-2"/>
                <div className="relative"><AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"/>
                  <input value={form.username} onChange={e=>set('username')(e.target.value)} className="input-neon pl-9" placeholder="username"/>
                </div>
                <textarea value={form.bio} onChange={e=>set('bio')(e.target.value)} className="input-neon resize-none text-sm" rows={2} placeholder="Your bio…" maxLength={200}/>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20"/>
                    <input value={form.location} onChange={e=>set('location')(e.target.value)} className="input-neon pl-8 text-sm py-2" placeholder="Location"/>
                  </div>
                  <div className="relative"><Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20"/>
                    <input value={form.website} onChange={e=>set('website')(e.target.value)} className="input-neon pl-8 text-sm py-2" placeholder="Website"/>
                  </div>
                </div>
              </div>
            ):(
              <>
                <h2 className="font-display font-800 text-xl text-white">{user?.name}</h2>
                <div className="font-mono text-sm mt-0.5" style={{color:'rgba(0,245,255,0.7)'}}>@{user?.username}</div>
                {user?.bio&&<p className="text-sm text-white/50 mt-2 leading-relaxed">{user.bio}</p>}
                <div className="flex flex-wrap gap-3 mt-2">
                  {user?.location&&<span className="text-xs text-white/30 flex items-center gap-1"><MapPin className="w-3 h-3"/>{user.location}</span>}
                  {user?.website&&<a href={user.website} target="_blank" rel="noopener noreferrer" className="text-xs text-neon-cyan flex items-center gap-1 hover:underline"><Link className="w-3 h-3"/>{user.website}</a>}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-5 pt-4 border-t" style={{borderColor:'rgba(255,255,255,0.05)'}}>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-white/40">Level {user?.level} Progress</span>
            <span className="font-mono" style={{color:'#00f5ff'}}>{xpIn}/{xpNext} XP</span>
          </div>
          <div className="xp-track"><div className="xp-fill" style={{width:`${xpPct}%`}}/></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{l:'Total XP',v:user?.xp||0,c:'#00f5ff',i:'⚡'},{l:'Streak',v:`${user?.currentStreak||0}d`,c:'#ff6600',i:'🔥'},{l:'Best Streak',v:`${user?.longestStreak||0}d`,c:'#ffee00',i:'👑'},{l:'Completed',v:user?.totalHabitsCompleted||0,c:'#00ff88',i:'✅'}].map(s=>(
          <div key={s.l} className="rounded-xl p-4 text-center" style={{background:`${s.c}08`,border:`1px solid ${s.c}20`}}>
            <div className="text-xl mb-1">{s.i}</div>
            <div className="font-display font-800 text-xl" style={{color:s.c}}>{s.v}</div>
            <div className="text-[10px] text-white/30 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Social counts */}
      <div className="card">
        <div className="flex gap-8">
          {[['Following',user?.following?.length||0],['Followers',user?.followers?.length||0],['Badges',user?.badges?.length||0]].map(([l,v])=>(
            <div key={l} className="text-center">
              <div className="font-display font-800 text-2xl text-white">{v}</div>
              <div className="text-xs text-white/30 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="card">
        <h2 className="font-display font-700 text-white mb-4">30-Day Progress</h2>
        <ScoreGraph userId={user?._id}/>
      </div>

      {/* Badges */}
      <div className="card">
        <h2 className="font-display font-700 text-white mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {ALL_BADGES.map(b=>{
            const earned = user?.badges?.some(ub=>ub.name===b.name)
            return (
              <div key={b.name} title={b.name}
                className={`flex flex-col items-center p-2 rounded-xl transition-all ${earned?'':'opacity-25 grayscale'}`}
                style={earned?{background:'rgba(0,245,255,0.08)',border:'1px solid rgba(0,245,255,0.2)'}:{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)'}}>
                <span className="text-2xl">{b.icon}</span>
                <span className="text-[8px] text-center text-white/40 mt-1 leading-tight">{b.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h2 className="font-display font-700 text-white mb-4">Notifications & Privacy</h2>
        <Toggle label="Daily Summary Email" sub="AI-powered nightly summary" value={form.emailNotifications} onChange={()=>editing&&set('emailNotifications')(!form.emailNotifications)}/>
        <Toggle label="Login Alerts" sub="Email when account signs in" value={form.notifyOnLogin} onChange={()=>editing&&set('notifyOnLogin')(!form.notifyOnLogin)}/>
        <Toggle label="Goal Completion Emails" sub="Email when you complete a habit" value={form.notifyOnGoal} onChange={()=>editing&&set('notifyOnGoal')(!form.notifyOnGoal)}/>
        <Toggle label="Private Account" sub="Only followers can see your posts" value={form.isPrivate} onChange={()=>editing&&set('isPrivate')(!form.isPrivate)}/>
        {!editing&&<p className="text-xs text-white/20 font-mono mt-3">Click "Edit Profile" to change these settings</p>}
      </div>

      <div className="card" style={{borderColor:'rgba(255,0,128,0.15)'}}>
        <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-4 h-4 text-white/30"/><h2 className="font-700 text-white text-sm">Account</h2></div>
        <p className="text-xs text-white/25">Member since {user?.createdAt?new Date(user.createdAt).toLocaleDateString('en-US',{month:'long',year:'numeric'}):'N/A'}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-mono px-2 py-1 rounded-lg capitalize" style={{background:`rgba(0,245,255,0.1)`,color:'#00f5ff',border:'1px solid rgba(0,245,255,0.2)'}}>{user?.plan||'free'} plan</span>
        </div>
      </div>
    </div>
  )
}
