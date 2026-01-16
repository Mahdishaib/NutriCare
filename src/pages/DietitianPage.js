import React, { useState } from 'react';
import Card from '../components/ui/Card.js';
import Button from '../components/ui/Button.js';
import DietitianPlanEditor from '../components/features/DietitianPlanEditor.js';

const DietitianPage = ({ user, db, setDb, onLogout }) => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Filter users to show only patients assigned to this dietitian
  const myPatients = db.users.filter(u => u.role === 'patient' && u.assignedDietitianId === user.id);
  const selectedPatient = db.users.find(u => u.id === parseInt(selectedPatientId));

  // --- SAVE PLAN HANDLER ---
  // This function is passed down to the Editor component
  const handleSavePlan = async (planData) => {
    try {
      // 1. Send data to the Backend API
      const response = await fetch('http://localhost:5000/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...planData, dietitianId: user.id })
      });

      if (response.ok) {
        const savedPlan = await response.json();
        
        // 2. Update Local State (so the UI updates immediately)
        setDb(prev => {
          // Remove old plan for this date if it exists, then add the new one
          const otherPlans = prev.plans.filter(p => !(p.patientId === savedPlan.patientId && p.date === savedPlan.date));
          return { ...prev, plans: [...otherPlans, savedPlan] };
        });

        alert('✅ Plan saved successfully!');
      } else {
        alert('Failed to save plan on server.');
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-emerald-900">Dr. {user.name}'s Dashboard</h1>
        <Button variant="danger" onClick={onLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN: Patient List */}
        <div className="col-span-3">
          <Card title="My Patients">
            <div className="space-y-2">
              {myPatients.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedPatientId === p.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white hover:bg-emerald-100 text-gray-700'
                  }`}
                >
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs opacity-75">Goal: {p.weight}kg</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Editor Area */}
        <div className="col-span-9">
          {selectedPatient ? (
            <Card title={`Editing Plan for: ${selectedPatient.name}`}>
              {/* THE COMPONENT CONNECTION */}
              <DietitianPlanEditor 
                patient={selectedPatient} 
                ingredients={db.ingredients}   // Passing food database
                recipes={db.recipes}           // Passing recipe database
                onSave={handleSavePlan}        // Passing the save function
              />
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center bg-white rounded-xl border-dashed border-2 border-gray-300 text-gray-400">
              Select a patient to view or edit their plan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietitianPage;

