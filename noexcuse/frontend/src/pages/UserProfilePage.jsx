import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus, UserMinus, MessageSquare, MapPin, Link as LinkIcon, ArrowLeft } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import ScoreGraph from '../components/dashboard/ScoreGraph'

export default function UserProfilePage() {
  const { username }   = useParams()
  const { user: me }   = useAuth()
  const navigate       = useNavigate()
  const [profile, setP]    = useState(null)
  const [posts, setPosts]  = useState([])
  const [loading, setL]    = useState(true)
  const [isFollowing, setF] = useState(false)

  useEffect(()=>{
    setL(true)
    api.get(`/users/by-username/${username}`)
      .then(({ data }) => {
        setP(data)
        setF(data.followers?.some(id=>id?.toString()===me?._id?.toString()))
        return api.get(`/social/user/${data._id}`)
      })
      .then(({ data }) => setPosts(data))
      .catch(() => {})
      .finally(() => setL(false))
  },[username, me?._id])

  const follow = async () => {
    if (!profile) return
    try {
      const { data } = await api.post(`/social/follow/${profile._id}`)
      setF(data.following)
      setP(p=>({...p, followers: data.following ? [...(p.followers||[]),me?._id] : (p.followers||[]).filter(id=>id?.toString()!==me?._id?.toString())}))
      toast.success(data.following?'Following!':'Unfollowed')
    } catch { toast.error('Failed') }
  }

  const isMe = profile?._id?.toString() === me?._id?.toString()
  const xpNext = (profile?.level||1)*100
  const xpPct  = Math.min(Math.round(((profile?.xp||0)%xpNext)/xpNext*100),100)

  if (loading) return <div className="min-h-96 grid place-items-center"><div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"/></div>
  if (!profile) return (
    <div className="text-center py-20">
      <div className="font-display font-800 text-white text-2xl mb-2">User not found</div>
      <p className="text-white/30 mb-5">@{username} doesn't exist</p>
      <button onClick={()=>navigate('/search')} className="btn-ghost-neon text-sm">Search users</button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4"/> Back
      </button>

      {/* Profile header */}
      <div className="card">
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0">
            {profile.avatar?<img src={profile.avatar} className="w-20 h-20 rounded-2xl object-cover" style={{boxShadow:'0 0 0 2px rgba(0,245,255,0.4)'}}/>
              :<div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-900 text-3xl text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>{profile.name?.[0]?.toUpperCase()}</div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-800 text-xl text-white">{profile.name}</h1>
              {profile.isVerified&&<span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{background:'rgba(0,245,255,0.1)',color:'#00f5ff',border:'1px solid rgba(0,245,255,0.2)'}}>✓ Verified</span>}
              <span className="text-xs font-mono px-2 py-0.5 rounded-full capitalize" style={{background:'rgba(0,245,255,0.08)',color:'rgba(0,245,255,0.7)'}}>Lv{profile.level}</span>
            </div>
            <div className="font-mono text-sm mt-0.5" style={{color:'rgba(0,245,255,0.6)'}}>@{profile.username}</div>
            {profile.bio&&<p className="text-sm text-white/50 mt-2">{profile.bio}</p>}
            <div className="flex flex-wrap gap-3 mt-2">
              {profile.location&&<span className="text-xs text-white/30 flex items-center gap-1"><MapPin className="w-3 h-3"/>{profile.location}</span>}
              {profile.website&&<a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-xs text-neon-cyan flex items-center gap-1 hover:underline"><LinkIcon className="w-3 h-3"/>{profile.website}</a>}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t" style={{borderColor:'rgba(255,255,255,0.05)'}}>
          <div className="xp-track mb-1"><div className="xp-fill" style={{width:`${xpPct}%`}}/></div>
          <div className="flex justify-between text-[10px] font-mono text-white/25 mb-4">
            <span>Level {profile.level}</span><span>{profile.xp} XP</span>
          </div>
          <div className="flex items-center gap-6 mb-4">
            {[['Following',profile.following?.length||0],['Followers',profile.followers?.length||0],['Badges',profile.badges?.length||0]].map(([l,v])=>(
              <div key={l} className="text-center"><div className="font-display font-800 text-lg text-white">{v}</div><div className="text-[10px] text-white/30">{l}</div></div>
            ))}
            <div className="text-center"><div className="font-display font-800 text-lg" style={{color:'#ff6600'}}>{profile.currentStreak}d</div><div className="text-[10px] text-white/30">Streak</div></div>
            <div className="text-center"><div className="font-display font-800 text-lg" style={{color:'#bf00ff'}}>{profile.disciplineScore}%</div><div className="text-[10px] text-white/30">Discipline</div></div>
          </div>
          {!isMe&&(
            <div className="flex gap-2">
              <button onClick={follow}
                className={`flex items-center gap-2 text-sm font-700 px-4 py-2 rounded-xl flex-1 justify-center transition-all ${isFollowing?'text-white/50 hover:text-red-400':'btn-neon'}`}
                style={isFollowing?{border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.03)'}:{}}>
                {isFollowing?<><UserMinus className="w-4 h-4"/>Following</>:<><UserPlus className="w-4 h-4"/>Follow</>}
              </button>
              <button onClick={()=>navigate('/messages')} className="btn-ghost-neon flex items-center gap-2 text-sm px-4 py-2">
                <MessageSquare className="w-4 h-4"/>Message
              </button>
            </div>
          )}
          {isMe&&<button onClick={()=>navigate('/profile')} className="btn-ghost-neon w-full text-sm">Edit My Profile</button>}
        </div>
      </div>

      {/* Progress graph */}
      <div className="card">
        <h2 className="font-display font-700 text-white mb-4">30-Day Progress</h2>
        <ScoreGraph userId={profile._id}/>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        <h2 className="font-display font-700 text-white">Posts ({posts.length})</h2>
        {posts.length===0?(
          <div className="text-center py-10 text-white/20 font-mono text-sm">No posts yet</div>
        ):posts.map(p=>(
          <div key={p._id} className="card">
            <p className="text-sm text-white/70 leading-relaxed">{p.content}</p>
            <div className="flex items-center gap-3 mt-3 text-xs font-mono text-white/25">
              <span>{p.likes?.length||0} likes</span>
              <span>{p.comments?.length||0} comments</span>
              <span className="capitalize">{p.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
