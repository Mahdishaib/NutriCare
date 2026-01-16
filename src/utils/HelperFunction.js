export const calculateCalories = (weight, height, age, gender) => {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += (gender === 'male' ? 5 : -161);
  return Math.round(bmr * 1.2); // Sedentary multiplier
};

export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};