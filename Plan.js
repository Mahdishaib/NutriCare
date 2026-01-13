const mongoose = require('mongoose');

// We set strict: false so it accepts Options A, B, C
const PlanSchema = new mongoose.Schema({
  id: { type: Number },
  patientId: Number,
  dietitianId: Number,
  date: String, 
  meals: {
    breakfast: Object, // <--- MUST be Object (not Array)
    lunch: Object,
    dinner: Object
  }
}, { strict: false });

module.exports = mongoose.model('Plan', PlanSchema);