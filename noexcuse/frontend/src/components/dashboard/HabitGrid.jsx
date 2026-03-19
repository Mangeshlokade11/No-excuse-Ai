import { useState, useEffect } from 'react'
import { format, getDaysInMonth } from 'date-fns'
import api from '../../lib/api'

const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function HabitGrid({ habits, currentLog, onToggle, toggling }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear]   = useState(now.getFullYear())
  const [logs, setLogs]   = useState({})
  const days = getDaysInMonth(new Date(year,month))
  const isCur = month===now.getMonth()&&year===now.getFullYear()

  useEffect(()=>{
    const s=`${year}-${String(month+1).padStart(2,'0')}-01`
    const e=`${year}-${String(month+1).padStart(2,'0')}-${String(days).padStart(2,'0')}`
    api.get(`/logs/range?start=${s}&end=${e}`).then(({data})=>{
      const m={}; data.forEach(l=>{m[l.date]=new Set(l.completedHabits.map(c=>(c.habit?._id||c.habit)?.toString()))})
      setLogs(m)
    }).catch(()=>{})
  },[month,year,days])

  useEffect(()=>{
    if(!currentLog||!isCur)return
    const t=format(new Date(),'yyyy-MM-dd')
    setLogs(p=>({...p,[t]:new Set(currentLog.completedHabits?.map(c=>(c.habit?._id||c.habit)?.toString())||[])}))
  },[currentLog,isCur])

  const isDone=(hid,day)=>{const d=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;return logs[d]?.has(hid?.toString())||false}
  const isToday=(day)=>isCur&&day===now.getDate()
  const isFuture=(day)=>isCur&&day>now.getDate()

  if(!habits.length) return <div className="py-8 text-center text-white/25 text-sm font-mono">No habits — add one above</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1)}else setMonth(m=>m-1)}}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all" style={{background:'rgba(255,255,255,0.04)'}}>‹</button>
        <span className="text-sm font-mono text-white/60">{M[month]} {year}</span>
        <button onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1)}else setMonth(m=>m+1)}}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all" style={{background:'rgba(255,255,255,0.04)'}}>›</button>
      </div>
      <div className="overflow-x-auto no-scroll">
        <div className="min-w-max">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-24 text-[9px] font-mono text-white/20 uppercase tracking-wider">Habit</div>
            {Array.from({length:days},(_,i)=><div key={i} className={`w-6 text-center text-[9px] font-mono ${isToday(i+1)?'text-neon-cyan':'text-white/20'}`}>{i+1}</div>)}
          </div>
          {habits.map(h=>(
            <div key={h._id} className="flex items-center gap-1 mb-1">
              <div className="w-24 flex items-center gap-1 pr-1">
                <span className="text-sm">{h.icon}</span>
                <span className="text-[10px] text-white/40 truncate">{h.name}</span>
              </div>
              {Array.from({length:days},(_,i)=>{
                const day=i+1, done=isDone(h._id,day), today=isToday(day), future=isFuture(day)
                return (
                  <div key={i} onClick={()=>today&&onToggle(h._id)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] transition-all duration-150
                      ${done?'':'hover:opacity-80'} ${future?'opacity-10':''}
                      ${today?'cursor-pointer':'cursor-default'}
                      ${toggling===h._id&&today?'animate-pulse':''}`}
                    style={{
                      background:done?`${h.color}25`:'rgba(255,255,255,0.02)',
                      border:`1px solid ${done?h.color+'50':'rgba(255,255,255,0.05)'}`,
                      boxShadow:today?`0 0 0 1px ${h.color}80`:undefined
                    }}>
                    {done&&<span style={{color:h.color}}>✓</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
