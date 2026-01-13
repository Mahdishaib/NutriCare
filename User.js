const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: Number, // Keeping your ID logic for now
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'dietitian', 'patient'], required: true },
  name: String,
  isBlocked: { type: Boolean, default: false },
  
  // Specific fields
  permissions: Object, // For Admin
  isVerified: Boolean, // For Dietitian
  wallet: Number,
  specialty: String,
  dob: String, // For Patient
  gender: String,
  height: Number,
  weight: Number,
  medical_conditions: Array,
  assignedDietitianId: Number
});

module.exports = mongoose.model('User', UserSchema);