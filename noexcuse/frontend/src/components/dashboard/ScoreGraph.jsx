import { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { format, parseISO } from 'date-fns'
import api from '../../lib/api'

const Tip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs font-mono" style={{background:'rgba(5,5,22,0.95)',border:'1px solid rgba(0,245,255,0.2)',boxShadow:'0 0 20px rgba(0,245,255,0.1)'}}>
      <p className="text-white/40 mb-1">{label}</p>
      {payload.map(p=><div key={p.name} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="text-white">{p.name}: {p.value}{p.name==='completion'?'%':''}</span></div>)}
    </div>
  )
}

export default function ScoreGraph({ userId }) {
  const [data, setData]   = useState([])
  const [view, setView]   = useState('score')
  const [loading, setL]   = useState(true)

  useEffect(()=>{
    if(!userId)return
    api.get(`/users/${userId}/stats`).then(({data})=>{
      setData(data.map(d=>({...d,label:format(parseISO(d.date),'MMM d')})))
    }).catch(()=>{}).finally(()=>setL(false))
  },[userId])

  const views = [
    {key:'score',      label:'Score',      color:'#00f5ff', domain:[0,10]},
    {key:'completionRate',label:'Completion',color:'#00ff88', domain:[0,100]},
    {key:'xpEarned',   label:'XP',         color:'#bf00ff', domain:[0,'auto']},
  ]
  const av = views.find(v=>v.key===view)

  if(loading) return <div className="h-40 grid place-items-center"><div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"/></div>
  if(!data.length) return <div className="h-40 grid place-items-center text-sm text-white/20 font-mono">Start tracking to see your graph</div>

  return (
    <div>
      <div className="flex gap-1 mb-4 p-1 rounded-xl w-fit" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
        {views.map(v=>(
          <button key={v.key} onClick={()=>setView(v.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-600 transition-all ${view===v.key?'text-black':'text-white/30 hover:text-white/60'}`}
            style={view===v.key?{background:`linear-gradient(135deg,${v.color},${v.color}aa)`,boxShadow:`0 0 10px ${v.color}40`}:{}}>
            {v.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{top:5,right:5,left:-20,bottom:0}}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={av.color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={av.color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
          <XAxis dataKey="label" tick={{fill:'rgba(255,255,255,0.2)',fontSize:9,fontFamily:'JetBrains Mono'}} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
          <YAxis domain={av.domain} tick={{fill:'rgba(255,255,255,0.2)',fontSize:9,fontFamily:'JetBrains Mono'}} tickLine={false} axisLine={false}/>
          <Tooltip content={<Tip/>}/>
          <Area type="monotone" dataKey={av.key} name={av.label.toLowerCase()} stroke={av.color} strokeWidth={2} fill="url(#g)" dot={false} activeDot={{r:4,fill:av.color,stroke:'#020208',strokeWidth:2}}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
