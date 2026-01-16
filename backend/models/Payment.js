const mongoose = require('mongoose');
module.exports = mongoose.model('Payment', new mongoose.Schema({
  id: Number, userId: Number, amount: Number, status: String, date: String
}));