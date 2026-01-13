const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// --- IMPORT MODELS ---
const User = require('./models/User');
const Ingredient = require('./models/Ingredient');
const Recipe = require('./models/Recipe');
const Plan = require('./models/Plan');
const Log = require('./models/Log');         // NEW
const Payment = require('./models/Payment'); // NEW
const Message = require('./models/Message'); // NEW
const Review = require('./models/Review');   // NEW

const app = express();

// 1. SECURITY: Allow all origins for now (Easy Hosting)
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());

// 2. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.log('❌ DB Error:', err));

// ==========================================
//                 ROUTES
// ==========================================

// --- GET REQUESTS (Fetch Data) ---
app.get('/api/users', async (req, res) => res.json(await User.find()));
app.get('/api/ingredients', async (req, res) => res.json(await Ingredient.find()));
app.get('/api/recipes', async (req, res) => res.json(await Recipe.find()));
app.get('/api/plans', async (req, res) => res.json(await Plan.find()));
app.get('/api/logs', async (req, res) => res.json(await Log.find()));
app.get('/api/payments', async (req, res) => res.json(await Payment.find()));
app.get('/api/messages', async (req, res) => res.json(await Message.find()));
app.get('/api/reviews', async (req, res) => res.json(await Review.find()));

// --- POST REQUESTS (Create Data) ---

// 1. Register User
app.post('/api/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

// 2. Save Diet Plan
app.post('/api/plans', async (req, res) => {
  const { patientId, date, meals, dietitianId } = req.body;
  
  // Check if plan exists for this day, if so, update it
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

// 3. Send Chat Message
app.post('/api/messages', async (req, res) => {
  const newMsg = new Message(req.body);
  await newMsg.save();
  res.json(newMsg);
});

// 4. Submit Doctor Review
app.post('/api/reviews', async (req, res) => {
  const newReview = new Review(req.body);
  await newReview.save();
  res.json(newReview);
});

// 5. Create Payment Request (Withdrawal)
app.post('/api/payments', async (req, res) => {
  const newPay = new Payment(req.body);
  await newPay.save();
  res.json(newPay);
});

// 6. Create Custom Recipe
app.post('/api/recipes', async (req, res) => {
  const newRecipe = new Recipe(req.body);
  await newRecipe.save();
  res.json(newRecipe);
});

// 7. Add New Ingredient (Admin)
app.post('/api/ingredients', async (req, res) => {
  const newIng = new Ingredient(req.body);
  await newIng.save();
  res.json(newIng);
});

// --- PUT REQUESTS (Update Data) ---

// 1. Update User (Block, Verify, Change Weight)
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const user = await User.findOne({ id: parseInt(id) });
  if (user) {
    Object.assign(user, updates); // Merges updates into user
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// 2. Approve/Deny Payment
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

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));