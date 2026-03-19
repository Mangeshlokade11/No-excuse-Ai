const router = require('express').Router();
const auth   = require('../middleware/auth');
const Plan   = require('../models/Plan');

router.get('/', auth, async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id, isActive: true }).sort({ createdAt: -1 });
    res.json(plans);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, goals, category, color, startDate, endDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const plan = new Plan({ user: req.user._id, title, description: description||'', goals: goals||[], category: category||'general', color: color||'#00f5ff', startDate: startDate || Date.now(), endDate });
    await plan.save();
    res.status(201).json(plan);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Not found' });
    const fields = ['title','description','goals','category','color','isActive','endDate'];
    fields.forEach(f => { if (req.body[f] !== undefined) plan[f] = req.body[f]; });
    const done = plan.goals.filter(g => g.completed).length;
    plan.progress = plan.goals.length > 0 ? Math.round((done / plan.goals.length) * 100) : 0;
    await plan.save();
    res.json(plan);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.patch('/:id/goal/:goalId', auth, async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Not found' });
    const goal = plan.goals.id(req.params.goalId);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    goal.completed   = !goal.completed;
    goal.completedAt = goal.completed ? new Date() : undefined;
    plan.progress    = plan.goals.length > 0 ? Math.round((plan.goals.filter(g=>g.completed).length / plan.goals.length)*100) : 0;
    await plan.save();
    res.json(plan);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Not found' });
    plan.isActive = false; await plan.save();
    res.json({ message: 'Removed' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
