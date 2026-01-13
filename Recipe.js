const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  cals: Number,
  ingredients: [{
    name: String,
    grams: Number
  }]
});

module.exports = mongoose.model('Recipe', RecipeSchema);