// import { useState } from 'react'
// import { Plus, LayoutGrid, List, Trash2, Settings2, Sparkles, Check, Flame, Zap, Target, Award, TrendingUp, Brain } from 'lucide-react'
// import { useAuth } from '../context/AuthContext'
// import { useHabits } from '../hooks/useHabits'
// import { useTodayLog } from '../hooks/useTodayLog'
// import HabitGrid from '../components/dashboard/HabitGrid'
// import ScoreGraph from '../components/dashboard/ScoreGraph'
// import AISummary from '../components/dashboard/AISummary'
// import AddHabitModal from '../components/dashboard/AddHabitModal'
// import toast from 'react-hot-toast'
// import { format } from 'date-fns'

// const ALL_BADGES = [
//   {name:'First Step',icon:'🌱'},{name:'Week Warrior',icon:'🔥'},{name:'Fortnight Force',icon:'⚡'},
//   {name:'Month Master',icon:'👑'},{name:'Century Club',icon:'💯'},{name:'Rising Star',icon:'⭐'},
//   {name:'Elite Performer',icon:'🏆'},{name:'Iron Discipline',icon:'🦾'},{name:'Connector',icon:'🤝'},
//   {name:'Half Century',icon:'🎯'},{name:'Legend',icon:'🌟'},{name:'1K Club',icon:'💎'},
// ]

// const StatCard = ({ icon, label, value, color }) => (
//   <div className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-default"
//     style={{background:`${color}08`,border:`1px solid ${color}20`}}>
//     <div className="text-xl mb-2">{icon}</div>
//     <div className="font-display font-800 text-xl leading-none mb-1" style={{color,textShadow:`0 0 15px ${color}60`}}>{value}</div>
//     <div className="text-[11px] text-white/40">{label}</div>
//   </div>
// )

// export default function DashboardPage() {
//   const { user } = useAuth()
//   const { habits, loading: hL, addHabit, removeHabit } = useHabits()
//   const { log, loading: lL, toggleHabit, toggling, isCompleted } = useTodayLog()
//   const [showAdd, setAdd] = useState(false)
//   const [view, setView]   = useState('check')
//   const [manage, setMgmt] = useState(false)

//   const done  = log?.completedHabits?.length || 0
//   const total = habits.length
//   const pct   = total > 0 ? Math.round((done/total)*100) : 0

//   const xpNext = (user?.level||1)*100
//   const xpIn   = (user?.xp||0) % xpNext
//   const xpPct  = Math.min(Math.round(xpIn/xpNext*100),100)

//   const toggle = async id => {
//     try {
//       const res = await toggleHabit(id)
//       if (res.newBadges?.length) res.newBadges.forEach(b => toast.success(`Badge unlocked: ${b.name} ${b.icon}`))
//       if (res.leveledUp) toast.success(`Level Up! You're Level ${res.user.level}`)
//     } catch(e) { toast.error(e.response?.data?.message||'Failed') }
//   }

//   const del = async id => { try { await removeHabit(id); toast.success('Removed') } catch { toast.error('Failed') } }

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="font-display font-800 text-2xl text-white">
//             {new Date().getHours()<12?'Morning':'new Date().getHours()<17?\'Afternoon\'':'Evening'}, <span className="text-gradient-neon">{user?.name?.split(' ')[0]}</span>
//           </h1>
//           <p className="text-white/30 text-sm font-mono mt-0.5">{format(new Date(),'EEEE, MMMM d, yyyy')}</p>
//         </div>
//         <button onClick={()=>setAdd(true)} disabled={habits.length>=10}
//           className="btn-neon text-xs px-4 py-2 flex items-center gap-1.5">
//           <Plus className="w-3.5 h-3.5"/> Add Habit
//         </button>
//       </div>

//       {/* Stats row */}
//       <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
//         <StatCard icon="🔥" label="Streak" value={`${user?.currentStreak||0}d`} color="#ff6600"/>
//         <StatCard icon="⚡" label="Total XP" value={user?.xp||0} color="#00f5ff"/>
//         <StatCard icon="✅" label="Today" value={`${done}/${total}`} color="#00ff88"/>
//         <StatCard icon="🎯" label="Discipline" value={`${user?.disciplineScore||0}%`} color="#bf00ff"/>
//         <StatCard icon="👑" label="Best Streak" value={`${user?.longestStreak||0}d`} color="#ffee00"/>
//         <StatCard icon="🏅" label="Badges" value={user?.badges?.length||0} color="#ff0080"/>
//       </div>

