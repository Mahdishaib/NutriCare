const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  senderId: Number,
  receiverId: Number,
  text: String,
  timestamp: String
});

module.exports = mongoose.model('Message', MessageSchema);