import { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { format, parseISO } from 'date-fns'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react'

const NEON = ['#00f5ff','#bf00ff','#00ff88','#ff0080','#ffee00','#ff6600','#06b6d4','#10b981']
const TIP  = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null
  return <div className="rounded-xl px-3 py-2 text-xs font-mono" style={{background:'rgba(5,5,22,0.96)',border:'1px solid rgba(0,245,255,0.2)'}}><p className="text-white/40 mb-1">{label}</p>{payload.map(p=><div key={p.name} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="text-white">{p.name}: {p.value}</span></div>)}</div>
}

export default function AnalyticsPage() {
  const { user }  = useAuth()
  const [data, setData]   = useState(null)
  const [range, setRange] = useState(30)
  const [loading, setL]   = useState(true)

  useEffect(()=>{
    setL(true)
    api.get(`/logs/analytics?days=${range}`).then(({data})=>setData(data)).catch(()=>{}).finally(()=>setL(false))
  },[range])

  if (loading) return <div className="min-h-96 grid place-items-center"><div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"/></div>

  const weekly = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const weekBar = data?.weekdayActivity?.map((v,i)=>({day:weekly[i],habits:v}))||[]

  const catData = Object.entries(data?.categoryBreakdown||{}).map(([name,value])=>({name,value}))

  const avgScore = data?.avgScore||0
  const scoreColor = avgScore>=8?'#00ff88':avgScore>=5?'#00f5ff':'#f59e0b'

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-neon-cyan"/> Analytics
          </h1>
          <p className="text-white/30 text-sm font-mono mt-0.5">Deep performance insights</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
          {[30,60,90].map(d=>(
            <button key={d} onClick={()=>setRange(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${range===d?'text-black':'text-white/40 hover:text-white/70'}`}
              style={range===d?{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}:{}}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {label:'Avg Score',   value:`${data?.avgScore||0}/10`, color:scoreColor, icon:'🎯'},
          {label:'Perfect Days',value:data?.perfectDays||0,      color:'#00ff88',  icon:'💎'},
          {label:'Active Days', value:data?.activeDays||0,       color:'#00f5ff',  icon:'🔥'},
          {label:'XP Earned',   value:`+${data?.totalXP||0}`,    color:'#bf00ff',  icon:'⚡'},
        ].map(s=>(
          <div key={s.label} className="rounded-xl p-4 transition-all hover:scale-[1.02]"
            style={{background:`${s.color}08`,border:`1px solid ${s.color}20`}}>
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="font-display font-800 text-xl" style={{color:s.color,textShadow:`0 0 12px ${s.color}60`}}>{s.value}</div>
            <div className="text-[11px] text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily score trend */}
      <div className="card">
        <h2 className="font-display font-700 text-white mb-1">Daily Score Trend</h2>
        <p className="text-xs text-white/25 font-mono mb-5">Discipline score over {range} days</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data?.daily?.map(d=>({...d,label:format(parseISO(d.date),'MMM d')}))||[]} margin={{top:5,right:5,left:-20,bottom:0}}>
            <defs>
              <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3}/><stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/></linearGradient>
              <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff88" stopOpacity={0.2}/><stop offset="95%" stopColor="#00ff88" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
            <XAxis dataKey="label" tick={{fill:'rgba(255,255,255,0.2)',fontSize:9,fontFamily:'JetBrains Mono'}} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
            <YAxis tick={{fill:'rgba(255,255,255,0.2)',fontSize:9}} tickLine={false} axisLine={false} domain={[0,10]}/>
            <Tooltip content={<TIP/>}/>
            <Area type="monotone" dataKey="score" name="score" stroke="#00f5ff" strokeWidth={2} fill="url(#ga)" dot={false} activeDot={{r:4,fill:'#00f5ff',stroke:'#020208',strokeWidth:2}}/>
            <Area type="monotone" dataKey="done" name="habits" stroke="#00ff88" strokeWidth={1.5} fill="url(#gb)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Weekday activity bar */}
        <div className="card">
          <h2 className="font-display font-700 text-white mb-1">Best Days of the Week</h2>
          <p className="text-xs text-white/25 font-mono mb-5">Total habits completed per weekday</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekBar} margin={{top:0,right:5,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
              <XAxis dataKey="day" tick={{fill:'rgba(255,255,255,0.3)',fontSize:10,fontFamily:'JetBrains Mono'}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fill:'rgba(255,255,255,0.2)',fontSize:9}} tickLine={false} axisLine={false}/>
              <Tooltip content={<TIP/>}/>
              <Bar dataKey="habits" name="habits" radius={[6,6,0,0]}>
                {weekBar.map((_,i)=><Cell key={i} fill={NEON[i%NEON.length]} fillOpacity={0.7}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card">
          <h2 className="font-display font-700 text-white mb-1">Habits by Category</h2>
          <p className="text-xs text-white/25 font-mono mb-4">What you focus on most</p>
          {catData.length>0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                    {catData.map((_,i)=><Cell key={i} fill={NEON[i%NEON.length]}/>)}
                  </Pie>
                  <Tooltip content={<TIP/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {catData.slice(0,6).map((c,i)=>(
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:NEON[i%NEON.length]}}/>
                    <span className="text-xs text-white/50 capitalize flex-1">{c.name}</span>
                    <span className="text-xs font-mono text-white/70">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="h-32 grid place-items-center text-sm text-white/20 font-mono">No data yet</div>}
        </div>
      </div>

      {/* XP over time */}
      <div className="card">
        <h2 className="font-display font-700 text-white mb-1">XP Earned Over Time</h2>
        <p className="text-xs text-white/25 font-mono mb-5">Daily XP earned</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data?.daily?.map(d=>({...d,label:format(parseISO(d.date),'MMM d')}))||[]} margin={{top:0,right:5,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
            <XAxis dataKey="label" tick={{fill:'rgba(255,255,255,0.2)',fontSize:9,fontFamily:'JetBrains Mono'}} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
            <YAxis tick={{fill:'rgba(255,255,255,0.2)',fontSize:9}} tickLine={false} axisLine={false}/>
            <Tooltip content={<TIP/>}/>
            <Bar dataKey="xpEarned" name="XP" fill="#bf00ff" fillOpacity={0.6} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Completion heatmap */}
      <div className="card">
        <h2 className="font-display font-700 text-white mb-1">Completion Heatmap</h2>
        <p className="text-xs text-white/25 font-mono mb-5">Daily completion rate — darker = better</p>
        <div className="flex flex-wrap gap-1">
          {(data?.daily||[]).map((d,i)=>{
            const rate = d.completionRate||0
            const alpha = rate>0?Math.max(0.1,rate/100):0
            return (
              <div key={i} title={`${d.date}: ${rate}%`}
                className="w-4 h-4 rounded-sm transition-all cursor-default"
                style={{background:rate>0?`rgba(0,245,255,${alpha})`:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.04)'}}/>
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-white/30">
          <span>Less</span>
          {[0.1,0.3,0.5,0.7,1].map(a=><div key={a} className="w-3 h-3 rounded-sm" style={{background:`rgba(0,245,255,${a})`}}/>)}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