//       <div className="grid xl:grid-cols-3 gap-5">
//         {/* Left 2/3 */}
//         <div className="xl:col-span-2 space-y-5">
//           {/* Today's habits */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-5">
//               <div>
//                 <h2 className="font-display font-700 text-white">Today's Habits</h2>
//                 <div className="flex items-center gap-2 mt-1">
//                   <div className="flex-1 h-1.5 rounded-full overflow-hidden w-32" style={{background:'rgba(255,255,255,0.06)'}}>
//                     <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`,background:'linear-gradient(90deg,#00f5ff,#bf00ff)'}}/>
//                   </div>
//                   <span className="text-xs font-mono text-white/40">{pct}%</span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="flex gap-0.5 p-1 rounded-lg" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
//                   {[['check','list'],['grid','grid']].map(([v,icon])=>(
//                     <button key={v} onClick={()=>setView(v)}
//                       className={`p-1.5 rounded-md text-xs transition-all ${view===v?'bg-neon-cyan/20 text-neon-cyan':'text-white/30 hover:text-white/60'}`}>
//                       {v==='check'?<List className="w-3.5 h-3.5"/>:<LayoutGrid className="w-3.5 h-3.5"/>}
//                     </button>
//                   ))}
//                 </div>
//                 <button onClick={()=>setMgmt(m=>!m)}
//                   className={`p-2 rounded-lg transition-all text-xs ${manage?'bg-red-500/20 text-red-400':'text-white/30 hover:text-white/60'}`}
//                   style={{border:'1px solid rgba(255,255,255,0.06)'}}>
//                   <Settings2 className="w-3.5 h-3.5"/>
//                 </button>
//               </div>
//             </div>

//             {hL||lL ? (
//               <div className="space-y-2">{[...Array(4)].map((_,i)=><div key={i} className="h-12 rounded-xl animate-pulse" style={{background:'rgba(255,255,255,0.03)'}}/>)}</div>
//             ) : manage ? (
//               <div className="space-y-2">
//                 <div className="text-xs font-mono text-red-400/60 mb-3 flex items-center gap-2">
//                   <span>Manage mode — tap trash to remove</span>
//                   <button onClick={()=>setMgmt(false)} className="ml-auto text-white/30 hover:text-white">✕</button>
//                 </div>
//                 {habits.map(h=>(
//                   <div key={h._id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'rgba(255,0,128,0.05)',border:'1px solid rgba(255,0,128,0.15)'}}>
//                     <span className="text-xl">{h.icon}</span>
//                     <span className="flex-1 text-sm text-white/60">{h.name}</span>
//                     <button onClick={()=>del(h._id)} className="p-1.5 rounded-lg transition-all" style={{background:'rgba(255,0,128,0.2)',color:'#ff0080'}}>
//                       <Trash2 className="w-3.5 h-3.5"/>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : view==='check' ? (
//               <div className="space-y-2">
//                 {habits.length===0 ? (
//                   <div className="text-center py-8">
//                     <div className="text-3xl mb-2">⚡</div>
//                     <p className="text-sm text-white/30 mb-3">No habits yet</p>
//                     <button onClick={()=>setAdd(true)} className="btn-ghost-neon text-xs px-4 py-2">Add First Habit</button>
//                   </div>
//                 ) : habits.map(h=>{
//                   const done2 = isCompleted(h._id)
//                   const spin  = toggling===h._id
//                   return (
//                     <button key={h._id} onClick={()=>toggle(h._id)} disabled={spin}
//                       className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 ${spin?'opacity-60':''}`}
//                       style={{background:done2?`${h.color}10`:'rgba(255,255,255,0.02)',border:`1px solid ${done2?h.color+'40':'rgba(255,255,255,0.06)'}`}}>
//                       <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200" style={{background:done2?h.color:'rgba(255,255,255,0.04)',border:`2px solid ${done2?h.color:'rgba(255,255,255,0.12)'}`}}>
//                         {spin?<span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/>:done2&&<Check className="w-3 h-3 text-black" strokeWidth={3}/>}
//                       </div>
//                       <span className="text-lg flex-shrink-0">{h.icon}</span>
//                       <div className="flex-1 min-w-0">
//                         <div className={`text-sm font-medium truncate ${done2?'line-through text-white/30':'text-white'}`}>{h.name}</div>
//                         <div className="text-[10px] text-white/25 capitalize font-mono">{h.category}</div>
//                       </div>
//                       <span className="text-[10px] font-mono flex-shrink-0" style={{color:done2?h.color:'rgba(255,255,255,0.2)'}}>+{h.xpReward}XP</span>
//                     </button>
//                   )
//                 })}
//                 {pct===100&&total>0&&(
//                   <div className="mt-3 p-3 rounded-xl flex items-center gap-2 text-sm font-600" style={{background:'rgba(0,255,136,0.08)',border:'1px solid rgba(0,255,136,0.2)',color:'#00ff88'}}>
//                     <Flame className="w-4 h-4"/> Perfect day! All {total} habits complete!
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <HabitGrid habits={habits} currentLog={log} onToggle={toggle} toggling={toggling}/>
//             )}
//           </div>

