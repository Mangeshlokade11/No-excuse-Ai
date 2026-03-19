const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, required: true },
  description: { type: String, default: '' },
  goals: [{
    title:     { type: String, required: true },
    deadline:  { type: Date },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    priority:  { type: String, enum: ['low','medium','high'], default: 'medium' },
    notes:     { type: String, default: '' }
  }],
  category:  { type: String, default: 'general' },
  color:     { type: String, default: '#00f5ff' },
  isActive:  { type: Boolean, default: true },
  progress:  { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate:   { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);
