import { useState } from 'react'
import { Brain, Sparkles, TrendingUp, Lightbulb, Zap } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function AISummary({ log }) {
  const [summary, setSummary] = useState(log?.aiSummary||null)
  const [loading, setL]       = useState(false)

  const gen = async () => {
    setL(true)
    try { const { data } = await api.post('/ai/summary'); setSummary(data); toast.success('AI summary ready') }
    catch(e) { toast.error(e.response?.data?.message||'AI unavailable') }
    finally { setL(false) }
  }

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{background:'rgba(0,245,255,0.03)',border:'1px solid rgba(0,245,255,0.1)'}}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{background:'radial-gradient(circle,rgba(0,245,255,0.08) 0%,transparent 70%)'}}/>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'rgba(0,245,255,0.15)',border:'1px solid rgba(0,245,255,0.2)'}}>
              <Brain className="w-4 h-4 text-neon-cyan"/>
            </div>
            <div>
              <div className="font-display font-700 text-white text-sm">AI Coach</div>
              <div className="text-[10px] text-white/30 font-mono">Daily Intelligence</div>
            </div>
          </div>
          <button onClick={gen} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-600 transition-all disabled:opacity-50"
            style={{background:'rgba(0,245,255,0.1)',color:'#00f5ff',border:'1px solid rgba(0,245,255,0.2)'}}>
            {loading?<><span className="w-3 h-3 border border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin"/>Thinking...</>:<><Sparkles className="w-3 h-3"/>{summary?'Refresh':'Generate'}</>}
          </button>
        </div>

        {summary?(
          <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.1)'}}>
              <div className="text-[9px] font-mono font-700 uppercase tracking-wider mb-1.5" style={{color:'#00ff88'}}>Performance</div>
              <p className="text-xs text-white/60 leading-relaxed">{summary.performance}</p>
            </div>
            <div className="p-3 rounded-xl" style={{background:'rgba(255,238,0,0.04)',border:'1px solid rgba(255,238,0,0.1)'}}>
              <div className="text-[9px] font-mono font-700 uppercase tracking-wider mb-1.5" style={{color:'#ffee00'}}>Advice</div>
              <p className="text-xs text-white/60 leading-relaxed">{summary.advice}</p>
            </div>
            <div className="p-3 rounded-xl" style={{background:'rgba(0,245,255,0.06)',border:'1px solid rgba(0,245,255,0.15)'}}>
              <p className="text-xs text-white/70 italic leading-relaxed">"{summary.motivation}"</p>
            </div>
          </div>
        ):(
          <div className="text-center py-5">
            <Brain className="w-8 h-8 mx-auto mb-2" style={{color:'rgba(0,245,255,0.3)'}}/>
            <p className="text-xs text-white/30">Generate your AI daily analysis</p>
          </div>
        )}
      </div>
    </div>
  )
}
