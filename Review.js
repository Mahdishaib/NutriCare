const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  dietitianId: Number,
  patientId: Number,
  rating: Number,
  comment: String,
  date: String
});

module.exports = mongoose.model('Review', ReviewSchema);