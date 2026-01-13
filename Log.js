const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  patientId: Number,
  date: String,
  mealType: String, // 'breakfast', 'lunch', 'dinner', 'snack'
  foodName: String,
  grams: Number,
  cals: Number,
  isCheatMeal: Boolean
});

module.exports = mongoose.model('Log', LogSchema);