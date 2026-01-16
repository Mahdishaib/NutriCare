const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import All Models
const User = require('./models/User');
const Ingredient = require('./models/Ingredient');
const Recipe = require('./models/Recipe');
const Plan = require('./models/Plan');
const Log = require('./models/Log');        // <--- New
const Payment = require('./models/Payment'); // <--- New
const Message = require('./models/Message'); // <--- New
const Review = require('./models/Review');   // <--- New

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- CONNECT TO DATABASE ---
mongoose.connect('mongodb://127.0.0.1:27017/keto_app')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// --- API ROUTES ---

// 1. GET Routes (This fixes the App.js crash)
app.get('/api/users', async (req, res) => res.json(await User.find()));
app.get('/api/ingredients', async (req, res) => res.json(await Ingredient.find()));
app.get('/api/recipes', async (req, res) => res.json(await Recipe.find()));
app.get('/api/plans', async (req, res) => res.json(await Plan.find()));
app.get('/api/logs', async (req, res) => res.json(await Log.find()));        // <--- Added
app.get('/api/payments', async (req, res) => res.json(await Payment.find())); // <--- Added
app.get('/api/messages', async (req, res) => res.json(await Message.find())); // <--- Added
app.get('/api/reviews', async (req, res) => res.json(await Review.find()));   // <--- Added

// 2. POST Routes (For saving data)
app.post('/api/plans', async (req, res) => {
  const { patientId, date, meals, dietitianId } = req.body;
  const existing = await Plan.findOne({ patientId, date });

  if (existing) {
    existing.meals = meals;
    await existing.save();
    res.json(existing);
  } else {
    const newPlan = new Plan({ id: Date.now(), patientId, dietitianId, date, meals });
    await newPlan.save();
    res.json(newPlan);
  }

});

app.post('/api/ingredients', async (req, res) => {
  const newIng = new Ingredient(req.body);
  await newIng.save();
  res.json(newIng);
});
// POST: Send a Message
app.post('/api/messages', async (req, res) => {
  const newMsg = new Message(req.body);
  await newMsg.save();
  res.json(newMsg);
});

// POST: Create a Payment Request (Withdrawal)
app.post('/api/payments', async (req, res) => {
  const newPayment = new Payment(req.body);
  await newPayment.save();
  res.json(newPayment);
});

//  Approve/Deny Payment (For Admin)
app.put('/api/payments/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const payment = await Payment.findOne({ id: parseInt(id) });
  
  if (payment) {
    payment.status = status;
    await payment.save();
    res.json(payment);
  } else {
    res.status(404).json({ error: "Payment not found" });
  }
});

app.post('/api/recipes', async (req, res) => {
  const newRec = new Recipe(req.body);
  await newRec.save();
  res.json(newRec);
});
// ---  ROUTES FOR WEIGHT & RATINGS ---

// 1. Update User (Weight)
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Find user and update
  const user = await User.findOne({ id: parseInt(id) });
  if (user) {
    Object.assign(user, updates); // Merge updates into user
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// 2. Add Review
app.post('/api/reviews', async (req, res) => {
  const newReview = new Review(req.body);
  await newReview.save();
  res.json(newReview);
});
// START SERVER
app.listen(5000, () => console.log('🚀 Server running on port 5000'));