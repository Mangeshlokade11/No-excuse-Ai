const router  = require('express').Router();
const auth    = require('../middleware/auth');
const Message = require('../models/Message');
const User    = require('../models/User');
const { sendMessageEmail } = require('../emails/mailer');

const convKey = (a, b) => [a, b].sort().join('_');

// Get conversations list
router.get('/conversations', auth, async (req, res) => {
  try {
    const uid = req.user._id.toString();
    const msgs = await Message.aggregate([
      { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversation', lastMsg: { $first: '$$ROOT' } } }
    ]);

    const convs = await Promise.all(msgs.map(async m => {
      const otherId = m.lastMsg.sender.toString() === uid ? m.lastMsg.receiver : m.lastMsg.sender;
      const other = await User.findById(otherId).select('name username avatar isVerified');
      const unread = await Message.countDocuments({ conversation: m._id, receiver: req.user._id, read: false });
      return { conversationId: m._id, user: other, lastMessage: m.lastMsg.text, lastAt: m.lastMsg.createdAt, unread };
    }));
    res.json(convs.filter(c => c.user));
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Get messages in a conversation
router.get('/:userId', auth, async (req, res) => {
  try {
    const key  = convKey(req.user._id.toString(), req.params.userId);
    const msgs = await Message.find({ conversation: key }).sort('createdAt').limit(100);
    await Message.updateMany({ conversation: key, receiver: req.user._id, read: false }, { read: true });
    res.json(msgs);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Send message
router.post('/:userId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Text required' });
    const receiver = await User.findById(req.params.userId);
    if (!receiver) return res.status(404).json({ message: 'User not found' });

    const key = convKey(req.user._id.toString(), req.params.userId);
    const msg = new Message({ conversation: key, sender: req.user._id, receiver: receiver._id, text });
    await msg.save();

    // Email notification (non-blocking, max once per hour per sender/receiver)
    sendMessageEmail(receiver, req.user, text).catch(console.error);
    res.status(201).json(msg);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
