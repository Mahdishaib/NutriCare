const mongoose = require('mongoose');
module.exports = mongoose.model('Plan', new mongoose.Schema({
  id: Number, patientId: Number, dietitianId: Number, date: String,
  meals: { breakfast: Object, lunch: Object, dinner: Object }
}));