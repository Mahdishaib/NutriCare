const mongoose = require('mongoose');
module.exports = mongoose.model('Message', new mongoose.Schema({
  id: Number, senderId: Number, receiverId: Number, text: String, timestamp: String
}));