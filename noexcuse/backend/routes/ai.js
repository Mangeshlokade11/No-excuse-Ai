const router   = require('express').Router();
const auth     = require('../middleware/auth');
const DailyLog = require('../models/DailyLog');
const Habit    = require('../models/Habit');
const { generateDailySummary } = require('../utils/aiService');

router.post('/summary', auth, async (req, res) => {
  try {
    const date      = req.body.date || new Date().toISOString().split('T')[0];
    const log       = await DailyLog.findOne({ user: req.user._id, date }).populate('completedHabits.habit');
    const allHabits = await Habit.find({ user: req.user._id, isActive: true });
    const summary   = await generateDailySummary(req.user, log, allHabits);
    if (log) { log.aiSummary = { ...summary, generatedAt: new Date() }; await log.save(); }
    res.json(summary);
  } catch (err) { res.status(500).json({ message: 'AI unavailable', error: err.message }); }
});

module.exports = router;