//           {/* Monthly grid always visible */}
//           {view==='check'&&habits.length>0&&(
//             <div className="card">
//               <h2 className="font-display font-700 text-white mb-4">Monthly Grid</h2>
//               <HabitGrid habits={habits} currentLog={log} onToggle={toggle} toggling={toggling}/>
//             </div>
//           )}

//           {/* Score graph */}
//           <div className="card">
//             <h2 className="font-display font-700 text-white mb-1">Progress Graph</h2>
//             <p className="text-xs text-white/25 font-mono mb-5">Last 30 days</p>
//             <ScoreGraph userId={user?._id}/>
//           </div>
//         </div>

//         {/* Right column */}
//         <div className="space-y-5">
//           {/* Level card */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <div className="font-display font-900 text-2xl text-gradient-neon">Level {user?.level}</div>
//                 <div className="text-xs text-white/30 font-mono">{user?.xp||0} total XP</div>
//               </div>
//               <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-900 text-xl text-black"
//                 style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',boxShadow:'0 0 20px rgba(0,245,255,0.4)'}}>
//                 {user?.level}
//               </div>
//             </div>
//             <div className="xp-track mb-1.5">
//               <div className="xp-fill" style={{width:`${xpPct}%`}}/>
//             </div>
//             <div className="flex justify-between text-[10px] font-mono">
//               <span className="text-white/25">{xpIn} XP</span>
//               <span style={{color:'#00f5ff'}}>{xpNext-xpIn} to Level {(user?.level||1)+1}</span>
//             </div>
//           </div>

//           {/* AI Summary */}
//           <AISummary log={log}/>

//           {/* Badges */}
//           <div className="card">
//             <h2 className="font-display font-700 text-white mb-4">Badges <span className="text-xs font-mono text-white/30">{user?.badges?.length||0}/{ALL_BADGES.length}</span></h2>
//             <div className="grid grid-cols-4 gap-2">
//               {ALL_BADGES.map(b=>{
//                 const earned = user?.badges?.some(ub=>ub.name===b.name)
//                 return (
//                   <div key={b.name} title={b.name}
//                     className={`flex flex-col items-center p-2 rounded-xl transition-all ${earned?'':'opacity-25 grayscale'}`}
//                     style={earned?{background:'rgba(0,245,255,0.08)',border:'1px solid rgba(0,245,255,0.2)'}:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
//                     <span className="text-xl">{b.icon}</span>
//                     <span className="text-[8px] text-center text-white/40 mt-1 leading-tight">{b.name.split(' ').slice(-1)}</span>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {showAdd && <AddHabitModal onAdd={addHabit} onClose={()=>setAdd(false)}/>}
//     </div>
//   )
// }



import { useState } from 'react'
import { Plus, LayoutGrid, List, Trash2, Settings2, Sparkles, Check, Flame, Zap, Target, Award, TrendingUp, Brain } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useHabits } from '../hooks/useHabits'
import { useTodayLog } from '../hooks/useTodayLog'
import HabitGrid from '../components/dashboard/HabitGrid'
import ScoreGraph from '../components/dashboard/ScoreGraph'
import AISummary from '../components/dashboard/AISummary'
import AddHabitModal from '../components/dashboard/AddHabitModal'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const ALL_BADGES = [
  {name:'First Step',icon:'🌱'},{name:'Week Warrior',icon:'🔥'},{name:'Fortnight Force',icon:'⚡'},
  {name:'Month Master',icon:'👑'},{name:'Century Club',icon:'💯'},{name:'Rising Star',icon:'⭐'},
  {name:'Elite Performer',icon:'🏆'},{name:'Iron Discipline',icon:'🦾'},{name:'Connector',icon:'🤝'},
  {name:'Half Century',icon:'🎯'},{name:'Legend',icon:'🌟'},{name:'1K Club',icon:'💎'},
]

const StatCard = ({ icon, label, value, color }) => (
  <div className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-default"
    style={{background:`${color}08`,border:`1px solid ${color}20`}}>
    <div className="text-xl mb-2">{icon}</div>
    <div className="font-display font-800 text-xl leading-none mb-1" style={{color,textShadow:`0 0 15px ${color}60`}}>{value}</div>
    <div className="text-[11px] text-white/40">{label}</div>
  </div>
)

