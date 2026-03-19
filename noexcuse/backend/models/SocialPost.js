const mongoose = require('mongoose');

const socialPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['post','reel','short','streak_milestone','level_up','badge_earned','custom'], default: 'post' },
  content:  { type: String, required: true },
  mediaUrl: { type: String, default: '' },
  mediaType: { type: String, enum: ['image','video','none'], default: 'none' },
  thumbnail: { type: String, default: '' },
  tags:     [{ type: String }],
  metadata: {
    streakCount: Number, habitName: String,
    level: Number, badgeName: String, xp: Number
  },
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  saves:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text:      { type: String, required: true },
    likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
  }],
  views:     { type: Number, default: 0 },
  isPublic:  { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocialPost', socialPostSchema);
