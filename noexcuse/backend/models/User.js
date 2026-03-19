const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9_.]{3,30}$/ },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  avatar:   { type: String, default: '' },
  coverImg: { type: String, default: '' },
  bio:      { type: String, default: '', maxlength: 200 },
  location: { type: String, default: '' },
  website:  { type: String, default: '' },
  googleId: { type: String },

  // Plan: free | pro | elite
  plan:        { type: String, enum: ['free','pro','elite'], default: 'free' },
  planExpiry:  { type: Date },

  // Gamification
  xp:                   { type: Number, default: 0 },
  level:                { type: Number, default: 1 },
  disciplineScore:      { type: Number, default: 0 },
  totalHabitsCompleted: { type: Number, default: 0 },
  longestStreak:        { type: Number, default: 0 },
  currentStreak:        { type: Number, default: 0 },
  lastActiveDate:       { type: Date },

  badges: [{
    name: String, description: String, icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],

  // Social
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Settings
  emailNotifications: { type: Boolean, default: true },
  notifyOnLogin:      { type: Boolean, default: true },
  notifyOnGoal:       { type: Boolean, default: true },
  theme:              { type: String, default: 'dark' },
  isPrivate:          { type: Boolean, default: false },
  isVerified:         { type: Boolean, default: false },

  // Activity log
  activityLog: [{
    type:      { type: String },
    message:   String,
    createdAt: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.calculateLevel = function () {
  let level = 1, xpNeeded = 100, remaining = this.xp;
  while (remaining >= xpNeeded) { remaining -= xpNeeded; level++; xpNeeded = level * 100; }
  this.level = level;
  return level;
};

userSchema.methods.xpForNextLevel = function () { return this.level * 100; };

userSchema.methods.xpInCurrentLevel = function () {
  let rem = this.xp, level = 1, need = 100;
  while (rem >= need) { rem -= need; level++; need = level * 100; }
  return rem;
};

module.exports = mongoose.model('User', userSchema);
