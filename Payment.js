const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  userId: Number,
  amount: Number,
  method: String,
  status: String, // 'Pending', 'Approved', 'Denied'
  date: String
});

module.exports = mongoose.model('Payment', PaymentSchema);