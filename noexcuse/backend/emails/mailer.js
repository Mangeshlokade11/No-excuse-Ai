// const nodemailer = require('nodemailer');

// const createTransport = () => {
//   if (!process.env.MAIL_USER || !process.env.MAIL_PASS) { console.warn('⚠️ Emails disabled'); return null; }
//   return nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS } });
// };

// const APP   = process.env.CLIENT_URL ;
// const BRAND = '#00f5ff';
// const YEAR  = new Date().getFullYear();

// const CSS = `
// *{box-sizing:border-box;margin:0;padding:0}
// body{background:#030308;font-family:'Segoe UI',Arial,sans-serif;color:#fff}
// .wrap{max-width:580px;margin:0 auto;background:#030308}
// .hdr{background:linear-gradient(135deg,#0a0a1a 0%,#0d0d20 100%);padding:32px;text-align:center;border-bottom:1px solid #00f5ff22}
// .logo{font-size:26px;font-weight:900;background:linear-gradient(90deg,#00f5ff,#bf00ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-1px}
// .logo-sub{font-size:11px;color:#ffffff40;margin-top:4px;letter-spacing:2px;text-transform:uppercase}
// .body{padding:28px 32px}
// .h1{font-size:20px;font-weight:700;color:#fff;margin-bottom:10px}
// .txt{color:#8080a0;font-size:14px;line-height:1.75;margin-bottom:16px}
// .card{background:#0a0a18;border:1px solid #ffffff10;border-radius:14px;padding:20px;margin-bottom:14px}
// .card-title{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND};margin-bottom:14px}
// .row{display:flex;align-items:center;padding:9px 0;border-bottom:1px solid #0f0f1e}
// .row:last-child{border-bottom:none}
// .chk{width:20px;height:20px;border-radius:6px;text-align:center;line-height:20px;font-size:10px;font-weight:700;margin-right:10px;flex-shrink:0}
// .ok{background:rgba(0,245,255,0.15);color:${BRAND}}
// .no{background:rgba(239,68,68,0.15);color:#f87171}
// .nm{flex:1;font-size:13px;color:#c0c0d0}
// .xp-pill{font-size:10px;font-weight:600;color:${BRAND};background:rgba(0,245,255,0.12);padding:2px 7px;border-radius:20px}
// .stat-t{width:100%;border-collapse:separate;border-spacing:8px}
// .sc{background:#0d0d1a;border:1px solid #ffffff0d;border-radius:12px;padding:14px 10px;text-align:center}
// .sv{font-size:20px;font-weight:800;color:#fff}
// .sl{font-size:10px;color:#50506070;margin-top:4px;text-transform:uppercase;letter-spacing:.5px}
// .bar-t{background:#111128;border-radius:20px;height:7px;overflow:hidden;margin:8px 0}
// .bar-f{height:7px;border-radius:20px;background:linear-gradient(90deg,${BRAND},#bf00ff)}
// .quote{background:rgba(0,245,255,0.04);border-left:3px solid ${BRAND};border-radius:0 12px 12px 0;padding:16px 20px;margin:16px 0}
// .qt{font-size:14px;color:#a0a0c0;font-style:italic;line-height:1.7}
// .qa{font-size:11px;color:${BRAND};margin-top:8px;font-weight:600}
// .cta{text-align:center;margin:22px 0}
// .btn{display:inline-block;background:linear-gradient(135deg,${BRAND},#bf00ff);color:#000;text-decoration:none;padding:13px 36px;border-radius:12px;font-size:14px;font-weight:800;letter-spacing:.3px}
// .warn{background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:12px;padding:14px 18px;margin-bottom:14px}
// .warn p{color:#fbbf24;font-size:13px;line-height:1.6}
// .ok-box{background:rgba(0,245,255,0.06);border:1px solid rgba(0,245,255,0.2);border-radius:12px;padding:14px 18px;margin-bottom:14px}
// .ok-box p{color:${BRAND};font-size:13px;line-height:1.6}
// .badge-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #0f0f1e}
// .badge-row:last-child{border-bottom:none}
// .bi{font-size:22px}
// .bn{font-size:13px;font-weight:600;color:#fff}
// .bd{font-size:11px;color:#505070;margin-top:2px}
// .new-pill{font-size:9px;font-weight:700;background:${BRAND};color:#000;padding:2px 7px;border-radius:20px;white-space:nowrap}
// .foot{padding:22px 32px;border-top:1px solid #0a0a18;text-align:center}
// .foot p{color:#252530;font-size:11px;line-height:2}
// .foot a{color:${BRAND};text-decoration:none}
// `;

