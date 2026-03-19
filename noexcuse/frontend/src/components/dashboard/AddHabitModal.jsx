import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const ICONS  = ['⭐','💪','📚','🧘','🚿','🏃','💧','🥗','😴','✍️','🎯','🔥','🧠','💰','📱','🎸','🌿','🎨']
const COLORS = ['#00f5ff','#bf00ff','#00ff88','#ff0080','#ffee00','#ff6600','#06b6d4','#10b981','#f59e0b']
const CATS   = ['health','fitness','mindfulness','productivity','learning','social','finance','other']

export default function AddHabitModal({ onAdd, onClose }) {
  const [f, setF]    = useState({ name:'', icon:'⭐', color:'#00f5ff', category:'other', xpReward:10 })
  const [saving, sS] = useState(false)
  const set = k => v => setF(p=>({...p,[k]:v}))

  const submit = async e => {
    e.preventDefault()
    if (!f.name.trim()) return toast.error('Name required')
    sS(true)
    try { await onAdd(f); onClose() }
    catch(e) { toast.error(e.response?.data?.message||'Failed') }
    finally { sS(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-md rounded-2xl animate-scale-in" style={{background:'rgba(5,5,22,0.98)',border:'1px solid rgba(0,245,255,0.2)',boxShadow:'0 0 60px rgba(0,245,255,0.1)'}}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{borderColor:'rgba(255,255,255,0.05)'}}>
          <h2 className="font-display font-700 text-white">New Habit</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white transition-all" style={{background:'rgba(255,255,255,0.04)'}}><X className="w-4 h-4"/></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Habit Name</label>
            <input value={f.name} onChange={e=>set('name')(e.target.value)} className="input-neon" placeholder="Morning Workout" maxLength={50}/>
          </div>
          <div>
            <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic=>(
                <button type="button" key={ic} onClick={()=>set('icon')(ic)}
                  className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all duration-150 ${f.icon===ic?'ring-2 ring-neon-cyan scale-110':''}`}
                  style={{background:f.icon===ic?'rgba(0,245,255,0.15)':'rgba(255,255,255,0.04)',border:`1px solid ${f.icon===ic?'rgba(0,245,255,0.4)':'rgba(255,255,255,0.06)'}`}}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Color</label>
            <div className="flex gap-2">
              {COLORS.map(c=>(
                <button type="button" key={c} onClick={()=>set('color')(c)}
                  className={`w-7 h-7 rounded-full transition-all ${f.color===c?'scale-125 ring-2 ring-white ring-offset-2':''}`}
                  style={{background:c,ringOffsetColor:'#050516',boxShadow:`0 0 8px ${c}80`}}/>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Category</label>
              <select value={f.category} onChange={e=>set('category')(e.target.value)} className="input-neon capitalize">
                {CATS.map(c=><option key={c} value={c} className="bg-dark-900 capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">XP Reward</label>
              <select value={f.xpReward} onChange={e=>set('xpReward')(Number(e.target.value))} className="input-neon">
                {[5,10,15,20,25,30].map(v=><option key={v} value={v} className="bg-dark-900">{v} XP</option>)}
              </select>
            </div>
          </div>
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:`${f.color}18`,border:`1px solid ${f.color}40`}}>{f.icon}</div>
            <div>
              <div className="font-600 text-sm text-white">{f.name||'Habit name'}</div>
              <div className="text-xs font-mono" style={{color:f.color}}>+{f.xpReward} XP/day</div>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-neon flex-1 flex items-center justify-center gap-2 py-2.5 text-sm">
              {saving?<span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/>:<><Plus className="w-4 h-4"/>Add Habit</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
