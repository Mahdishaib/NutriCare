export const INITIAL_DATA = {
  users: [
    { 
      id: 1, email: "admin@keto.com", password: "123", role: "admin", name: "Super Admin",
      permissions: { canBlock: true, canVerify: true, canApprovePay: true } 
    },
    { 
      id: 2, email: "doc@keto.com", password: "123", role: "dietitian", name: "Dr. Sarah", 
      isVerified: false, wallet: 150, specialty: "Epilepsy" 
    },
    { 
      id: 3, email: "ali@keto.com", password: "123", role: "patient", name: "Ali Ahmed", 
      dob: "1994-05-15", gender: "male", height: 180, weight: 90, 
      medical_conditions: [
        { id: 1, type: "Allergy", name: "Peanuts" },
        { id: 2, type: "Disease", name: "Type 2 Diabetes" }
      ],
      assignedDietitianId: 2 
    }
  ],
  recipes: [
    { id: 1, name: "Keto Omelet", cals: 350, fat: 25, protein: 20, carbs: 2 },
    { id: 2, name: "Avocado Boat", cals: 400, fat: 35, protein: 10, carbs: 5 },
    { id: 3, name: "Bullet Coffee", cals: 250, fat: 28, protein: 1, carbs: 0 },
    { id: 4, name: "Salmon Salad", cals: 500, fat: 30, protein: 40, carbs: 5 },
    { id: 5, name: "Chicken Caesar", cals: 450, fat: 25, protein: 45, carbs: 8 },
    { id: 6, name: "Beef Stir Fry", cals: 550, fat: 35, protein: 40, carbs: 10 },
    { id: 7, name: "Zucchini Pasta", cals: 300, fat: 20, protein: 5, carbs: 8 },
    { id: 8, name: "Steak & Asparagus", cals: 600, fat: 45, protein: 50, carbs: 3 },
    { id: 9, name: "Fathead Pizza", cals: 450, fat: 35, protein: 25, carbs: 6 },
  ],
  ingredients: [
    { id: 101, name: "Apple (Medium)", cals: 95 },
    { id: 102, name: "Banana", cals: 105 },
    { id: 103, name: "Almonds (30g)", cals: 170 },
    { id: 104, name: "Dark Chocolate", cals: 250 },
    { id: 105, name: "Greek Yogurt", cals: 100 },
  ],
  plans: [],
  logs: [],
  payments: [{ id: 101, patientId: 3, amount: 100, status: "Pending" }],
  reviews: [{ id: 1, dietitianId: 2, patientId: 3, rating: 5, comment: "Great advice!", date: "2023-11-01" }],
  messages: [],
  payouts: []
};