import { useState, useEffect } from 'react'
import { Trophy, Crown, Medal } from 'lucide-react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LeaderboardPage() {
  const { user: me } = useAuth()
  const navigate     = useNavigate()
  const [data, setData] = useState([])
  const [tab, setTab]   = useState('xp')
  const [loading, setL] = useState(true)

  useEffect(()=>{
    setL(true)
    api.get(tab==='xp'?'/leaderboard':'/leaderboard/streaks').then(({data})=>setData(data)).catch(()=>{}).finally(()=>setL(false))
  },[tab])

  const myRank = data.findIndex(u=>u._id?.toString()===me?._id?.toString())+1

  const rankIcon = r => {
    if (r===1) return <Crown className="w-5 h-5" style={{color:'#ffee00',filter:'drop-shadow(0 0 6px #ffee0080)'}}/>
    if (r===2) return <Medal className="w-4 h-4 text-slate-400"/>
    if (r===3) return <Medal className="w-4 h-4" style={{color:'#cd7f32'}}/>
    return <span className="text-sm font-mono text-white/30 font-600">#{r}</span>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-800 text-2xl text-white flex items-center gap-2"><Trophy className="w-6 h-6 text-neon-cyan"/>Rankings</h1>
        <p className="text-white/30 text-sm font-mono mt-0.5">Top performers worldwide</p>
      </div>

      {myRank>0&&(
        <div className="rounded-xl p-4 flex items-center gap-4" style={{background:'rgba(0,245,255,0.05)',border:'1px solid rgba(0,245,255,0.2)'}}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-800 text-white/50" style={{background:'rgba(0,245,255,0.1)'}}>#{myRank}</div>
          <div>
            <div className="text-sm font-600 text-white">Your Rank</div>
            <div className="text-xs text-white/30 font-mono">{me?.xp} XP · Level {me?.level} · {me?.currentStreak}d streak</div>
          </div>
          {myRank<=3&&<div className="ml-auto text-2xl">🏆</div>}
        </div>
      )}

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
        {[['xp','XP Rankings'],['streak','Streak Rankings']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-600 transition-all ${tab===k?'text-black':'text-white/40 hover:text-white/70'}`}
            style={tab===k?{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}:{}}>
            {l}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{border:'1px solid rgba(255,255,255,0.06)'}}>
        {loading?[...Array(8)].map((_,i)=><div key={i} className="m-3 h-16 rounded-xl animate-pulse" style={{background:'rgba(255,255,255,0.03)'}}/>):
        data.length===0?<div className="p-12 text-center text-white/20 font-mono text-sm">No data yet</div>:
        data.map((u,i)=>{
          const rank = tab==='xp'?u.rank:i+1
          const isMe = u._id?.toString()===me?._id?.toString()
          const rankColors = {1:'#ffee00',2:'#c0c0c0',3:'#cd7f32'}
          return (
            <div key={u._id} className={`flex items-center gap-4 px-4 py-3.5 border-b transition-all ${isMe?'bg-neon-cyan/5':'hover:bg-white/[0.02]'} cursor-pointer`}
              style={{borderColor:'rgba(255,255,255,0.04)'}}
              onClick={()=>u.username&&navigate(`/u/${u.username}`)}>
              <div className="w-8 flex items-center justify-center flex-shrink-0">{rankIcon(rank)}</div>
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-display font-700 text-sm text-black"
                style={{background:rank<=3?`linear-gradient(135deg,${rankColors[rank]},${rankColors[rank]}88)`:'linear-gradient(135deg,#00f5ff,#bf00ff)',boxShadow:rank<=3?`0 0 12px ${rankColors[rank]}60`:undefined}}>
                {u.avatar?<img src={u.avatar} className="w-full h-full rounded-full object-cover"/>:u.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-600 text-sm truncate ${isMe?'text-neon-cyan':'text-white'}`}>{u.name}{isMe?' (You)':''}</span>
                  {u.isVerified&&<span className="text-[10px]" style={{color:'#00f5ff'}}>✓</span>}
                  {u.badgeCount>0&&<span className="text-[10px] font-mono text-white/30">{u.badgeCount} badges</span>}
                </div>
                <div className="text-[10px] text-white/25 font-mono">@{u.username} · Lv{u.level} · {u.disciplineScore}% discipline</div>
              </div>
              <div className="text-right flex-shrink-0">
                {tab==='xp'
                  ? <><div className="text-sm font-700 font-mono" style={{color:'#00f5ff'}}>{u.xp?.toLocaleString()} XP</div><div className="text-[10px] text-white/25 font-mono">{u.currentStreak}d streak</div></>
                  : <><div className="text-sm font-700 font-mono" style={{color:'#ff6600'}}>{u.currentStreak}d</div><div className="text-[10px] text-white/25 font-mono">{u.xp} XP</div></>
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