// const hdr = (sub='Discipline Intelligence') => `<div class="hdr"><div class="logo">NoExcuse.ai</div><div class="logo-sub">${sub}</div></div>`;
// const ftr = () => `<div class="foot"><p>© ${YEAR} NoExcuse.ai &nbsp;·&nbsp; <a href="${APP}">Open App</a> &nbsp;·&nbsp; No Excuses. Just Results.</p></div>`;
// const wrap = (body, sub) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${CSS}</style></head><body><div class="wrap">${hdr(sub)}${body}${ftr()}</div></body></html>`;

// // ── 1. WELCOME ────────────────────────────────────────────────────────────────
// const sendWelcomeEmail = async (user) => {
//   const t = createTransport(); if (!t) return;
//   const body = `<div class="body">
//     <p class="h1">Welcome, ${user.name}! 🎯</p>
//     <p class="txt">Your username is <strong style="color:${BRAND}">@${user.username}</strong>. You're now part of an elite community that doesn't make excuses.</p>
//     <div class="card">
//       <div class="card-title">Everything unlocked</div>
//       <div class="row"><span class="chk ok">✓</span><span class="nm">Track up to 10 daily habits with visual grid</span></div>
//       <div class="row"><span class="chk ok">✓</span><span class="nm">Earn XP, level up, unlock achievement badges</span></div>
//       <div class="row"><span class="chk ok">✓</span><span class="nm">AI-powered daily coaching and weekly insights</span></div>
//       <div class="row"><span class="chk ok">✓</span><span class="nm">Plan Mode — set 30/60/90 day goals</span></div>
//       <div class="row"><span class="chk ok">✓</span><span class="nm">Social feed: posts, reels, follow, DMs</span></div>
//       <div class="row"><span class="chk ok">✓</span><span class="nm">Global leaderboard — compete with the best</span></div>
//       <div class="row"><span class="chk ok">✓</span><span class="nm">Nightly AI summary delivered to your inbox</span></div>
//     </div>
//     <div class="cta"><a href="${APP}/dashboard" class="btn">Start Day One →</a></div>
//     <div class="quote"><p class="qt">"We are what we repeatedly do. Excellence, then, is not an act, but a habit."</p><p class="qa">— Aristotle</p></div>
//   </div>`;
//   await t.sendMail({ from:`"NoExcuse.ai" <${process.env.MAIL_USER}>`, to:user.email, subject:'Welcome to NoExcuse.ai — No Excuses, Just Results', html:wrap(body,'Welcome!') });
//   console.log(`📧 Welcome → ${user.email}`);
// };

