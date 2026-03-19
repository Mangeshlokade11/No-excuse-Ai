const router   = require('express').Router();
const auth     = require('../middleware/auth');
const User     = require('../models/User');
const DailyLog = require('../models/DailyLog');

// Search users by username or name
router.get('/search', auth, async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) return res.json([]);
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name:     { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user._id }
    }).select('name username avatar level currentStreak xp disciplineScore isVerified').limit(20);
    res.json(users);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Get by username
router.get('/by-username/:username', auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('-password -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Get by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Update own profile
router.put('/me/update', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const fields = ['name','bio','avatar','coverImg','location','website','emailNotifications','notifyOnLogin','notifyOnGoal','theme','isPrivate'];
    fields.forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });

    // Username change
    if (req.body.username && req.body.username !== user.username) {
      const taken = await User.findOne({ username: req.body.username.toLowerCase() });
      if (taken) return res.status(400).json({ message: 'Username taken' });
      user.username = req.body.username.toLowerCase();
    }
    await user.save();
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Stats
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const from = new Date(); from.setDate(from.getDate() - days);
    const logs = await DailyLog.find({ user: req.params.id, date: { $gte: from.toISOString().split('T')[0] } }).sort('date');
    res.json(logs.map(l => ({ date: l.date, score: l.score, completionRate: Math.round(l.completionRate), xpEarned: l.xpEarned })));
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
