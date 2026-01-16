const mongoose = require('mongoose');
module.exports = mongoose.model('Ingredient', new mongoose.Schema({
  id: Number, name: String, cals: Number, protein: Number, carbs: Number, fat: Number
}));