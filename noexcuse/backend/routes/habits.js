const router = require('express').Router();
const auth   = require('../middleware/auth');
const Habit  = require('../models/Habit');
const { sendGoalAddedEmail } = require('../emails/mailer');

router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isActive: true }).sort('order');
    res.json(habits);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const count = await Habit.countDocuments({ user: req.user._id, isActive: true });
    if (count >= 10) return res.status(400).json({ message: 'Max 10 habits' });
    const { name, description, icon, color, category, frequency, customDays, xpReward } = req.body;
    const habit = new Habit({
      user: req.user._id, name, description, icon: icon||'⭐',
      color: color||'#00f5ff', category: category||'other',
      frequency: frequency||'daily', customDays: customDays||[],
      xpReward: xpReward||10, order: count
    });
    await habit.save();
    sendGoalAddedEmail(req.user, habit).catch(console.error);
    res.status(201).json(habit);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Not found' });
    const fields = ['name','description','icon','color','category','frequency','customDays','xpReward','order'];
    fields.forEach(f => { if (req.body[f] !== undefined) habit[f] = req.body[f]; });
    await habit.save();
    res.json(habit);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Not found' });
    habit.isActive = false;
    await habit.save();
    res.json({ message: 'Removed' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
