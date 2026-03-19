import { useState, useEffect, useCallback } from 'react'
import { Heart, MessageCircle, Send, UserPlus, UserMinus, Bookmark, Share2, Image, Film, Zap, Users, Compass } from 'lucide-react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const PostCard = ({ post, me, onLike, onComment, onSave }) => {
  const [showC, setShowC] = useState(false)
  const [cText, setCText] = useState('')
  const [posting, setP]   = useState(false)
  const liked  = post.likes?.includes(me?._id)
  const saved  = post.saves?.includes(me?._id)
  const navigate = useNavigate()

  const submitComment = async e => {
    e.preventDefault()
    if (!cText.trim()) return
    setP(true)
    try { await onComment(post._id, cText); setCText('') } finally { setP(false) }
  }

  const typeLabel = { reel:'Reel', short:'Short', streak_milestone:'Streak', level_up:'Level Up', badge_earned:'Badge', post:'Post', custom:'Post' }
  const typeColor = { reel:'#bf00ff', short:'#ff0080', streak_milestone:'#ff6600', level_up:'#00f5ff', badge_earned:'#ffee00', post:'rgba(255,255,255,0.2)', custom:'rgba(255,255,255,0.2)' }

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)'}}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={()=>navigate(`/u/${post.user?.username}`)} className="flex-shrink-0">
          {post.user?.avatar
            ? <img src={post.user.avatar} className="w-10 h-10 rounded-full object-cover" style={{boxShadow:'0 0 0 2px rgba(0,245,255,0.3)'}}/>
            : <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-700 text-sm text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>{post.user?.name?.[0]?.toUpperCase()}</div>
          }
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button onClick={()=>navigate(`/u/${post.user?.username}`)} className="font-600 text-sm text-white hover:text-neon-cyan transition-colors">{post.user?.name}</button>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{background:`${typeColor[post.type]||'rgba(255,255,255,0.1)'}20`,color:typeColor[post.type]||'rgba(255,255,255,0.4)',border:`1px solid ${typeColor[post.type]||'rgba(255,255,255,0.1)'}30`}}>{typeLabel[post.type]}</span>
          </div>
          <div className="text-[10px] text-white/25 font-mono">{post.createdAt?formatDistanceToNow(new Date(post.createdAt),{addSuffix:true}):''}</div>
        </div>
        {post.user?.level&&<span className="text-xs font-mono flex-shrink-0" style={{color:'#00f5ff'}}>Lv{post.user.level}</span>}
      </div>

      {/* Media placeholder using SVG gradient */}
      {post.mediaUrl&&(
        <div className="mx-4 mb-3 rounded-xl overflow-hidden" style={{background:'rgba(0,245,255,0.05)',border:'1px solid rgba(0,245,255,0.1)'}}>
          {post.mediaType==='video'
            ? <video src={post.mediaUrl} controls className="w-full max-h-64 object-cover"/>
            : <img src={post.mediaUrl} alt="" className="w-full max-h-64 object-cover"/>
          }
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-white/70 leading-relaxed">{post.content}</p>
        {post.tags?.length>0&&<div className="flex flex-wrap gap-1 mt-2">{post.tags.map(t=><span key={t} className="text-xs font-mono" style={{color:'#00f5ff'}}>#{t}</span>)}</div>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 pb-3 border-t pt-3" style={{borderColor:'rgba(255,255,255,0.04)'}}>
        <button onClick={()=>onLike(post._id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${liked?'text-red-400':'text-white/30 hover:text-red-400'}`}>
          <Heart className="w-4 h-4" fill={liked?'currentColor':'none'}/>{post.likes?.length||0}
        </button>
        <button onClick={()=>setShowC(s=>!s)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-white/30 hover:text-neon-cyan transition-all">
          <MessageCircle className="w-4 h-4"/>{post.comments?.length||0}
        </button>
        <button onClick={()=>onSave(post._id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ml-auto ${saved?'text-neon-cyan':'text-white/30 hover:text-neon-cyan'}`}>
          <Bookmark className="w-4 h-4" fill={saved?'currentColor':'none'}/>
        </button>
      </div>

      {showC&&(
        <div className="px-4 pb-4 space-y-2">
          {post.comments?.slice(-3).map((c,i)=>(
            <div key={i} className="flex gap-2">
              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-700 text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>{c.user?.name?.[0]?.toUpperCase()}</div>
              <div className="rounded-xl px-3 py-2 flex-1" style={{background:'rgba(255,255,255,0.03)'}}>
                <span className="text-[10px] font-mono text-white/40">{c.user?.username} · </span>
                <span className="text-xs text-white/60">{c.text}</span>
              </div>
            </div>
          ))}
          <form onSubmit={submitComment} className="flex gap-2 mt-1">
            <input value={cText} onChange={e=>setCText(e.target.value)} className="input-neon flex-1 py-2 text-xs" placeholder="Add a comment…"/>
            <button type="submit" disabled={posting||!cText.trim()} className="btn-neon px-3 py-2"><Send className="w-3.5 h-3.5"/></button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function SocialPage() {
  const { user: me } = useAuth()
  const navigate     = useNavigate()
  const [tab, setTab]       = useState('feed')
  const [feed, setFeed]     = useState([])
  const [discover, setDisc] = useState([])
  const [loading, setL]     = useState(true)
  const [post, setPost]     = useState('')
  const [postType, setPT]   = useState('post')
  const [posting, setPosting] = useState(false)
  const [following, setFollowing] = useState(new Set(me?.following?.map(id=>id.toString())||[]))

  const load = useCallback(async () => {
    setL(true)
    try {
      if (tab==='feed') { const { data } = await api.get('/social/feed'); setFeed(data) }
      else if (tab==='explore') { const { data } = await api.get('/social/explore'); setFeed(data) }
      else { const { data } = await api.get('/social/discover'); setDisc(data) }
    } catch {} finally { setL(false) }
  },[tab])

  useEffect(()=>{ load() },[load])

  const handlePost = async e => {
    e.preventDefault()
    if (!post.trim()) return
    setPosting(true)
    try {
      const { data } = await api.post('/social', { content: post, type: postType })
      if (tab==='feed') setFeed(f=>[data,...f])
      setPost('')
      toast.success('Posted!')
    } catch { toast.error('Failed') } finally { setPosting(false) }
  }

  const handleLike = async id => {
    try {
      await api.post(`/social/${id}/like`)
      setFeed(f=>f.map(p=>{ if(p._id!==id)return p; const liked=p.likes?.includes(me?._id); return {...p,likes:liked?p.likes.filter(i=>i!==me?._id):[...(p.likes||[]),me?._id]} }))
    } catch {}
  }

  const handleComment = async (id, text) => {
    try {
      const { data } = await api.post(`/social/${id}/comment`,{text})
      setFeed(f=>f.map(p=>p._id!==id?p:{...p,comments:[...(p.comments||[]),data]}))
    } catch { toast.error('Failed') }
  }

  const handleSave = async id => {
    try { await api.post(`/social/${id}/like`) } catch {}
  }

  const handleFollow = async uid => {
    try {
      const { data } = await api.post(`/social/follow/${uid}`)
      setFollowing(s=>{ const n=new Set(s); if(data.following)n.add(uid); else n.delete(uid); return n })
      toast.success(data.following?'Following!':'Unfollowed')
    } catch {}
  }

  const TABS = [['feed','Feed'],['explore','Explore'],['people','People']]

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-800 text-2xl text-white flex items-center gap-2"><Users className="w-6 h-6 text-neon-cyan"/>Social</h1>
        <p className="text-white/30 text-sm font-mono mt-0.5">Share your wins</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
        {TABS.map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-600 transition-all ${tab===k?'text-black':'text-white/40 hover:text-white/70'}`}
            style={tab===k?{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}:{}}>
            {l}
          </button>
        ))}
      </div>

      {tab==='feed'&&(
        <div className="card">
          <div className="flex gap-1 mb-3 p-1 rounded-lg w-fit" style={{background:'rgba(255,255,255,0.02)'}}>
            {[['post','Post',null],['reel','Reel','#bf00ff'],['short','Short','#ff0080']].map(([t,l,c])=>(
              <button key={t} onClick={()=>setPT(t)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${postType===t?'text-black font-700':'text-white/40'}`}
                style={postType===t?{background:c||'linear-gradient(135deg,#00f5ff,#bf00ff)'}:{}}>
                {l}
              </button>
            ))}
          </div>
          <form onSubmit={handlePost}>
            <textarea value={post} onChange={e=>setPost(e.target.value)} className="input-neon resize-none text-sm w-full mb-3" rows={3} placeholder={`Share your ${postType}...`} maxLength={280}/>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/20">{post.length}/280</span>
              <button type="submit" disabled={posting||!post.trim()} className="btn-neon text-xs px-4 py-2 flex items-center gap-1.5">
                {posting?<span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"/>:<><Send className="w-3 h-3"/>Post</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading?(
        <div className="space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-32 rounded-2xl animate-pulse" style={{background:'rgba(255,255,255,0.03)'}}/>)}</div>
      ) : tab==='people'?(
        <div className="space-y-3">
          {discover.map(u=>(
            <div key={u._id} className="card flex items-center gap-4">
              <button onClick={()=>navigate(`/u/${u.username}`)}>
                {u.avatar?<img src={u.avatar} className="w-12 h-12 rounded-full object-cover" style={{boxShadow:'0 0 0 2px rgba(0,245,255,0.3)'}}/>
                  :<div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-800 text-sm text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>{u.name?.[0]?.toUpperCase()}</div>}
              </button>
              <div className="flex-1 min-w-0">
                <button onClick={()=>navigate(`/u/${u.username}`)} className="font-600 text-white hover:text-neon-cyan transition-colors">{u.name}</button>
                <div className="text-xs text-white/30 font-mono">@{u.username} · Lv{u.level}</div>
                <div className="text-[10px] text-white/20 font-mono">{u.xp} XP · {u.currentStreak}d streak</div>
              </div>
              {u._id!==me?._id&&(
                <button onClick={()=>handleFollow(u._id)}
                  className={`text-xs font-mono font-600 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all flex-shrink-0 ${following.has(u._id.toString())?'text-white/40 hover:text-red-400':'text-neon-cyan'}`}
                  style={following.has(u._id.toString())?{border:'1px solid rgba(255,255,255,0.1)'}:{border:'1px solid rgba(0,245,255,0.3)',background:'rgba(0,245,255,0.07)'}}>
                  {following.has(u._id.toString())?<><UserMinus className="w-3 h-3"/>Following</>:<><UserPlus className="w-3 h-3"/>Follow</>}
                </button>
              )}
            </div>
          ))}
        </div>
      ):(
        <div className="space-y-4">
          {feed.length===0?(
            <div className="text-center py-14" style={{border:'1px dashed rgba(0,245,255,0.1)',borderRadius:16}}>
              <Users className="w-10 h-10 mx-auto mb-3" style={{color:'rgba(0,245,255,0.2)'}}/>
              <p className="text-white/30 text-sm">No posts yet</p>
            </div>
          ):feed.map(p=><PostCard key={p._id} post={p} me={me} onLike={handleLike} onComment={handleComment} onSave={handleSave}/>)}
        </div>
      )}
    </div>
  )
}
