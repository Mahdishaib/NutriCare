const mongoose = require('mongoose');
module.exports = mongoose.model('Recipe', new mongoose.Schema({
  id: Number, name: String, cals: Number, ingredients: Array
}));