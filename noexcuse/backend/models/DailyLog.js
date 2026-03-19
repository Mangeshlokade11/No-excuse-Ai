const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:  { type: String, required: true },
  completedHabits: [{
    habit:       { type: mongoose.Schema.Types.ObjectId, ref: 'Habit' },
    completedAt: { type: Date, default: Date.now },
    xpEarned:    { type: Number, default: 10 }
  }],
  totalHabits:    { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 },
  xpEarned:       { type: Number, default: 0 },
  score:          { type: Number, default: 0 },
  newBadgesEarned: [{ name: String, description: String, icon: String }],
  aiSummary: {
    performance: String, advice: String, motivation: String, generatedAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});

dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('DailyLog', dailyLogSchema);
