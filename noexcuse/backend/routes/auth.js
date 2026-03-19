const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { sendWelcomeEmail, sendLoginAlertEmail, sendSignupConfirmEmail } = require('../emails/mailer');

const sign = (id) => jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const safe = (u) => ({
  _id: u._id, name: u.name, email: u.email, username: u.username,
  xp: u.xp, level: u.level, disciplineScore: u.disciplineScore,
  currentStreak: u.currentStreak, longestStreak: u.longestStreak,
  totalHabitsCompleted: u.totalHabitsCompleted, badges: u.badges,
  avatar: u.avatar, coverImg: u.coverImg, bio: u.bio, location: u.location,
  website: u.website, theme: u.theme, plan: u.plan,
  emailNotifications: u.emailNotifications, notifyOnLogin: u.notifyOnLogin,
  notifyOnGoal: u.notifyOnGoal, isVerified: u.isVerified, isPrivate: u.isPrivate,
  following: u.following, followers: u.followers, createdAt: u.createdAt
});

// Generate unique username from name
const genUsername = async (name) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15) || 'user';
  let username = base;
  let count = 0;
  while (await User.findOne({ username })) {
    count++;
    username = `${base}${count}`;
  }
  return username;
};

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, username: reqUsername } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password min 6 chars' });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'Email already registered' });

    let username = reqUsername ? reqUsername.toLowerCase().replace(/[^a-z0-9_.]/g, '') : await genUsername(name);
    if (username.length < 3) username = await genUsername(name);
    if (await User.findOne({ username })) username = await genUsername(name);

    const user = new User({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 12), username });
    await user.save();

    sendWelcomeEmail(user).catch(console.error);
    sendSignupConfirmEmail(user).catch(console.error);

    res.status(201).json({ token: sign(user._id), user: safe(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });
    if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ message: 'Invalid credentials' });

    const ip = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
    sendLoginAlertEmail(user, { ip, userAgent: req.headers['user-agent'] }).catch(console.error);

    res.json({ token: sign(user._id), user: safe(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ME
router.get('/me', require('../middleware/auth'), (req, res) => res.json(safe(req.user)));

// CHECK USERNAME
router.get('/check-username/:username', async (req, res) => {
  const exists = await User.findOne({ username: req.params.username.toLowerCase() });
  res.json({ available: !exists });
});

module.exports = router;
