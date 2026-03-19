export const NeonCard = ({ children, className = '', glow = false, color = 'cyan' }) => {
  const colors = { cyan:'rgba(0,245,255,', purple:'rgba(191,0,255,', green:'rgba(0,255,136,', pink:'rgba(255,0,128,' }
  const c = colors[color] || colors.cyan
  return (
    <div className={`rounded-2xl p-5 transition-all duration-300 ${className}`}
      style={{
        background: `${c}0.03)`,
        border: `1px solid ${c}0.12)`,
        boxShadow: glow ? `0 0 30px ${c}0.1), 0 4px 24px rgba(0,0,0,0.5)` : '0 4px 24px rgba(0,0,0,0.4)'
      }}>
      {children}
    </div>
  )
}

export const NeonBadge = ({ children, color = 'cyan' }) => {
  const colors = { cyan:'#00f5ff', purple:'#bf00ff', green:'#00ff88', pink:'#ff0080', orange:'#ff6600' }
  const c = colors[color] || colors.cyan
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-600"
      style={{ color: c, background: `${c}18`, border: `1px solid ${c}30` }}>
      {children}
    </span>
  )
}

export const NeonDivider = () => (
  <div className="h-px w-full" style={{background:'linear-gradient(90deg,transparent,rgba(0,245,255,0.2),transparent)'}}/>
)

export const StatCard = ({ label, value, sub, icon, color = '#00f5ff', glow = false }) => (
  <div className="stat-card" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:16}}>
    <div className="flex items-center justify-between mb-3">
      <div className="text-2xl">{icon}</div>
      {sub && <span className="text-[10px] font-mono text-white/30">{sub}</span>}
    </div>
    <div className="font-display font-800 text-2xl leading-none mb-1" style={{ color, ...(glow ? {textShadow:`0 0 20px ${color}80`} : {}) }}>{value}</div>
    <div className="text-xs text-white/40 font-body">{label}</div>
  </div>
)

export const AvatarNeon = ({ src, name, size = 10, className = '' }) => (
  <div className={`w-${size} h-${size} rounded-full flex-shrink-0 flex items-center justify-center font-display font-700 text-black ${className}`}
    style={src ? {} : {background:'linear-gradient(135deg,#00f5ff,#bf00ff)',boxShadow:'0 0 0 2px rgba(0,245,255,0.3)'}}>
    {src ? <img src={src} className={`w-full h-full rounded-full object-cover`} style={{boxShadow:'0 0 0 2px rgba(0,245,255,0.3)'}}/> : name?.[0]?.toUpperCase()}
  </div>
)
