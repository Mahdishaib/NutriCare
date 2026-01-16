const mongoose = require('mongoose');
module.exports = mongoose.model('Review', new mongoose.Schema({
  id: Number, patientId: Number, dietitianId: Number, rating: Number, comment: String, date: String
}));