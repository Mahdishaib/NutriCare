const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  cals: Number,
  protein: Number,
  fat: Number,
  carbs: Number
});

module.exports = mongoose.model('Ingredient', IngredientSchema);