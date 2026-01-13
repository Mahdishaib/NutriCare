const mongoose = require('mongoose');
const User = require('./models/User');
const Ingredient = require('./models/Ingredient');
const Recipe = require('./models/Recipe');
const Plan = require('./models/Plan');
require('dotenv').config();

// --- CONNECT TO DB ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/keto_app';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => { console.error(err); process.exit(1); });

// --- PASTE YOUR FULL DATA HERE ---
const INITIAL_DATA = {
  users: [
    { 
      id: 1, 
      email: "admin@keto.com", 
      password: "123", 
      role: "admin", 
      name: "Super Admin",
      isBlocked: false,
      permissions: { canBlock: true, canVerify: true, canApprovePay: true } 
    },
    { 
      id: 2, 
      email: "doc@keto.com", 
      password: "123", 
      role: "dietitian", 
      name: "Dr. Sarah", 
      isVerified: true, 
      status: 'verified', 
      certificate: "https://via.placeholder.com/400x300?text=Dr+Sarah+Certificate",
      wallet: 150.50, 
      payoutDetails: "PayPal: sarah@gmail.com",
      isBlocked: false,
      specialty: "Epilepsy" 
    },
    { 
      id: 3, 
      email: "ali@keto.com", 
      password: "123", 
      role: "patient", 
      name: "Ali Ahmed", 
      dob: "1994-05-15", 
      gender: "male", 
      height: 180, 
      weight: 90, 
      medical_conditions: [
        { id: 1, name: "Peanut Allergy" },
        { id: 2, name: "Type 2 Diabetes" }
      ],
      assignedDietitianId: 2, 
      lastPaymentDate: new Date().toISOString().split('T')[0], 
      isBlocked: false
    }
  ],

  // --- PASTE THE FULL INGREDIENTS LIST HERE (The 578 items) ---
  ingredients: [
    { id: 101, name: "Nutrilak Optimum", cals: 503, protein: 9.9, fat: 26.0, carbs: 57.4 },
    { id: 102, name: "Gift Cake", cals: 420, protein: 9.7, fat: 41.2, carbs: 2.58 },
    { id: 103, name: "French Fries", cals: 342, protein: 4.5, fat: 13.9, carbs: 49.8 },
    { id: 104, name: "Cucumber Rolls", cals: 203, protein: 6.41, fat: 18.8, carbs: 2.0 },
    { id: 105, name: "Keto Bread (Keto Luna)", cals: 259, protein: 30.3, fat: 11.2, carbs: 9.26 },
    { id: 106, name: "Keto Pancake", cals: 200, protein: 12.0, fat: 15.0, carbs: 3.0 },
    { id: 107, name: "Easter Cake", cals: 512, protein: 11.9, fat: 49.0, carbs: 3.45 },
    { id: 108, name: "Custard Bread", cals: 224, protein: 6.5, fat: 1.0, carbs: 36.0 },
    { id: 109, name: "Eclair", cals: 350, protein: 14.0, fat: 25.0, carbs: 18.0 },
    { id: 110, name: "Pancakes (Mayo Mix)", cals: 558, protein: 7.6, fat: 33.5, carbs: 6.63 },
    { id: 111, name: "Pumpkin Seed Oil", cals: 900, protein: 0, fat: 100, carbs: 0 },
    { id: 112, name: "Flaxseed Oil", cals: 900, protein: 0, fat: 100, carbs: 0 },
    { id: 113, name: "Corn Oil", cals: 900, protein: 0, fat: 100, carbs: 0 },
    { id: 114, name: "Rapeseed Oil", cals: 900, protein: 0, fat: 100, carbs: 0 },
    { id: 115, name: "Sunflower Oil", cals: 900, protein: 0, fat: 100, carbs: 0 },
    { id: 116, name: "Walnut Oil", cals: 900, protein: 0, fat: 100, carbs: 0 },
    { id: 117, name: "Grape Seed Oil", cals: 900, protein: 0, fat: 100, carbs: 0 },
    { id: 118, name: "Safflower Oil", cals: 900, protein: 0, fat: 100, carbs: 0 },
    { id: 119, name: "Coconut Oil", cals: 899, protein: 0, fat: 99.9, carbs: 0 },
    { id: 120, name: "MCT Oil 100%", cals: 899, protein: 0, fat: 100, carbs: 0 },
    { id: 121, name: "Ghee (Clarified Butter)", cals: 897, protein: 0.2, fat: 99.5, carbs: 0 },
    { id: 122, name: "Olive Oil", cals: 898, protein: 0, fat: 99.8, carbs: 0 },
    { id: 123, name: "Cocoa Butter", cals: 896, protein: 0, fat: 99.5, carbs: 0 },
    { id: 124, name: "Brazil Nuts", cals: 745, protein: 14, fat: 66, carbs: 12 },
    { id: 125, name: "Sunflower Seeds", cals: 713, protein: 21, fat: 53, carbs: 20 },
    { id: 126, name: "Whey Protein Isolate", cals: 381, protein: 90, fat: 1, carbs: 3 },
    { id: 127, name: "MCT Oil 77%", cals: 819, protein: 0, fat: 91, carbs: 0 },
    { id: 128, name: "Waffle Cake", cals: 500, protein: 5, fat: 30, carbs: 60 },
    { id: 129, name: "Boiled Chicken Breast", cals: 234, protein: 36, fat: 10, carbs: 0 },
    { id: 130, name: "Parmesan Cheese 40%", cals: 348, protein: 33, fat: 24, carbs: 0 },
    { id: 131, name: "Salmon Caviar", cals: 263, protein: 32, fat: 15, carbs: 0 },
    { id: 132, name: "Smoked Salmon", cals: 289, protein: 28.5, fat: 19.4, carbs: 0 },
    { id: 133, name: "KetoCal (Advance - Vanilla) 4:1", cals: 730, protein: 15.25, fat: 73.0, carbs: 3.0 },
    { id: 134, name: "Butter 82.5%", cals: 748, protein: 0.6, fat: 82.5, carbs: 0.8 },
    { id: 135, name: "Food Grade Glycerin", cals: 1, protein: 0.0, fat: 0.1, carbs: 0.0 },
    { id: 136, name: "Chocolate Apriori 99%", cals: 601, protein: 13.4, fat: 53.9, carbs: 15.6 },
    { id: 137, name: "Cocoa Powder (Stevia)", cals: 21, protein: 2.1, fat: 1.0, carbs: 1.0 },
    { id: 138, name: "Locust Bean Gum", cals: 60, protein: 4.5, fat: 1.4, carbs: 7.3 },
    { id: 139, name: "Erythritol", cals: 0, protein: 0.0, fat: 0.0, carbs: 0.0 },
    { id: 140, name: "Xanthan Gum", cals: 364, protein: 6.0, fat: 0.5, carbs: 84.0 },
    { id: 141, name: "Guar Gum", cals: 367, protein: 4.6, fat: 0.5, carbs: 86.0 },
    { id: 142, name: "Heavy Cream 34% (Sugar Free)", cals: 329, protein: 2.3, fat: 34.0, carbs: 3.5 },
    { id: 674, name: "Blueberries", cals: 36, protein: 1.0, fat: 0.5, carbs: 7.0 },
    { id: 675, name: "Chicken Egg", cals: 156, protein: 12.8, fat: 11.3, carbs: 0.7 },
    { id: 676, name: "Egg Yolk", cals: 353, protein: 16.1, fat: 31.9, carbs: 0.3 },
    { id: 677, name: "Egg White", cals: 47, protein: 11.1, fat: 0.0, carbs: 0.7 },
    { id: 678, name: "Quail Egg", cals: 166, protein: 11.9, fat: 13.1, carbs: 0.0 }
  ],

  // --- PASTE THE RECIPES HERE ---
  recipes: [
    { 
      id: 1, 
      name: "Keto Breakfast (Standard)", 
      cals: 891, 
      ingredients: [
        { name: "KetoCal (Advance - Vanilla) 4:1", grams: 98 },
        { name: "Nutrilak Optimum", grams: 35 }
      ]
    },
    { 
      id: 2, 
      name: "Keto Dinner (Complex)", 
      cals: 1510, 
      ingredients: [
        { name: "Butter 82.5%", grams: 70 },
        { name: "Food Grade Glycerin", grams: 31 },
        { name: "Chocolate Apriori 99%", grams: 25 },
        { name: "Cocoa Powder (Stevia)", grams: 25 },
        { name: "Locust Bean Gum", grams: 1 },
        { name: "Erythritol", grams: 24 },
        { name: "Xanthan Gum", grams: 0.3 },
        { name: "Guar Gum", grams: 2 },
        { name: "Heavy Cream 34% (Sugar Free)", grams: 250 }
      ]
    },
    { id: 10, name: "Simple: Pumpkin Seed Oil", cals: 900, ingredients: [{ name: "Pumpkin Seed Oil", grams: 100 }] },
    { id: 11, name: "Simple: MCT Oil Shot", cals: 899, ingredients: [{ name: "MCT Oil 100%", grams: 100 }] },
    { id: 12, name: "Simple: Olive Oil", cals: 898, ingredients: [{ name: "Olive Oil", grams: 100 }] },
    { id: 13, name: "Simple: Brazil Nuts", cals: 745, ingredients: [{ name: "Brazil Nuts", grams: 100 }] },
    { id: 14, name: "Simple: Sunflower Seeds", cals: 713, ingredients: [{ name: "Sunflower Seeds", grams: 100 }] },
    { id: 15, name: "Simple: Whey Protein Isolate", cals: 381, ingredients: [{ name: "Whey Protein Isolate", grams: 100 }] },
    { id: 16, name: "Simple: Boiled Chicken", cals: 234, ingredients: [{ name: "Boiled Chicken Breast", grams: 100 }] },
    { id: 17, name: "Simple: Parmesan Cheese", cals: 348, ingredients: [{ name: "Parmesan Cheese 40%", grams: 100 }] },
    { id: 18, name: "Simple: Smoked Salmon", cals: 289, ingredients: [{ name: "Smoked Salmon", grams: 100 }] }
  ],

  plans: []
};

// --- IMPORT FUNCTION ---
const importData = async () => {
  try {
    // Clear old data to avoid duplicates
    await User.deleteMany({});
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});
    await Plan.deleteMany({});

    console.log('🗑️  Old data cleared...');

    // Insert new data
    await User.insertMany(INITIAL_DATA.users);
    await Ingredient.insertMany(INITIAL_DATA.ingredients);
    await Recipe.insertMany(INITIAL_DATA.recipes);
    // await Plan.insertMany(INITIAL_DATA.plans); // Optional

    console.log('🌱 Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error with data import:', err);
    process.exit(1);
  }
};

importData();