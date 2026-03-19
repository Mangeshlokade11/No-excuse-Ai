import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Brain, Trophy, Users, Target, BarChart3, MessageSquare, Star, CheckCircle, TrendingUp } from 'lucide-react'

const FEATURES = [
  { icon: <BarChart3 className="w-6 h-6"/>, title: 'Visual Habit Grid', desc: 'Monthly tracker that shows your entire year of discipline at a glance.', color: '#00f5ff' },
  { icon: <Brain className="w-6 h-6"/>, title: 'AI Daily Coach', desc: 'GPT-powered summaries, improvement advice, and motivation every night.', color: '#bf00ff' },
  { icon: <Zap className="w-6 h-6"/>, title: 'XP & Levels', desc: 'Gamified progression — earn XP, unlock badges, level up your identity.', color: '#00ff88' },
  { icon: <Target className="w-6 h-6"/>, title: 'Plan Mode', desc: '30/60/90-day goal plans with milestone tracking and progress bars.', color: '#ff0080' },
  { icon: <Trophy className="w-6 h-6"/>, title: 'Global Rankings', desc: 'Compete on live leaderboards ranked by XP, streaks, and discipline score.', color: '#ffee00' },
  { icon: <Users className="w-6 h-6"/>, title: 'Social Feed', desc: 'Share wins, follow high-performers, post reels and shorts of your journey.', color: '#ff6600' },
  { icon: <MessageSquare className="w-6 h-6"/>, title: 'Direct Messages', desc: 'Connect and message other members — build your accountability crew.', color: '#00f5ff' },
  { icon: <TrendingUp className="w-6 h-6"/>, title: 'Deep Analytics', desc: 'Heatmaps, pie charts, weekday patterns, and 30/60/90-day trend reports.', color: '#bf00ff' },
]

const REVIEWS = [
  { name: 'Marcus T.', location: 'New York, NY', role: 'Software Engineer at Goldman Sachs', stars: 5, text: 'NoExcuse.ai is the only app that actually held me accountable. The AI summary each night calls out exactly what I missed. 78-day streak and counting.', avatar: 'MT', streak: 78 },
  { name: 'Jordan K.', location: 'San Francisco, CA', role: 'Founder @ YC W24 Startup', stars: 5, text: 'As a founder juggling everything, this app keeps me grounded. The Plan Mode for 90-day goals changed how I operate. Nightly emails are incredibly detailed.', avatar: 'JK', streak: 45 },
  { name: 'Aisha W.', location: 'Chicago, IL', role: 'Pre-Med at University of Chicago', stars: 5, text: 'The leaderboard feature is addictive. I compete with 3 friends now — we hold each other accountable daily. Best productivity app I\'ve used in 4 years.', avatar: 'AW', streak: 112 },
  { name: 'Tyler R.', location: 'Austin, TX', role: 'Personal Trainer & Coach', stars: 5, text: 'I recommend this to all my clients now. The discipline score metric is a game-changer for people who want to quantify their consistency.', avatar: 'TR', streak: 94 },
  { name: 'Priya S.', location: 'Seattle, WA', role: 'Product Manager at Microsoft', stars: 5, text: 'Clean UI, powerful backend, smart AI. The social feed keeps you motivated because you see others crushing it. Haven\'t missed a day in 2 months.', avatar: 'PS', streak: 61 },
  { name: 'Devon M.', location: 'Miami, FL', role: 'Real Estate Investor', stars: 5, text: 'The email notifications are on point — login alerts, goal completions, daily summaries. Feels like a personal assistant that never sleeps.', avatar: 'DM', streak: 33 },
]

const PLANS = [
  { name: 'Free', price: '$0', period: 'forever', features: ['5 daily habits','Basic analytics','Leaderboard access','Social feed'], color: '#00f5ff', cta: 'Get Started' },
  { name: 'Pro', price: '$9', period: '/month', features: ['10 daily habits','AI coaching & summaries','Plan Mode (unlimited)','Advanced analytics','Priority support'], color: '#bf00ff', cta: 'Start Pro', popular: true },
  { name: 'Elite', price: '$19', period: '/month', features: ['Everything in Pro','Custom AI coaching','Private community','Weekly AI review','Badge & XP boosts'], color: '#00ff88', cta: 'Go Elite' },
]

