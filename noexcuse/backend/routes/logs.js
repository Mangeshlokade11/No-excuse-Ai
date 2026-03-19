const router    = require('express').Router();
const auth      = require('../middleware/auth');
const DailyLog  = require('../models/DailyLog');
const Habit     = require('../models/Habit');
const User      = require('../models/User');
const SocialPost = require('../models/SocialPost');
const { checkAndAwardBadges } = require('../utils/badges');
const { sendGoalCompletedEmail } = require('../emails/mailer');

const today = () => new Date().toISOString().split('T')[0];

router.get('/', auth, async (req, res) => {
  try {
    const date  = req.query.date || today();
    let   log   = await DailyLog.findOne({ user: req.user._id, date }).populate('completedHabits.habit');
    const total = await Habit.countDocuments({ user: req.user._id, isActive: true });
    if (!log) log = { date, completedHabits: [], totalHabits: total, completionRate: 0, xpEarned: 0, score: 0 };
    res.json(log);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/range', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    const logs = await DailyLog.find({ user: req.user._id, date: { $gte: start, $lte: end } });
    res.json(logs);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Analytics: last N days
router.get('/analytics', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const from = new Date(); from.setDate(from.getDate() - days);
    const logs = await DailyLog.find({
      user: req.user._id,
      date: { $gte: from.toISOString().split('T')[0] }
    }).sort('date');

    const habits = await Habit.find({ user: req.user._id, isActive: true });
    const catMap = {};
    habits.forEach(h => { catMap[h._id.toString()] = h.category; });

    const categoryBreakdown = {};
    logs.forEach(l => {
      l.completedHabits.forEach(c => {
        const cat = catMap[(c.habit?._id || c.habit)?.toString()] || 'other';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
      });
    });

    const weekdays = [0,0,0,0,0,0,0];
    logs.forEach(l => {
      const day = new Date(l.date).getDay();
      weekdays[day] += l.completedHabits?.length || 0;
    });

    res.json({
      daily: logs.map(l => ({ date: l.date, score: l.score, completionRate: Math.round(l.completionRate), xpEarned: l.xpEarned, done: l.completedHabits?.length || 0 })),
      categoryBreakdown,
      weekdayActivity: weekdays,
      totalXP: logs.reduce((s,l) => s+(l.xpEarned||0), 0),
      avgScore: logs.length ? Math.round(logs.reduce((s,l)=>s+l.score,0)/logs.length*10)/10 : 0,
      perfectDays: logs.filter(l => l.score === 10).length,
      activeDays: logs.filter(l => l.completedHabits?.length > 0).length,
    });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.post('/toggle', auth, async (req, res) => {
  try {
    const { habitId } = req.body;
    const date = req.body.date || today();
    if (date !== today()) return res.status(400).json({ message: 'Today only' });

    const habit     = await Habit.findOne({ _id: habitId, user: req.user._id, isActive: true });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const totalHabits = await Habit.countDocuments({ user: req.user._id, isActive: true });
    let log = await DailyLog.findOne({ user: req.user._id, date });
    if (!log) log = new DailyLog({ user: req.user._id, date, totalHabits });

    const idx = log.completedHabits.findIndex(c => (c.habit?._id||c.habit)?.toString() === habitId);
    let xpDelta = 0, completing = false;

    if (idx > -1) {
      xpDelta = -log.completedHabits[idx].xpEarned;
      log.completedHabits.splice(idx, 1);
      habit.totalCompleted = Math.max(0, (habit.totalCompleted||1)-1);
    } else {
      completing = true; xpDelta = habit.xpReward;
      log.completedHabits.push({ habit: habitId, xpEarned: habit.xpReward });
      habit.totalCompleted = (habit.totalCompleted||0)+1;
    }

    await habit.save();
    log.xpEarned       = Math.max(0, (log.xpEarned||0)+xpDelta);
    log.completionRate = totalHabits > 0 ? (log.completedHabits.length/totalHabits)*100 : 0;
    log.score          = Math.round(log.completionRate/10);
    await log.save();

    const user = await User.findById(req.user._id);
    user.xp                   = Math.max(0, (user.xp||0)+xpDelta);
    user.totalHabitsCompleted = Math.max(0, (user.totalHabitsCompleted||0)+(completing?1:-1));
    const prevLevel = user.level;
    user.calculateLevel();
    const leveledUp = user.level > prevLevel;

    if (completing && log.completedHabits.length === 1) {
      const yest = new Date(); yest.setDate(yest.getDate()-1);
      const yStr = yest.toISOString().split('T')[0];
      const last = user.lastActiveDate ? user.lastActiveDate.toISOString().split('T')[0] : null;
      if (last === yStr) user.currentStreak = (user.currentStreak||0)+1;
      else if (last === date) { /* same day, no change */ }
      else user.currentStreak = 1;
      user.lastActiveDate = new Date();
      if (user.currentStreak > (user.longestStreak||0)) user.longestStreak = user.currentStreak;
    }

    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
    const weekLogs = await DailyLog.find({ user: user._id, date: { $gte: weekAgo.toISOString().split('T')[0] } });
    if (weekLogs.length > 0) user.disciplineScore = Math.round(weekLogs.reduce((s,l)=>s+(l.completionRate||0),0)/weekLogs.length);
    await user.save();

    const newBadges = await checkAndAwardBadges(user, habit);
    if (newBadges.length > 0) { log.newBadgesEarned = [...(log.newBadgesEarned||[]),...newBadges]; await log.save(); }

    if (completing && [7,14,30,60,100].includes(user.currentStreak)) {
      new SocialPost({ user: user._id, type:'streak_milestone', content:`${user.name} just hit a ${user.currentStreak}-day streak on NoExcuse.ai!`, metadata:{ streakCount: user.currentStreak } }).save().catch(console.error);
    }

    if (completing) {
      sendGoalCompletedEmail(user, habit, { newBadges, dailyProgress:{ done: log.completedHabits.length, total: totalHabits, pct: Math.round(log.completionRate) }, levelUp: leveledUp }).catch(console.error);
    }

    res.json({ log, user:{ xp:user.xp, level:user.level, currentStreak:user.currentStreak, longestStreak:user.longestStreak, disciplineScore:user.disciplineScore, totalHabitsCompleted:user.totalHabitsCompleted, badges:user.badges }, newBadges, leveledUp, completed: completing });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
