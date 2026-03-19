import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, MessageSquare, Search, ArrowLeft } from 'lucide-react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const { user: me } = useAuth()
  const [convos, setConvos]   = useState([])
  const [active, setActive]   = useState(null)
  const [msgs, setMsgs]       = useState([])
  const [text, setText]       = useState('')
  const [loading, setL]       = useState(true)
  const [searching, setSrch]  = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [results, setResults] = useState([])
  const [sending, setSend]    = useState(false)
  const bottomRef = useRef(null)

  useEffect(()=>{
    api.get('/messages/conversations').then(({data})=>setConvos(data)).catch(()=>{}).finally(()=>setL(false))
  },[])

  useEffect(()=>{
    if (!active) return
    api.get(`/messages/${active._id}`).then(({data})=>setMsgs(data)).catch(()=>{})
  },[active])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])

  const search = async q => {
    setSearchQ(q)
    if (q.length<2) { setResults([]); return }
    try { const { data } = await api.get(`/users/search?q=${q}`); setResults(data) } catch {}
  }

  const send = async e => {
    e.preventDefault()
    if (!text.trim()||!active) return
    setSend(true)
    try {
      const { data } = await api.post(`/messages/${active._id}`, { text })
      setMsgs(m=>[...m,data])
      setText('')
    } catch { toast.error('Failed to send') } finally { setSend(false) }
  }

  const startConvo = async user => {
    setActive(user)
    setSrch(false)
    setSearchQ('')
    setResults([])
  }

  return (
    <div className="flex gap-0 rounded-2xl overflow-hidden" style={{height:'calc(100vh - 140px)',border:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.01)'}}>
      {/* Sidebar */}
      <div className={`${active?'hidden lg:flex':''} flex flex-col w-full lg:w-72 flex-shrink-0 border-r`} style={{borderColor:'rgba(255,255,255,0.05)'}}>
        <div className="p-4 border-b" style={{borderColor:'rgba(255,255,255,0.05)'}}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-700 text-white">Messages</h2>
            <button onClick={()=>setSrch(s=>!s)} className={`p-1.5 rounded-lg transition-all ${searching?'text-neon-cyan bg-neon-cyan/10':'text-white/30 hover:text-white'}`}><Search className="w-4 h-4"/></button>
          </div>
          {searching&&(
            <div>
              <input value={searchQ} onChange={e=>search(e.target.value)} className="input-neon text-sm py-2" placeholder="Search users…" autoFocus/>
              {results.length>0&&(
                <div className="mt-2 space-y-1">
                  {results.map(u=>(
                    <button key={u._id} onClick={()=>startConvo(u)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all hover:bg-white/[0.04]">
                      {u.avatar?<img src={u.avatar} className="w-8 h-8 rounded-full object-cover"/>:<div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>{u.name?.[0]}</div>}
                      <div className="min-w-0"><div className="text-sm text-white truncate">{u.name}</div><div className="text-[10px] font-mono text-white/30">@{u.username}</div></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto no-scroll">
          {loading?[...Array(4)].map((_,i)=><div key={i} className="m-3 h-14 rounded-xl animate-pulse" style={{background:'rgba(255,255,255,0.03)'}}/>):
          convos.length===0?<div className="text-center p-8 text-white/20 text-sm font-mono">No conversations</div>:
          convos.map(c=>(
            <button key={c.conversationId} onClick={()=>setActive(c.user)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b ${active?._id===c.user?._id?'bg-neon-cyan/5':'hover:bg-white/[0.03]'}`}
              style={{borderColor:'rgba(255,255,255,0.04)'}}>
              {c.user?.avatar?<img src={c.user.avatar} className="w-10 h-10 rounded-full flex-shrink-0"/>:<div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-700 text-sm text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>{c.user?.name?.[0]}</div>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-600 text-white truncate">{c.user?.name}</span>
                  {c.unread>0&&<span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full text-black font-700" style={{background:'#00f5ff'}}>{c.unread}</span>}
                </div>
                <div className="text-[11px] text-white/30 truncate">{c.lastMessage}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      {active?(
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-3 px-4 py-3 border-b" style={{borderColor:'rgba(255,255,255,0.05)'}}>
            <button onClick={()=>setActive(null)} className="lg:hidden p-1 text-white/30 hover:text-white"><ArrowLeft className="w-4 h-4"/></button>
            {active.avatar?<img src={active.avatar} className="w-8 h-8 rounded-full"/>:<div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-700 text-black" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>{active.name?.[0]}</div>}
            <div>
              <div className="font-600 text-white text-sm">{active.name}</div>
              <div className="text-[10px] font-mono text-white/25">@{active.username}</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scroll p-4 space-y-3">
            {msgs.length===0&&<div className="text-center text-white/20 text-sm font-mono pt-8">Start the conversation</div>}
            {msgs.map(m=>{
              const mine = m.sender?.toString()===me?._id?.toString()||m.sender===me?._id?.toString()
              return (
                <div key={m._id} className={`flex ${mine?'justify-end':''}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${mine?'text-black':'text-white/80'}`}
                    style={mine?{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',borderRadius:'18px 18px 4px 18px'}:{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'18px 18px 18px 4px'}}>
                    {m.text}
                    <div className={`text-[9px] mt-1 font-mono ${mine?'text-black/50':'text-white/25'}`}>{m.createdAt?formatDistanceToNow(new Date(m.createdAt),{addSuffix:true}):''}</div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef}/>
          </div>
          <form onSubmit={send} className="flex gap-2 p-4 border-t" style={{borderColor:'rgba(255,255,255,0.05)'}}>
            <input value={text} onChange={e=>setText(e.target.value)} className="input-neon flex-1" placeholder="Message…"/>
            <button type="submit" disabled={sending||!text.trim()} className="btn-neon px-4 py-2.5"><Send className="w-4 h-4"/></button>
          </form>
        </div>
      ):(
        <div className="flex-1 hidden lg:grid place-items-center">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{color:'rgba(0,245,255,0.2)'}}/>
            <p className="text-white/25 font-mono text-sm">Select a conversation</p>
          </div>
        </div>
      )}
    </div>
  )
}