const HabitGridPreview = () => {
  const data = Array.from({length: 5}, (_, hi) =>
    Array.from({length: 30}, (_, di) => di < 18 && Math.random() > (hi*0.08 + 0.1))
  )
  const colors = ['#00f5ff','#bf00ff','#00ff88','#ff0080','#ffee00']
  const names  = ['Morning Run','Cold Shower','Meditate','Read','No Sugar']
  return (
    <div className="overflow-x-auto no-scroll rounded-xl p-4" style={{background:'rgba(0,245,255,0.03)',border:'1px solid rgba(0,245,255,0.1)'}}>
      <div className="min-w-max">
        <div className="flex items-center gap-1 mb-2">
          <div className="w-24 text-[10px] font-mono text-white/30 uppercase tracking-wider">Habits</div>
          {Array.from({length:30},(_,i)=><div key={i} className={`w-6 text-center text-[9px] font-mono ${i===17?'text-neon-cyan':'text-white/20'}`}>{i+1}</div>)}
        </div>
        {data.map((row, hi) => (
          <div key={hi} className="flex items-center gap-1 mb-1">
            <div className="w-24 text-[10px] text-white/50 truncate">{names[hi]}</div>
            {row.map((done, di) => (
              <div key={di} className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] transition-all ${di===17?'ring-1':''}`}
                style={{
                  background: done ? `${colors[hi]}22` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${done ? colors[hi]+'44' : 'rgba(255,255,255,0.05)'}`,
                  ringColor: colors[hi],
                  boxShadow: done && di===17 ? `0 0 8px ${colors[hi]}60` : undefined
                }}>
                {done && <span style={{color:colors[hi]}}>✓</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{background:'#020208'}}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4" style={{background:'rgba(2,2,8,0.8)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(0,245,255,0.06)'}}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',boxShadow:'0 0 15px rgba(0,245,255,0.4)'}}>
            <Zap className="w-4 h-4 text-black" fill="currentColor"/>
          </div>
          <span className="font-display font-800 text-gradient-neon tracking-tight">NoExcuse.ai</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-white/50 hover:text-white transition-colors font-medium px-3 py-1.5">Sign In</Link>
          <Link to="/signup" className="btn-neon text-sm px-5 py-2 font-700">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-16 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-600 mb-8 animate-fade-in"
          style={{background:'rgba(0,245,255,0.07)',border:'1px solid rgba(0,245,255,0.2)',color:'#00f5ff'}}>
          <span className="glow-dot w-1.5 h-1.5"/>
          AI-Powered · Real-Time · No Excuses
        </div>

        <h1 className="font-display font-900 text-5xl lg:text-7xl leading-[1.05] tracking-tight mb-6 animate-slide-up">
          Build habits that<br/>
          <span className="text-gradient-neon">compound forever</span>
        </h1>

        <p className="text-lg lg:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
          The only habit tracker with AI coaching, social accountability, gamified XP, and nightly email summaries. Used by high-performers across America.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link to="/signup" className="btn-neon flex items-center gap-2 text-base px-8 py-3.5">
            Start for Free <ArrowRight className="w-4 h-4"/>
          </Link>
          <Link to="/login" className="btn-ghost-neon text-base px-8 py-3.5">Sign In</Link>
        </div>
        <p className="text-xs text-white/20 font-mono">No credit card · 10 habits free · Pro from $9/mo</p>

        {/* Grid preview */}
        <div className="mt-16 max-w-3xl mx-auto animate-fade-in">
          <HabitGridPreview/>
        </div>
      </section>

      {/* Stats bar */}
      <div className="py-10 border-y" style={{borderColor:'rgba(0,245,255,0.06)',background:'rgba(0,245,255,0.02)'}}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[['50K+','Users Nationwide'],['98%','30-Day Retention'],['4.9M','Habits Tracked'],['89','Avg Streak Days']].map(([v,l])=>(
            <div key={l}>
              <div className="font-display font-900 text-3xl lg:text-4xl text-gradient-neon">{v}</div>
              <div className="text-sm text-white/30 mt-1 font-mono">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-24 px-6 lg:px-16 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-800 text-3xl lg:text-5xl mb-4">Everything you need to<span className="text-gradient-neon"> stay consistent</span></h2>
          <p className="text-white/30 max-w-xl mx-auto">Built for people who take their performance seriously.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="group rounded-2xl p-5 transition-all duration-300 cursor-default"
              style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)'}}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${f.color}40`; e.currentTarget.style.background=`${f.color}06` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'; e.currentTarget.style.background='rgba(255,255,255,0.02)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{background:`${f.color}15`,color:f.color}}>
                {f.icon}
              </div>
              <h3 className="font-display font-700 text-white text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-6 lg:px-16 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display font-800 text-3xl lg:text-4xl mb-3">Real results from <span className="text-gradient-neon">real Americans</span></h2>
          <p className="text-white/30 text-sm font-mono">From NYC to LA — top performers trust NoExcuse.ai</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map(r => (
            <div key={r.name} className="rounded-2xl p-5 transition-all duration-300"
              style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-display font-800 text-black flex-shrink-0"
                  style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)'}}>
                  {r.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-600 text-white text-sm">{r.name}</span>
                    <span className="text-[10px] font-mono text-orange-400">{r.streak}d</span>
                  </div>
                  <div className="text-[10px] text-white/30 truncate">{r.role}</div>
                  <div className="text-[10px] text-white/20 font-mono">{r.location}</div>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(r.stars)].map((_,i) => <Star key={i} className="w-3 h-3 text-yellow-400" fill="currentColor"/>)}
              </div>
              <p className="text-sm text-white/50 leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 lg:px-16 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display font-800 text-3xl lg:text-4xl mb-3">Simple <span className="text-gradient-neon">pricing</span></h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          {PLANS.map(p => (
            <div key={p.name} className={`relative rounded-2xl p-6 transition-all duration-300 ${p.popular?'scale-105':''}`}
              style={{background: p.popular?`${p.color}08`:'rgba(255,255,255,0.02)',border:`1px solid ${p.popular?p.color+'40':'rgba(255,255,255,0.06)'}`,boxShadow:p.popular?`0 0 40px ${p.color}15`:undefined}}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-700 font-mono text-black" style={{background:`linear-gradient(90deg,${p.color},#00f5ff)`}}>MOST POPULAR</div>}
              <div className="mb-5">
                <div className="text-sm font-mono font-600 mb-1" style={{color:p.color}}>{p.name}</div>
                <div className="flex items-end gap-1">
                  <span className="font-display font-900 text-4xl text-white">{p.price}</span>
                  <span className="text-sm text-white/30 pb-1 font-mono">{p.period}</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:p.color}}/>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full text-center py-3 rounded-xl font-700 text-sm transition-all duration-200"
                style={{background:p.popular?`linear-gradient(135deg,${p.color},#00f5ff)`:`${p.color}15`,color:p.popular?'#000':p.color,border:`1px solid ${p.color}40`}}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto rounded-3xl p-12" style={{background:'rgba(0,245,255,0.04)',border:'1px solid rgba(0,245,255,0.15)',boxShadow:'0 0 60px rgba(0,245,255,0.06)'}}>
          <div className="font-display font-900 text-4xl lg:text-5xl mb-4 text-gradient-neon">No Excuses.</div>
          <p className="text-white/40 mb-8">Join 50,000+ Americans building their best habits.</p>
          <Link to="/signup" className="btn-neon inline-flex items-center gap-2 text-base px-10 py-4">
            Start Free Today <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center" style={{borderColor:'rgba(255,255,255,0.04)'}}>
        <p className="font-mono text-xs text-white/20">© 2025 NoExcuse.ai — No Excuses. Just Results. · Made in the USA</p>
      </footer>
    </div>
  )
}
