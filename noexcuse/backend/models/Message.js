const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: { type: String, required: true }, // sorted userId1_userId2
  sender:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:     { type: String, required: true },
  mediaUrl: { type: String, default: '' },
  read:     { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

messageSchema.index({ conversation: 1, createdAt: -1 });
module.exports = mongoose.model('Message', messageSchema);