export default function DashboardPage() {
  const { user } = useAuth()
  const { habits, loading: hL, addHabit, removeHabit } = useHabits()
  const { log, loading: lL, toggleHabit, toggling, isCompleted } = useTodayLog()
  const [showAdd, setAdd] = useState(false)
  const [view, setView]   = useState('check')
  const [manage, setMgmt] = useState(false)

  const done  = log?.completedHabits?.length || 0
  const total = habits.length
  const pct   = total > 0 ? Math.round((done/total)*100) : 0

  const xpNext = (user?.level||1)*100
  const xpIn   = (user?.xp||0) % xpNext
  const xpPct  = Math.min(Math.round(xpIn/xpNext*100),100)

  const toggle = async id => {
    try {
      const res = await toggleHabit(id)
      if (res.newBadges?.length) res.newBadges.forEach(b => toast.success(`Badge unlocked: ${b.name} ${b.icon}`))
      if (res.leveledUp) toast.success(`Level Up! You're Level ${res.user.level}`)
    } catch(e) { toast.error(e.response?.data?.message||'Failed') }
  }

  const del = async id => { try { await removeHabit(id); toast.success('Removed') } catch { toast.error('Failed') } }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if(hour < 12) return 'Morning'
    if(hour < 17) return 'Afternoon'
    return 'Evening'
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl text-white">
            {getGreeting()}, <span className="text-gradient-neon">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-white/30 text-sm font-mono mt-0.5">{format(new Date(),'EEEE, MMMM d, yyyy')}</p>
        </div>
        <button onClick={()=>setAdd(true)} disabled={habits.length>=10}
          className="btn-neon text-xs px-4 py-2 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5"/> Add Habit
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon="🔥" label="Streak" value={`${user?.currentStreak||0}d`} color="#ff6600"/>
        <StatCard icon="⚡" label="Total XP" value={user?.xp||0} color="#00f5ff"/>
        <StatCard icon="✅" label="Today" value={`${done}/${total}`} color="#00ff88"/>
        <StatCard icon="🎯" label="Discipline" value={`${user?.disciplineScore||0}%`} color="#bf00ff"/>
        <StatCard icon="👑" label="Best Streak" value={`${user?.longestStreak||0}d`} color="#ffee00"/>
        <StatCard icon="🏅" label="Badges" value={user?.badges?.length||0} color="#ff0080"/>
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        {/* Left 2/3 */}
        <div className="xl:col-span-2 space-y-5">
          {/* Today's habits */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-700 text-white">Today's Habits</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden w-32" style={{background:'rgba(255,255,255,0.06)'}}>
                    <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`,background:'linear-gradient(90deg,#00f5ff,#bf00ff)'}}/>
                  </div>
                  <span className="text-xs font-mono text-white/40">{pct}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 p-1 rounded-lg" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                  {[['check','list'],['grid','grid']].map(([v,icon])=>(
                    <button key={v} onClick={()=>setView(v)}
                      className={`p-1.5 rounded-md text-xs transition-all ${view===v?'bg-neon-cyan/20 text-neon-cyan':'text-white/30 hover:text-white/60'}`}>
                      {v==='check'?<List className="w-3.5 h-3.5"/>:<LayoutGrid className="w-3.5 h-3.5"/>}
                    </button>
                  ))}
                </div>
                <button onClick={()=>setMgmt(m=>!m)}
                  className={`p-2 rounded-lg transition-all text-xs ${manage?'bg-red-500/20 text-red-400':'text-white/30 hover:text-white/60'}`}
                  style={{border:'1px solid rgba(255,255,255,0.06)'}}>
                  <Settings2 className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>

            {hL||lL ? (
              <div className="space-y-2">{[...Array(4)].map((_,i)=><div key={i} className="h-12 rounded-xl animate-pulse" style={{background:'rgba(255,255,255,0.03)'}}/>)}</div>
            ) : manage ? (
              <div className="space-y-2">
                <div className="text-xs font-mono text-red-400/60 mb-3 flex items-center gap-2">
                  <span>Manage mode — tap trash to remove</span>
                  <button onClick={()=>setMgmt(false)} className="ml-auto text-white/30 hover:text-white">✕</button>
                </div>
                {habits.map(h=>(
                  <div key={h._id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'rgba(255,0,128,0.05)',border:'1px solid rgba(255,0,128,0.15)'}}>
                    <span className="text-xl">{h.icon}</span>
                    <span className="flex-1 text-sm text-white/60">{h.name}</span>
                    <button onClick={()=>del(h._id)} className="p-1.5 rounded-lg transition-all" style={{background:'rgba(255,0,128,0.2)',color:'#ff0080'}}>
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                ))}
              </div>
            ) : view==='check' ? (
              <div className="space-y-2">
                {habits.length===0 ? (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">⚡</div>
                    <p className="text-sm text-white/30 mb-3">No habits yet</p>
                    <button onClick={()=>setAdd(true)} className="btn-ghost-neon text-xs px-4 py-2">Add First Habit</button>
                  </div>
                ) : habits.map(h=>{
                  const done2 = isCompleted(h._id)
                  const spin  = toggling===h._id
                  return (
                    <button key={h._id} onClick={()=>toggle(h._id)} disabled={spin}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 ${spin?'opacity-60':''}`}
                      style={{background:done2?`${h.color}10`:'rgba(255,255,255,0.02)',border:`1px solid ${done2?h.color+'40':'rgba(255,255,255,0.06)'}`}}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200" style={{background:done2?h.color:'rgba(255,255,255,0.04)',border:`2px solid ${done2?h.color:'rgba(255,255,255,0.12)'}`}}>
                        {spin?<span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/>:done2&&<Check className="w-3 h-3 text-black" strokeWidth={3}/>}
                      </div>
                      <span className="text-lg flex-shrink-0">{h.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${done2?'line-through text-white/30':'text-white'}`}>{h.name}</div>
                        <div className="text-[10px] text-white/25 capitalize font-mono">{h.category}</div>
                      </div>
                      <span className="text-[10px] font-mono flex-shrink-0" style={{color:done2?h.color:'rgba(255,255,255,0.2)'}}>+{h.xpReward}XP</span>
                    </button>
                  )
                })}
                {pct===100&&total>0&&(
                  <div className="mt-3 p-3 rounded-xl flex items-center gap-2 text-sm font-600" style={{background:'rgba(0,255,136,0.08)',border:'1px solid rgba(0,255,136,0.2)',color:'#00ff88'}}>
                    <Flame className="w-4 h-4"/> Perfect day! All {total} habits complete!
                  </div>
                )}
              </div>
            ) : (
              <HabitGrid habits={habits} currentLog={log} onToggle={toggle} toggling={toggling}/>
            )}
          </div>

          {/* Monthly grid always visible */}
          {view==='check'&&habits.length>0&&(
            <div className="card">
              <h2 className="font-display font-700 text-white mb-4">Monthly Grid</h2>
              <HabitGrid habits={habits} currentLog={log} onToggle={toggle} toggling={toggling}/>
            </div>
          )}

          {/* Score graph */}
          <div className="card">
            <h2 className="font-display font-700 text-white mb-1">Progress Graph</h2>
            <p className="text-xs text-white/25 font-mono mb-5">Last 30 days</p>
            <ScoreGraph userId={user?._id}/>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Level card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display font-900 text-2xl text-gradient-neon">Level {user?.level}</div>
                <div className="text-xs text-white/30 font-mono">{user?.xp||0} total XP</div>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-900 text-xl text-black"
                style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',boxShadow:'0 0 20px rgba(0,245,255,0.4)'}}>
                {user?.level}
              </div>
            </div>
            <div className="xp-track mb-1.5">
              <div className="xp-fill" style={{width:`${xpPct}%`}}/>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-white/25">{xpIn} XP</span>
              <span style={{color:'#00f5ff'}}>{xpNext-xpIn} to Level {(user?.level||1)+1}</span>
            </div>
          </div>

          {/* AI Summary */}
          <AISummary log={log}/>

          {/* Badges */}
          <div className="card">
            <h2 className="font-display font-700 text-white mb-4">Badges <span className="text-xs font-mono text-white/30">{user?.badges?.length||0}/{ALL_BADGES.length}</span></h2>
            <div className="grid grid-cols-4 gap-2">
              {ALL_BADGES.map(b=>{
                const earned = user?.badges?.some(ub=>ub.name===b.name)
                return (
                  <div key={b.name} title={b.name}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${earned?'':'opacity-25 grayscale'}`}
                    style={earned?{background:'rgba(0,245,255,0.08)',border:'1px solid rgba(0,245,255,0.2)'}:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                    <span className="text-xl">{b.icon}</span>
                    <span className="text-[8px] text-center text-white/40 mt-1 leading-tight">{b.name.split(' ').slice(-1)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {showAdd && <AddHabitModal onAdd={addHabit} onClose={()=>setAdd(false)}/>}
    </div>
  )
}