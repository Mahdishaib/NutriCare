import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const DietitianPlanEditor = ({ patient, ingredients = [], recipes = [], existingPlans = [], onSave }) => {
  //  Generate Week
  const generateWeek = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = generateWeek();
  const [selectedDate, setSelectedDate] = useState(weekDates[0]);
  const [activeTab, setActiveTab] = useState({ breakfast: 'A', lunch: 'A', dinner: 'A' });
  const [isEditing, setIsEditing] = useState(true); //viewing Edit Mode

  // Empty State Helper
  const emptyMeals = { 
    breakfast: { A: [], B: [], C: [] }, 
    lunch: { A: [], B: [], C: [] }, 
    dinner: { A: [], B: [], C: [] } 
  };
  
  const [meals, setMeals] = useState(emptyMeals);

  // 2. Load Plan 
  useEffect(() => {
    const foundPlan = existingPlans.find(p => p.patientId === patient.id && p.date === selectedDate);
    
    if (foundPlan && foundPlan.meals) {
      // PLAN EXISTS -> LOAD IT & SWITCH TO VIEW MODE
      const loadedMeals = { ...emptyMeals };
      ['breakfast', 'lunch', 'dinner'].forEach(type => {
        if (foundPlan.meals[type]) {
           if (Array.isArray(foundPlan.meals[type])) {
             loadedMeals[type].A = foundPlan.meals[type];
           } else {
             loadedMeals[type] = { ...loadedMeals[type], ...foundPlan.meals[type] };
           }
        }
      });
      setMeals(loadedMeals);
      setIsEditing(false); // <--- HIDE INPUTS (Show View Mode)
    } else {
      // NO PLAN -> RESET & SWITCH TO EDIT MODE
      setMeals(emptyMeals);
      setIsEditing(true);  // <--- SHOW INPUTS
    }
  }, [selectedDate, patient.id, existingPlans]); 

  // 3. Logic Helpers
  const calculateTotal = () => {
    let total = 0;
    ['breakfast', 'lunch', 'dinner'].forEach(type => {
      // Estimate based on Option A
      meals[type]['A'].forEach(item => total += (item.cals || 0));
    });
    return total;
  };

  const addToMeal = (mealType, id) => {
    const currentOption = activeTab[mealType];
    const idNum = parseInt(id);
    let itemToAdd = recipes.find(r => r.id === idNum);
    if (itemToAdd) itemToAdd = { ...itemToAdd, type: 'recipe' };
    else {
      const ing = ingredients.find(i => i.id === idNum);
      if (ing) itemToAdd = { ...ing, type: 'ingredient' };
    }

    if (itemToAdd) {
      setMeals(prev => ({
        ...prev,
        [mealType]: {
          ...prev[mealType],
          [currentOption]: [...prev[mealType][currentOption], itemToAdd]
        }
      }));
    }
  };

  const removeItem = (mealType, option, index) => {
    setMeals(prev => {
      const newList = [...prev[mealType][option]];
      newList.splice(index, 1);
      return { ...prev, [mealType]: { ...prev[mealType], [option]: newList } };
    });
  };


  return (
    <div className="space-y-6 animate-in fade-in">
      {/* --- WEEK NAVIGATOR --- */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weekDates.map(date => {
            const isDone = existingPlans.some(p => p.patientId === patient.id && p.date === date);
            const isSelected = selectedDate === date;
            const d = new Date(date);
            const label = `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}`;

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                  isSelected 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105' 
                    : isDone 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div>{label}</div>
                {isDone && <div className="text-[10px] opacity-75">✓ Set</div>}
              </button>
            );
          })}
        </div>

      {/* --- HEADER --- */}
      <div className="flex justify-between items-end border-b pb-2">
        <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">
            Plan for: <span className="text-emerald-600">{selectedDate}</span>
            </h2>
            {/* TOGGLE BUTTON */}
            {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                    ✏️ Edit Plan
                </Button>
            ) : (
                <Badge color="yellow">Editing Mode</Badge>
            )}
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-500">Est. Calories (Opt A)</p>
          <p className={`text-2xl font-bold ${calculateTotal() > 2000 ? 'text-red-500' : 'text-emerald-600'}`}>
            {calculateTotal()} kcal
          </p>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {!isEditing ? (
          // VIEW MODE (READ ONLY)
          <div className="space-y-4">
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-lg font-bold text-gray-700">Plan Saved & Active</h3>
                  <p className="text-gray-500 text-sm mb-4">The patient can see this plan on their dashboard.</p>
                  <Button onClick={() => setIsEditing(true)} variant="secondary">
                      Unlock & Edit Plan
                  </Button>
              </div>
              
              {/* Quick Preview of what was saved */}
              <div className="grid grid-cols-3 gap-4 opacity-75 grayscale hover:grayscale-0 transition-all">
                  {['breakfast', 'lunch', 'dinner'].map(m => (
                      <Card key={m} title={m.toUpperCase()}>
                         <p className="text-xs text-gray-500">Option A: {meals[m].A.length} items</p>
                         <p className="text-xs text-gray-500">Option B: {meals[m].B.length} items</p>
                         <p className="text-xs text-gray-500">Option C: {meals[m].C.length} items</p>
                      </Card>
                  ))}
              </div>
          </div>
      ) : (
          // EDIT MODE 
          <>
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
                <Card key={meal} title={meal.charAt(0).toUpperCase() + meal.slice(1)} className="border-l-4 border-l-emerald-500">
                
                {/* Option Tabs */}
                <div className="flex gap-2 mb-4 border-b pb-2">
                    {['A', 'B', 'C'].map(opt => (
                    <button
                        key={opt}
                        onClick={() => setActiveTab(prev => ({ ...prev, [meal]: opt }))}
                        className={`px-4 py-1 rounded-t-lg font-bold text-sm transition ${
                        activeTab[meal] === opt ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        Option {opt}
                    </button>
                    ))}
                </div>

                {/* List Items */}
                <div className="min-h-[80px] bg-gray-50 p-3 rounded mb-3 border border-gray-100">
                    {meals[meal][activeTab[meal]].length === 0 ? (
                    <p className="text-gray-400 text-xs italic text-center py-2">Option {activeTab[meal]} is empty</p>
                    ) : (
                    meals[meal][activeTab[meal]].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 mb-1 rounded shadow-sm border border-gray-100 text-sm">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-500">{item.cals}</span>
                            <button onClick={() => removeItem(meal, activeTab[meal], idx)} className="text-red-400 hover:text-red-600 font-bold">×</button>
                        </div>
                        </div>
                    ))
                    )}
                </div>

                {/* Dropdown */}
                <select 
                    className="w-full border p-2 rounded bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    onChange={(e) => { addToMeal(meal, e.target.value); e.target.value = ""; }}
                    defaultValue=""
                >
                    <option value="" disabled>+ Add to Option {activeTab[meal]}</option>
                    <optgroup label="Recipes">{recipes.map(r => <option key={r.id} value={r.id}>{r.name} ({r.cals})</option>)}</optgroup>
                    <optgroup label="Ingredients">{ingredients.map(i => <option key={i.id} value={i.id}>{i.name} ({i.cals})</option>)}</optgroup>
                </select>
                </Card>
            ))}

            <div className="flex justify-end pt-4 pb-10">
                <Button onClick={() => {
                    onSave({ patientId: patient.id, date: selectedDate, meals });
                    setIsEditing(false); // Switch to View Mode immediately
                }}>
                💾 Save Plan & Close
                </Button>
            </div>
          </>
      )}
    </div>
  );
};

export default DietitianPlanEditor;

