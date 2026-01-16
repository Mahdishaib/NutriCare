const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  password: String,
  role: String,
  weight: Number,
  height: Number,
  dob: String,
  gender: String,
  medical_conditions: Array,
  assignedDietitianId: Number,
  isVerified: Boolean,
  wallet: Number,
  certificate: String,
  isBlocked: Boolean,
  paymentMethod: String,
  paymentInfo: String,
  payoutDetails: String
});
module.exports = mongoose.model('User', userSchema);