// // ── 2. LOGIN ALERT ────────────────────────────────────────────────────────────
// const sendLoginAlertEmail = async (user, meta={}) => {
//   const t = createTransport(); if (!t || !user.notifyOnLogin) return;
//   const time   = new Date().toLocaleString('en-US',{timeZone:'America/New_York',dateStyle:'full',timeStyle:'short'});
//   const device = String(meta.userAgent||'Unknown').substring(0,80);
//   const ip     = meta.ip||'Unknown';
//   const body = `<div class="body">
//     <p class="h1">New Sign-In Detected</p>
//     <p class="txt">Hey <strong style="color:#fff">${user.name}</strong>, someone just logged into your NoExcuse.ai account.</p>
//     <div class="card">
//       <div class="card-title">Login Details</div>
//       <table style="width:100%;font-size:13px;border-collapse:collapse">
//         <tr><td style="color:#505070;padding:8px 0;border-bottom:1px solid #0f0f1e;width:34%">Time (EST)</td><td style="color:#c0c0d0;padding:8px 0;border-bottom:1px solid #0f0f1e">${time}</td></tr>
//         <tr><td style="color:#505070;padding:8px 0;border-bottom:1px solid #0f0f1e">Account</td><td style="color:#c0c0d0;padding:8px 0;border-bottom:1px solid #0f0f1e">${user.email}</td></tr>
//         <tr><td style="color:#505070;padding:8px 0;border-bottom:1px solid #0f0f1e">IP</td><td style="color:#c0c0d0;padding:8px 0;border-bottom:1px solid #0f0f1e">${ip}</td></tr>
//         <tr><td style="color:#505070;padding:8px 0">Device</td><td style="color:#c0c0d0;padding:8px 0">${device}</td></tr>
//       </table>
//     </div>
//     <div class="warn"><p>⚠️ Not you? Change your password immediately.</p></div>
//     <div class="ok-box"><p>All good? Keep building those habits — you're on a ${user.currentStreak}-day streak!</p></div>
//   </div>`;
//   await t.sendMail({ from:`"NoExcuse.ai" <${process.env.MAIL_USER}>`, to:user.email, subject:'Security Alert: New Login to NoExcuse.ai', html:wrap(body,'Security Alert') });
// };

// // ── 3. SIGNUP CONFIRMATION ────────────────────────────────────────────────────
// const sendSignupConfirmEmail = async (user) => {
//   const t = createTransport(); if (!t) return;
//   const body = `<div class="body">
//     <p class="h1">Account Created Successfully</p>
//     <p class="txt">Your NoExcuse.ai account is live. Username: <strong style="color:${BRAND}">@${user.username}</strong></p>
//     <div class="ok-box"><p>Your account is fully set up and ready. Head to your dashboard to add your first habits.</p></div>
//     <div class="cta"><a href="${APP}/dashboard" class="btn">Go to Dashboard →</a></div>
//   </div>`;
//   await t.sendMail({ from:`"NoExcuse.ai" <${process.env.MAIL_USER}>`, to:user.email, subject:'Account Confirmed — NoExcuse.ai', html:wrap(body,'Account Active') });
// };

// // ── 4. GOAL ADDED ─────────────────────────────────────────────────────────────
// const sendGoalAddedEmail = async (user, habit) => {
//   const t = createTransport(); if (!t || !user.emailNotifications) return;
//   const body = `<div class="body">
//     <p class="h1">New Habit Added</p>
//     <p class="txt">You just added a new habit to your daily system. Commitment made.</p>
//     <div class="card">
//       <div class="card-title">New Goal</div>
//       <div style="display:flex;align-items:center;gap:14px">
//         <div style="width:48px;height:48px;border-radius:14px;background:${habit.color}22;border:1px solid ${habit.color}55;text-align:center;line-height:48px;font-size:24px;flex-shrink:0">${habit.icon}</div>
//         <div>
//           <div style="font-size:16px;font-weight:700;color:#fff">${habit.name}</div>
//           <div style="font-size:12px;color:#505070;margin-top:3px;text-transform:capitalize">${habit.category} · +${habit.xpReward} XP per day</div>
//         </div>
//       </div>
//     </div>
//     <p class="txt">Every day you complete this habit, you earn <strong style="color:${BRAND}">${habit.xpReward} XP</strong>. Miss it, and you know what happens to your streak.</p>
//     <div class="cta"><a href="${APP}/dashboard" class="btn">Start Today →</a></div>
//   </div>`;
//   await t.sendMail({ from:`"NoExcuse.ai" <${process.env.MAIL_USER}>`, to:user.email, subject:`New Habit Added: ${habit.name}`, html:wrap(body,'New Goal') });
// };

