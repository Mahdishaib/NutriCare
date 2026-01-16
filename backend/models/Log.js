const mongoose = require('mongoose');
module.exports = mongoose.model('Log', new mongoose.Schema({
  id: Number, patientId: Number, date: String, mealType: String, foodName: String, grams: Number, cals: Number, isCheatMeal: Boolean, selectedOption: String
}));