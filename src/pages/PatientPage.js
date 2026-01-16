import React, { useState } from 'react';
import Card from '../components/ui/Card.js';
import Button from '../components/ui/Button.js';
import Badge from '../components/ui/Badge.js';
import Modal from '../components/ui/Modal.js';
import ChatWidget from '../components/features/ChatWidget.js';
import { calculateCalories, getTodayDate } from '../utils/HelperFunction.js';

const PatientPage = ({ user, db, setDb, onLogout }) => {
  const today = getTodayDate();
  const liveUser = db.users.find(u => u.id === user.id) || user;
  
  // --- CALCULATE STATS ---
  const dob = new Date(liveUser.dob);
  const age = Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970);
  const targetCals = calculateCalories(liveUser.weight, liveUser.height, age, liveUser.gender);
  
  // FIND PLAN (Get the LATEST one if duplicates exist)
  const plan = db.plans
    .filter(p => p.patientId === liveUser.id && p.date === today)
    .pop(); // Taking the last one ensures we see the latest save

  const logs = db.logs.filter(l => l.patientId === liveUser.id && l.date === today);
  const totalCals = logs.reduce((acc, curr) => acc + curr.cals, 0);
  const progress = Math.min((totalCals / targetCals) * 100, 100);

  const [modals, setModals] = useState({ extra: false, rate: false, chat: false, weight: false });

  // --- HANDLERS ---

  // 1. Eat a planned meal option
  const handleEatOption = (mealType, optionKey, items) => {
    const mealCals = items.reduce((sum, item) => sum + (item.cals || 0), 0);
    const mealName = items.map(i => i.name).join(' + ');

    const newLog = { 
      id: Date.now(), 
      patientId: liveUser.id, 
      date: today, 
      mealType: mealType, 
      foodName: `Option ${optionKey}: ${mealName}`, 
      grams: 1, 
      cals: mealCals, 
      isCheatMeal: false,
      selectedOption: optionKey
    };
    
    setDb(prev => ({ ...prev, logs: [...prev.logs, newLog] }));
  };

  // 2. Log an extra snack
  const handleLogExtra = (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const item = db.ingredients.find(i => i.id === parseInt(data.get('id')));
      const g = parseInt(data.get('grams'));
      
      const newLog = { 
        id: Date.now(), patientId: liveUser.id, date: today, mealType: 'snack', 
        foodName: item.name, grams: g, cals: Math.round((item.cals/100)*g), isCheatMeal: true 
      };
      setDb(prev => ({ ...prev, logs: [...prev.logs, newLog] }));
      setModals(prev => ({...prev, extra: false}));
  };

  // 3. Update Weight
  const handleUpdateWeight = async (e) => {
    e.preventDefault();
    const newWeight = parseFloat(e.target.weight.value);
    
    // Update Backend
    await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: newWeight })
    });

    // Update Frontend
    setDb(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === user.id ? { ...u, weight: newWeight } : u)
    }));
    
    setModals(p => ({ ...p, weight: false }));
    alert("✅ Weight Updated!");
  };

  // 4. Rate Doctor
  const handleRateDoctor = async (e) => {
    e.preventDefault();
    const rating = parseInt(e.target.rating.value);
    const comment = e.target.comment.value;
    
    const newReview = {
        id: Date.now(),
        patientId: user.id,
        dietitianId: liveUser.assignedDietitianId,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0]
    };

    // Save to Backend
    await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
    });

    // Update Frontend
    setDb(prev => ({ ...prev, reviews: [...prev.reviews, newReview] }));
    setModals(p => ({ ...p, rate: false }));
    alert("✅ Thank you for your review!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Keto Journey</h1>
          <p className="text-sm text-gray-500">Welcome, {liveUser.name}</p>
        </div>
        <Button variant="danger" onClick={onLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Daily Progress">
            <div className="flex justify-between text-sm mb-2">
              <span>Calories</span>
              <span className="font-bold">{totalCals} / {targetCals}</span>
            </div>
             <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden mt-2">
               <div className={`h-full transition-all duration-500 ${totalCals > targetCals ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }} />
             </div>
          </Card>
          <Card title="Tools">
             <div className="space-y-2">
               <Button className="w-full text-xs" variant="secondary" onClick={() => setModals(prev => ({...prev, weight: true}))}>Update Weight</Button>
               <Button className="w-full text-xs" variant="warning" onClick={() => setModals(prev => ({...prev, rate: true}))}>Rate Dietitian</Button>
               <Button className="w-full text-xs" onClick={() => setModals(prev => ({...prev, chat: true}))}>Chat with Doctor</Button>
             </div>
          </Card>
        </div>
        
        {/* MAIN FEED */}
        <div className="lg:col-span-8 space-y-6">
          <Card title={`Today's Meal Plan (${today})`}>
            {!plan ? (
              <div className="text-center py-12 bg-gray-50 rounded border-dashed border-2 text-gray-400">
                No plan assigned for today.
              </div>
            ) : (
              ['breakfast', 'lunch', 'dinner'].map(type => {
                const log = logs.find(l => l.mealType === type);
                
                // ROBUST DATA HANDLING
                const rawData = plan.meals[type];
                let options = { A: [], B: [], C: [] };
                if (Array.isArray(rawData)) {
                    options.A = rawData; // Support Old Format
                } else if (rawData) {
                    options = rawData;   // Support New Format
                }

                return (
                  <div key={type} className="mb-8">
                    <div className="flex justify-between items-end border-b pb-2 mb-4">
                      <h4 className="capitalize font-bold text-emerald-800 text-lg">{type}</h4>
                      {log && <Badge color="green">Completed (Option {log.selectedOption || 'A'})</Badge>}
                    </div>
                    
                    {log ? (
                      // VIEW 1: ALREADY EATEN
                      <div className="bg-emerald-50 border border-emerald-200 rounded p-4 flex justify-between items-center animate-in fade-in">
                        <div>
                           <span className="font-bold text-emerald-800 block">{log.foodName}</span>
                           <span className="text-xs text-emerald-600">You chose this option.</span>
                        </div>
                        <span className="font-bold text-emerald-700">{log.cals} kcal</span>
                      </div>
                    ) : (
                      // VIEW 2: SHOW 3 OPTIONS
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['A', 'B', 'C'].map(optKey => {
                          const items = options[optKey] || [];
                          if (items.length === 0) return null; // Hide empty options
                          
                          const totalOptCals = items.reduce((s, i) => s + (i.cals || 0), 0);

                          return (
                            <div key={optKey} className="border rounded-xl p-4 hover:shadow-md transition bg-white flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <Badge color="gray">Option {optKey}</Badge>
                                  <span className="text-xs font-bold text-gray-500">{totalOptCals} kcal</span>
                                </div>
                                <ul className="text-sm space-y-1 mb-4">
                                  {items.map((i, idx) => (
                                    <li key={idx} className="flex gap-2 items-center text-gray-700">
                                      <span>•</span> {i.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <Button 
                                onClick={() => handleEatOption(type, optKey, items)}
                                className="w-full py-2 text-xs"
                              >
                                Select & Eat
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </Card>

          <Card title="Food Log">
             {logs.length === 0 && <p className="text-gray-400 italic">Nothing eaten yet.</p>}
             {logs.map(log => (
               <div key={log.id} className="flex justify-between p-2 border-b last:border-0 text-sm">
                 <span>{log.foodName} {log.isCheatMeal && <span className="text-red-500 font-bold">(Extra)</span>}</span>
                 <span className="font-bold text-gray-600">{log.cals} kcal</span>
               </div>
             ))}
             <Button variant="ghost" onClick={() => setModals(prev => ({...prev, extra: true}))} className="w-full mt-2 border-dashed border-2">
               + Log Unplanned Snack
             </Button>
          </Card>
        </div>

        {/* MODALS */}
        <ChatWidget isOpen={modals.chat} toggleOpen={() => setModals(p => ({...p, chat: !p.chat}))} currentUserId={liveUser.id} otherUserId={liveUser.assignedDietitianId} db={db} setDb={setDb} title="Dietitian" />
        
        {modals.extra && (
          <Modal title="Log Snack" onClose={() => setModals(p => ({...p, extra: false}))}>
             <form onSubmit={handleLogExtra} className="space-y-4">
               <select name="id" className="w-full border p-2 rounded">{db.ingredients.map(i => <option key={i.id} value={i.id}>{i.name} ({i.cals} kcal)</option>)}</select>
               <input name="grams" type="number" placeholder="Grams" className="w-full border p-2 rounded" required />
               <Button className="w-full bg-red-600">Log It</Button>
             </form>
          </Modal>
        )}

        {modals.weight && (
          <Modal title="Update Weight" onClose={() => setModals(p => ({...p, weight: false}))}>
            <form onSubmit={handleUpdateWeight} className="space-y-4">
               <div className="bg-emerald-50 p-3 rounded text-sm text-emerald-800">
                  Current Weight: <strong>{liveUser.weight} kg</strong>
               </div>
               <input name="weight" type="number" step="0.1" placeholder="New Weight (kg)" className="w-full border p-2 rounded" required />
               <Button className="w-full">Save New Weight</Button>
            </form>
          </Modal>
        )}

        {modals.rate && (
          <Modal title="Rate Your Dietitian" onClose={() => setModals(p => ({...p, rate: false}))}>
            <form onSubmit={handleRateDoctor} className="space-y-4">
               <div className="flex justify-center text-2xl gap-2 mb-2">
                  {[1,2,3,4,5].map(n => (
                     <label key={n} className="cursor-pointer">
                        <input type="radio" name="rating" value={n} className="hidden peer" required />
                        <span className="opacity-30 peer-checked:opacity-100 hover:opacity-100 transition">⭐</span>
                     </label>
                  ))}
               </div>
               <textarea name="comment" className="w-full border p-2 rounded h-24 text-sm" placeholder="Write a review..." required></textarea>
               <Button className="w-full">Submit Review</Button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PatientPage;