// // ── 5. GOAL COMPLETED ────────────────────────────────────────────────────────
// const sendGoalCompletedEmail = async (user, habit, stats={}) => {
//   const t = createTransport(); if (!t || !user.notifyOnGoal) return;
//   const { newBadges=[], dailyProgress={}, levelUp=false } = stats;
//   const isMilestone = [7,14,30,60,100].includes(user.currentStreak);
//   const body = `<div class="body">
//     <p class="h1">Habit Completed</p>
//     <p class="txt">Nice work, <strong style="color:#fff">${user.name}</strong>. <strong style="color:${BRAND}">${habit.name}</strong> — done. +${habit.xpReward} XP.</p>
//     <div class="card">
//       <div class="card-title">Completed</div>
//       <table style="width:100%"><tr>
//         <td style="width:56px"><div style="width:48px;height:48px;border-radius:14px;background:${habit.color}22;border:1px solid ${habit.color}55;text-align:center;line-height:48px;font-size:24px">${habit.icon}</div></td>
//         <td style="padding-left:14px"><div style="font-size:16px;font-weight:700;color:#fff">${habit.name}</div><div style="font-size:12px;color:#505070;margin-top:3px;text-transform:capitalize">${habit.category}</div></td>
//         <td style="text-align:right"><div style="font-size:22px;font-weight:800;color:${BRAND}">+${habit.xpReward}</div><div style="font-size:10px;color:#505070">XP</div></td>
//       </tr></table>
//     </div>
//     ${dailyProgress.total>0?`<div class="card"><div class="card-title">Today's Progress</div><table style="width:100%;margin-bottom:8px"><tr><td style="font-size:13px;color:#9090b0">${dailyProgress.done}/${dailyProgress.total} habits</td><td style="text-align:right;font-size:14px;font-weight:700;color:${BRAND}">${dailyProgress.pct}%</td></tr></table><div class="bar-t"><div class="bar-f" style="width:${dailyProgress.pct}%"></div></div></div>`:''}
//     <div class="card"><div class="card-title">Streak</div><div style="text-align:center;padding:8px 0 12px"><div style="font-size:48px;font-weight:900;color:${BRAND}">${user.currentStreak}</div><div style="font-size:13px;color:#505070;margin-top:5px">consecutive days</div></div>${isMilestone?`<div class="ok-box" style="margin:0"><p>${user.currentStreak}-day milestone! You're in elite territory.</p></div>`:''}</div>
//     ${newBadges.length>0?`<div class="card">${newBadges.map(b=>`<div class="badge-row"><span class="bi">${b.icon}</span><div style="flex:1"><div class="bn">${b.name}</div><div class="bd">${b.description}</div></div><span class="new-pill">NEW</span></div>`).join('')}</div>`:''}
//     ${levelUp?`<div class="card" style="text-align:center;padding:24px"><div style="font-size:36px;margin-bottom:6px">⬆</div><div style="font-size:18px;font-weight:800;color:${BRAND}">Level Up! You're Level ${user.level}</div></div>`:''}
//     <div class="cta"><a href="${APP}/dashboard" class="btn">View Dashboard →</a></div>
//   </div>`;
//   await t.sendMail({ from:`"NoExcuse.ai" <${process.env.MAIL_USER}>`, to:user.email, subject:`Completed: ${habit.name} +${habit.xpReward}XP${isMilestone?` · ${user.currentStreak}-Day Streak!`:''}`, html:wrap(body,'Goal Completed') });
// };

