import { useState, useEffect } from 'react'
import { Target, Plus, Check, Circle, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const COLORS = ['#00f5ff','#bf00ff','#00ff88','#ff0080','#ffee00','#ff6600']
const CATS   = ['general','health','career','fitness','finance','learning','personal']

export default function PlanPage() {
  const [plans, setPlans]     = useState([])
  const [loading, setL]       = useState(true)
  const [showNew, setNew]      = useState(false)
  const [expanded, setExp]    = useState({})
  const [form, setForm]       = useState({ title:'', description:'', category:'general', color:'#00f5ff', endDate:'', goals:[] })
  const [newGoal, setNG]      = useState('')
  const [saving, setSav]      = useState(false)

  useEffect(()=>{
    api.get('/plans').then(({data})=>setPlans(data)).catch(()=>{}).finally(()=>setL(false))
  },[])

  const addGoalToForm = () => {
    if (!newGoal.trim()) return
    setForm(f=>({...f, goals:[...f.goals,{title:newGoal.trim(),priority:'medium'}]}))
    setNG('')
  }

  const createPlan = async () => {
    if (!form.title) return toast.error('Title required')
    setSav(true)
    try {
      const { data } = await api.post('/plans', form)
      setPlans(p=>[data,...p])
      setNew(false)
      setForm({title:'',description:'',category:'general',color:'#00f5ff',endDate:'',goals:[]})
      toast.success('Plan created!')
    } catch(e) { toast.error(e.response?.data?.message||'Failed') }
    finally { setSav(false) }
  }

  const toggleGoal = async (planId, goalId) => {
    try {
      const { data } = await api.patch(`/plans/${planId}/goal/${goalId}`)
      setPlans(p=>p.map(pl=>pl._id===planId?data:pl))
    } catch { toast.error('Failed') }
  }

  const deletePlan = async (id) => {
    try { await api.delete(`/plans/${id}`); setPlans(p=>p.filter(pl=>pl._id!==id)); toast.success('Plan removed') }
    catch { toast.error('Failed') }
  }

  if (loading) return <div className="min-h-96 grid place-items-center"><div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-neon-cyan"/> Plan Mode
          </h1>
          <p className="text-white/30 text-sm font-mono mt-0.5">30/60/90-day goal tracking</p>
        </div>
        <button onClick={()=>setNew(n=>!n)} className="btn-neon text-xs px-4 py-2 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5"/> New Plan
        </button>
      </div>

      {/* Create plan form */}
      {showNew && (
        <div className="rounded-2xl p-6 animate-slide-up" style={{background:'rgba(0,245,255,0.03)',border:'1px solid rgba(0,245,255,0.15)'}}>
          <h3 className="font-display font-700 text-white mb-5">Create Plan</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-1.5">Title *</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="input-neon" placeholder="90-Day Fitness Transformation"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-1.5">Category</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="input-neon capitalize">
                  {CATS.map(c=><option key={c} value={c} className="bg-dark-900 capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-1.5">End Date</label>
                <input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} className="input-neon"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-1.5">Color</label>
              <div className="flex gap-2">{COLORS.map(c=>(
                <button type="button" key={c} onClick={()=>setForm(f=>({...f,color:c}))}
                  className={`w-7 h-7 rounded-full transition-all ${form.color===c?'scale-125 ring-2 ring-white ring-offset-1':''}`}
                  style={{background:c,ringOffsetColor:'#050516',boxShadow:`0 0 8px ${c}80`}}/>
              ))}</div>
            </div>
            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-1.5">Goals</label>
              <div className="flex gap-2 mb-2">
                <input value={newGoal} onChange={e=>setNG(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addGoalToForm())} className="input-neon flex-1" placeholder="Add a goal milestone..."/>
                <button type="button" onClick={addGoalToForm} className="btn-ghost-neon px-3"><Plus className="w-4 h-4"/></button>
              </div>
              {form.goals.map((g,i)=>(
                <div key={i} className="flex items-center gap-2 py-2 border-b" style={{borderColor:'rgba(255,255,255,0.05)'}}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{background:form.color}}/>
                  <span className="text-sm text-white/70 flex-1">{g.title}</span>
                  <button onClick={()=>setForm(f=>({...f,goals:f.goals.filter((_,j)=>j!==i)}))} className="text-white/20 hover:text-red-400 transition-colors">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>setNew(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={createPlan} disabled={saving} className="btn-neon flex-1 py-2.5 text-sm">
                {saving?<span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto block"/>:'Create Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans list */}
      {plans.length===0 ? (
        <div className="text-center py-16" style={{border:'1px dashed rgba(0,245,255,0.1)',borderRadius:16}}>
          <Target className="w-12 h-12 mx-auto mb-3" style={{color:'rgba(0,245,255,0.2)'}}/>
          <p className="font-display font-700 text-white/30 mb-1">No plans yet</p>
          <p className="text-sm text-white/20">Create your first 30/60/90-day plan</p>
        </div>
      ) : plans.map(plan=>{
        const done  = plan.goals.filter(g=>g.completed).length
        const total = plan.goals.length
        const pct   = plan.progress||0
        const isExp = expanded[plan._id]
        return (
          <div key={plan._id} className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{background:'rgba(255,255,255,0.02)',border:`1px solid ${plan.color}30`}}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:plan.color,boxShadow:`0 0 8px ${plan.color}`}}/>
                  <div>
                    <h3 className="font-display font-700 text-white">{plan.title}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-mono text-white/30 capitalize">{plan.category}</span>
                      {plan.endDate&&<span className="text-[10px] font-mono text-white/30">{format(new Date(plan.endDate),'MMM d, yyyy')}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-700" style={{color:plan.color}}>{pct}%</span>
                  <button onClick={()=>setExp(e=>({...e,[plan._id]:!e[plan._id]}))} className="p-1 text-white/30 hover:text-white transition-colors">
                    {isExp?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}
                  </button>
                  <button onClick={()=>deletePlan(plan._id)} className="p-1 text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
              <div className="xp-track">
                <div className="xp-fill" style={{width:`${pct}%`,background:`linear-gradient(90deg,${plan.color},${plan.color}aa)`}}/>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] font-mono text-white/25">{done}/{total} goals</span>
                <span className="text-[10px] font-mono text-white/25">{pct}% complete</span>
              </div>
            </div>
            {isExp&&(
              <div className="px-5 pb-5 space-y-2 border-t" style={{borderColor:'rgba(255,255,255,0.04)'}}>
                <div className="pt-4"/>
                {plan.goals.map(g=>(
                  <button key={g._id} onClick={()=>toggleGoal(plan._id,g._id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200"
                    style={{background:g.completed?`${plan.color}10`:'rgba(255,255,255,0.02)',border:`1px solid ${g.completed?plan.color+'40':'rgba(255,255,255,0.05)'}`}}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all" style={{background:g.completed?plan.color:'transparent',border:`2px solid ${g.completed?plan.color:'rgba(255,255,255,0.2)'}`}}>
                      {g.completed&&<Check className="w-3 h-3 text-black" strokeWidth={3}/>}
                    </div>
                    <span className={`text-sm flex-1 ${g.completed?'line-through text-white/30':'text-white/70'}`}>{g.title}</span>
                    {g.completedAt&&<span className="text-[10px] font-mono text-white/25">{format(new Date(g.completedAt),'MMM d')}</span>}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${g.priority==='high'?'text-red-400 bg-red-400/10':g.priority==='medium'?'text-yellow-400 bg-yellow-400/10':'text-white/30 bg-white/5'}`}>{g.priority}</span>
                  </button>
                ))}
                {plan.goals.length===0&&<p className="text-sm text-white/25 text-center py-3">No goals in this plan</p>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
