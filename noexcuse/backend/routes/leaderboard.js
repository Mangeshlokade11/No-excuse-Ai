const router = require('express').Router();
const auth   = require('../middleware/auth');
const User   = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('name username avatar xp level currentStreak longestStreak disciplineScore badges totalHabitsCompleted isVerified')
      .sort({ xp: -1 }).limit(50);
    res.json(users.map((u, i) => ({
      rank: i + 1, _id: u._id, name: u.name, username: u.username,
      avatar: u.avatar, xp: u.xp, level: u.level,
      currentStreak: u.currentStreak, longestStreak: u.longestStreak,
      disciplineScore: u.disciplineScore, totalHabitsCompleted: u.totalHabitsCompleted,
      badgeCount: u.badges?.length || 0, isVerified: u.isVerified,
      isCurrentUser: u._id.toString() === req.user._id.toString()
    })));
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/streaks', auth, async (req, res) => {
  try {
    const users = await User.find({ currentStreak: { $gt: 0 } })
      .select('name username avatar xp level currentStreak longestStreak disciplineScore isVerified')
      .sort({ currentStreak: -1 }).limit(20);
    res.json(users.map((u, i) => ({ ...u._doc, rank: i + 1, isCurrentUser: u._id.toString() === req.user._id.toString() })));
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