// // ── 6. DAILY SUMMARY ─────────────────────────────────────────────────────────
// const sendDailySummaryEmail = async (user, log, summary, allHabits) => {
//   const t = createTransport(); if (!t || !user.emailNotifications) return;
//   const completedHabits = log?.completedHabits||[];
//   const completedIds    = new Set(completedHabits.map(c=>(c.habit?._id||c.habit)?.toString()));
//   const done   = completedIds.size;
//   const total  = allHabits.length;
//   const pct    = total>0?Math.round((done/total)*100):0;
//   const xp     = log?.xpEarned||0;
//   const score  = log?.score||0;
//   const badges = log?.newBadgesEarned||[];
//   const sc     = score>=8?BRAND:score>=5?'#bf00ff':'#f59e0b';
//   const grade  = score===10?'PERFECT DAY':score>=8?'EXCELLENT':score>=5?'SOLID':score>=3?'KEEP GOING':'FRESH START TOMORROW';
//   const xpNext = user.level*100, xpIn=(user.xp%xpNext), xpPct=Math.min(Math.round(xpIn/xpNext*100),100);
//   const dateStr= new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric',timeZone:'America/New_York'});
//   const body = `<div class="body">
//     <p style="font-size:12px;color:#404060;margin-bottom:4px">${dateStr} — EST</p>
//     <p class="h1">Your Daily Report</p>
//     <div class="card" style="text-align:center;padding:28px 20px">
//       <div style="font-size:60px;font-weight:900;color:${sc};line-height:1">${score}<span style="font-size:24px;color:#505070">/10</span></div>
//       <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:${sc};margin-top:8px">${grade}</div>
//       <div style="font-size:13px;color:#9090b0;margin-top:8px">Discipline Score</div>
//     </div>
//     <table class="stat-t"><tr>
//       <td class="sc"><div class="sv">${done}/${total}</div><div class="sl">Done</div></td>
//       <td class="sc"><div class="sv" style="color:${BRAND}">+${xp}</div><div class="sl">XP</div></td>
//       <td class="sc"><div class="sv" style="color:${BRAND}">${user.currentStreak}d</div><div class="sl">Streak</div></td>
//       <td class="sc"><div class="sv" style="color:#bf00ff">${user.level}</div><div class="sl">Level</div></td>
//     </table>
//     <div class="card"><div class="card-title">XP Progress</div><table style="width:100%;margin-bottom:8px"><tr><td style="font-size:13px;color:#fff;font-weight:600">Level ${user.level}</td><td style="text-align:right;font-size:12px;color:${BRAND}">${xpIn}/${xpNext} XP</td></tr></table><div class="bar-t"><div class="bar-f" style="width:${xpPct}%"></div></div><p style="font-size:11px;color:#505070;margin-top:8px">Total: ${user.xp} XP · ${xpNext-xpIn} to Level ${user.level+1}</p></div>
//     ${summary?`<div class="card"><div class="card-title">AI Coach Analysis</div><div style="margin-bottom:14px"><div style="font-size:10px;font-weight:700;color:#00f5ff;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Performance</div><p style="font-size:13px;color:#c0c0d0;line-height:1.7">${summary.performance}</p></div><div style="padding-top:14px;border-top:1px solid #0f0f1e;margin-bottom:14px"><div style="font-size:10px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Tomorrow's Focus</div><p style="font-size:13px;color:#c0c0d0;line-height:1.7">${summary.advice}</p></div><div class="quote" style="margin:0"><p class="qt">"${summary.motivation}"</p></div></div>`:''}
//     <div class="card"><div class="card-title">Habit Breakdown (${done} done · ${total-done} missed)</div>${allHabits.map(h=>{const d=completedIds.has(h._id.toString());return`<div class="row"><span class="chk ${d?'ok':'no'}">${d?'✓':'✗'}</span><span class="nm">${h.icon} ${h.name}</span>${d?`<span class="xp-pill">+${h.xpReward}XP</span>`:'<span style="font-size:10px;color:#3a3a50">missed</span>'}</div>`}).join('')}<div style="margin-top:14px;padding-top:14px;border-top:1px solid #0f0f1e"><table style="width:100%;margin-bottom:6px"><tr><td style="font-size:11px;color:#505070">Completion</td><td style="text-align:right;font-size:11px;font-weight:700;color:${sc}">${pct}%</td></tr></table><div class="bar-t"><div class="bar-f" style="width:${pct}%"></div></div></div></div>
//     ${badges.length>0?`<div class="card" style="border-color:${BRAND}30"><div class="card-title" style="color:${BRAND}">Badges Earned Today</div>${badges.map(b=>`<div class="badge-row"><span class="bi">${b.icon}</span><div style="flex:1"><div class="bn">${b.name}</div><div class="bd">${b.description}</div></div><span class="new-pill">NEW</span></div>`).join('')}</div>`:''}
//     ${[7,14,30,60,100].includes(user.currentStreak)?`<div class="ok-box"><p>${user.currentStreak}-day streak milestone! You're officially in the top 1% of this platform.</p></div>`:''}
//     <div style="text-align:center;padding:14px 0;border-top:1px solid #0a0a18;border-bottom:1px solid #0a0a18;margin:18px 0"><span style="font-size:12px;color:#404060">Level ${user.level} · ${user.xp} XP · Best streak: ${user.longestStreak}d · ${user.badges?.length||0} badges · ${user.totalHabitsCompleted} habits all-time</span></div>
//     <div class="cta"><a href="${APP}/dashboard" class="btn">Full Dashboard →</a></div>
//   </div>`;
//   await t.sendMail({ from:`"NoExcuse.ai" <${process.env.MAIL_USER}>`, to:user.email, subject:`Daily Report: ${pct}% · ${user.currentStreak}d streak · Score ${score}/10 — NoExcuse.ai`, html:wrap(body,'Daily Report') });
//   console.log(`📧 Daily summary → ${user.email}`);
// };

