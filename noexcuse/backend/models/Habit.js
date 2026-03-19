const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  icon:        { type: String, default: '⭐' },
  color:       { type: String, default: '#00f5ff' },
  category:    { type: String, enum: ['health','fitness','mindfulness','productivity','learning','social','finance','other'], default: 'other' },
  frequency:   { type: String, enum: ['daily','weekdays','weekends','custom'], default: 'daily' },
  customDays:  [{ type: Number, min: 0, max: 6 }],
  xpReward:    { type: Number, default: 10 },
  order:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
  streak:      { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalCompleted: { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Habit', habitSchema);
