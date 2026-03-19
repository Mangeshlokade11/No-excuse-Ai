const router     = require('express').Router();
const auth       = require('../middleware/auth');
const User       = require('../models/User');
const SocialPost = require('../models/SocialPost');
const { sendFollowEmail } = require('../emails/mailer');

router.get('/feed', auth, async (req, res) => {
  try {
    const user  = await User.findById(req.user._id);
    const ids   = [...user.following, req.user._id];
    const posts = await SocialPost.find({ user: { $in: ids }, isPublic: true })
      .populate('user', 'name username avatar level currentStreak isVerified')
      .populate('comments.user', 'name username avatar')
      .sort({ createdAt: -1 }).limit(40);
    res.json(posts);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/explore', auth, async (req, res) => {
  try {
    const posts = await SocialPost.find({ isPublic: true })
      .populate('user', 'name username avatar level isVerified')
      .sort({ likes: -1, createdAt: -1 }).limit(30);
    res.json(posts);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/reels', auth, async (req, res) => {
  try {
    const posts = await SocialPost.find({ isPublic: true, type: { $in: ['reel','short'] } })
      .populate('user', 'name username avatar isVerified')
      .sort({ createdAt: -1 }).limit(20);
    res.json(posts);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { content, type, mediaUrl, mediaType, tags } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });
    const post = new SocialPost({ user: req.user._id, content, type: type||'post', mediaUrl: mediaUrl||'', mediaType: mediaType||'none', tags: tags||[] });
    await post.save();
    await post.populate('user', 'name username avatar level currentStreak isVerified');
    res.status(201).json(post);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    const idx = post.likes.indexOf(req.user._id);
    if (idx > -1) post.likes.splice(idx, 1);
    else post.likes.push(req.user._id);
    await post.save();
    res.json({ likes: post.likes.length, liked: idx === -1 });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text required' });
    const post = await SocialPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    post.comments.push({ user: req.user._id, text });
    await post.save();
    await post.populate('comments.user', 'name username avatar');
    res.json(post.comments[post.comments.length - 1]);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/follow/:id', auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot follow yourself' });
    const target  = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'Not found' });
    const current = await User.findById(req.user._id);
    const isFollowing = current.following.some(id => id.toString() === req.params.id);
    if (isFollowing) {
      current.following = current.following.filter(id => id.toString() !== req.params.id);
      target.followers  = target.followers.filter(id => id.toString() !== req.user._id.toString());
    } else {
      current.following.push(target._id);
      target.followers.push(req.user._id);
      sendFollowEmail(target, req.user).catch(console.error);
    }
    await current.save(); await target.save();
    res.json({ following: !isFollowing, followerCount: target.followers.length });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/discover', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('name username avatar level currentStreak xp disciplineScore isVerified').sort({ xp: -1 }).limit(20);
    res.json(users);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Get user posts
router.get('/user/:id', auth, async (req, res) => {
  try {
    const posts = await SocialPost.find({ user: req.params.id, isPublic: true })
      .populate('user', 'name username avatar isVerified').sort({ createdAt: -1 }).limit(30);
    res.json(posts);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