// // ── 7. FOLLOW NOTIFICATION ────────────────────────────────────────────────────
// const sendFollowEmail = async (user, follower) => {
//   const t = createTransport(); if (!t || !user.emailNotifications) return;
//   const body = `<div class="body">
//     <p class="h1">New Follower</p>
//     <p class="txt"><strong style="color:${BRAND}">@${follower.username}</strong> (${follower.name}) just followed you on NoExcuse.ai.</p>
//     <div class="ok-box"><p>They're watching your streak. Don't let them down. Keep showing up.</p></div>
//     <div class="cta"><a href="${APP}/profile/${follower.username}" class="btn">View Their Profile →</a></div>
//   </div>`;
//   await t.sendMail({ from:`"NoExcuse.ai" <${process.env.MAIL_USER}>`, to:user.email, subject:`@${follower.username} followed you on NoExcuse.ai`, html:wrap(body,'New Follower') });
// };

// // ── 8. MESSAGE NOTIFICATION ───────────────────────────────────────────────────
// const sendMessageEmail = async (user, sender, preview) => {
//   const t = createTransport(); if (!t || !user.emailNotifications) return;
//   const body = `<div class="body">
//     <p class="h1">New Message</p>
//     <p class="txt"><strong style="color:${BRAND}">@${sender.username}</strong> sent you a message.</p>
//     <div class="card"><div class="card-title">Message Preview</div><p style="font-size:14px;color:#c0c0d0;font-style:italic">"${String(preview).substring(0,120)}${preview.length>120?'...':''}"</p></div>
//     <div class="cta"><a href="${APP}/messages" class="btn">Reply Now →</a></div>
//   </div>`;
//   await t.sendMail({ from:`"NoExcuse.ai" <${process.env.MAIL_USER}>`, to:user.email, subject:`New message from @${sender.username} — NoExcuse.ai`, html:wrap(body,'New Message') });
// };

// module.exports = {
//   sendWelcomeEmail, sendLoginAlertEmail, sendSignupConfirmEmail,
//   sendGoalAddedEmail, sendGoalCompletedEmail, sendDailySummaryEmail,
//   sendFollowEmail, sendMessageEmail
// };


'use strict';

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔥 DEBUG: check API key
console.log("RESEND KEY:", process.env.RESEND_API_KEY ? "Loaded ✅" : "Missing ❌");

const APP   = process.env.CLIENT_URL;
const BRAND = '#00f5ff';
const YEAR  = new Date().getFullYear();

/* ================= CORE SEND ================= */

const sendMail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: 'NoExcuse AI <onboarding@resend.dev>', // ✅ safe test sender
      to: 'noexcuse.rise@gmail.com',               // 🔥 FORCE YOUR EMAIL (DEBUG)
      subject,
      html,
    });

    console.log('📧 EMAIL SENT:', response);
    return response;

  } catch (err) {
    console.error('❌ RESEND FULL ERROR:', err);
    return null;
  }
};

/* ================= UI ================= */

const CSS = `
body{background:#030308;font-family:Arial;color:#fff}
.wrap{max-width:580px;margin:auto;padding:20px}
.btn{background:${BRAND};color:#000;padding:12px 20px;text-decoration:none;border-radius:8px}
`;

const wrap = (body) => `
<html>
<head><style>${CSS}</style></head>
<body>
<div class="wrap">
${body}
<p style="margin-top:20px;font-size:12px;color:#555">© ${YEAR} NoExcuse.ai</p>
</div>
</body>
</html>`;

/* ================= EMAILS ================= */

// 1. WELCOME
const sendWelcomeEmail = async (user) => {
  return sendMail({
    subject: 'Welcome to NoExcuse.ai 🚀',
    html: wrap(`
      <h2>Welcome ${user.name}</h2>
      <p>Your username: <b>@${user.username}</b></p>
      <a href="${APP}/dashboard" class="btn">Start</a>
    `)
  });
};

// 2. LOGIN ALERT
const sendLoginAlertEmail = async (user, meta={}) => {
  if (!user.notifyOnLogin) return;

  return sendMail({
    subject: 'New Login Detected',
    html: wrap(`
      <h2>Login Alert</h2>
      <p>IP: ${meta.ip || 'Unknown'}</p>
    `)
  });
};

// 3. SIGNUP CONFIRM
const sendSignupConfirmEmail = async (user) => {
  return sendMail({
    subject: 'Account Created',
    html: wrap(`<h2>Account Ready</h2>`)
  });
};

// 4. GOAL ADDED
const sendGoalAddedEmail = async (user, habit) => {
  if (!user.emailNotifications) return;

  return sendMail({
    subject: `New Habit: ${habit.name}`,
    html: wrap(`<h2>${habit.name}</h2>`)
  });
};

// 5. GOAL COMPLETED
const sendGoalCompletedEmail = async (user, habit) => {
  if (!user.notifyOnGoal) return;

  return sendMail({
    subject: `Completed: ${habit.name}`,
    html: wrap(`<h2>+${habit.xpReward} XP</h2>`)
  });
};

// 6. DAILY SUMMARY
const sendDailySummaryEmail = async (user) => {
  if (!user.emailNotifications) return;

  return sendMail({
    subject: 'Daily Report',
    html: wrap(`<h2>Daily Summary</h2>`)
  });
};

// 7. FOLLOW
const sendFollowEmail = async (user, follower) => {
  if (!user.emailNotifications) return;

  return sendMail({
    subject: 'New Follower',
    html: wrap(`<h2>@${follower.username} followed you</h2>`)
  });
};

// 8. MESSAGE
const sendMessageEmail = async (user, sender, preview) => {
  if (!user.emailNotifications) return;

  return sendMail({
    subject: 'New Message',
    html: wrap(`<p>${preview}</p>`)
  });
};

module.exports = {
  sendWelcomeEmail,
  sendLoginAlertEmail,
  sendSignupConfirmEmail,
  sendGoalAddedEmail,
  sendGoalCompletedEmail,
  sendDailySummaryEmail,
  sendFollowEmail,
  sendMessageEmail
};