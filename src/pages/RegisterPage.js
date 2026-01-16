import React, { useState } from 'react';
import AuthLayout from '../components/layout/AuthLayout.js';
import Button from '../components/ui/Button.js';

const RegisterPage = ({ onRegister, toLogin }) => {
  const [role, setRole] = useState('patient');
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card'); // For Patients (Paying)
  
  const [form, setForm] = useState({
    email: '', password: '', name: '', 
    weight: '', height: '', dob: '', gender: 'male',
    medical_conditions: [],
    paymentInfo: '', // For Patients (Paying)
    
    // NEW: Dietitian Specific Fields
    certificate: null, // Stores the file URL
    payoutDetails: '' // Where they want to receive money
  });

  const conditionsList = [
    { id: 1, name: 'Type 2 Diabetes' },
    { id: 2, name: 'Hypertension' },
    { id: 3, name: 'Peanut Allergy' },
    { id: 4, name: 'Gluten Intolerance' }
  ];

  const toggleCondition = (name) => {
    setForm(prev => {
      const exists = prev.medical_conditions.find(c => c.name === name);
      if (exists) return { ...prev, medical_conditions: prev.medical_conditions.filter(c => c.name !== name) };
      return { ...prev, medical_conditions: [...prev.medical_conditions, { id: Date.now(), name }] };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // In a real app, this would upload to a server. 
        // For this prototype, we create a temporary local URL so the Admin can see it.
        const fakeUrl = URL.createObjectURL(file);
        setForm({ ...form, certificate: fakeUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      onRegister({ 
        ...form, 
        role, 
        paymentMethod: role === 'patient' ? paymentMethod : null 
      });
    }
  };

  return (
    <AuthLayout title={step === 1 ? "Create Account" : "Complete Profile"}>
      {step === 1 && (
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          {['patient', 'dietitian'].map(r => (
            <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 text-sm font-bold rounded capitalize transition ${role===r?'bg-white shadow text-emerald-600':'text-gray-500'}`}>{r}</button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* STEP 1: BASIC INFO (Shared) */}
        {step === 1 && (
          <>
            <input className="w-full border p-2 rounded" placeholder="Full Name" onChange={e=>setForm({...form, name: e.target.value})} required />
            <input className="w-full border p-2 rounded" placeholder="Email" type="email" onChange={e=>setForm({...form, email: e.target.value})} required />
            <input className="w-full border p-2 rounded" placeholder="Password" type="password" onChange={e=>setForm({...form, password: e.target.value})} required />
            {role === 'patient' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <input className="border p-2 rounded" placeholder="Weight (kg)" type="number" onChange={e=>setForm({...form, weight: e.target.value})} required />
                <input className="border p-2 rounded" placeholder="Height (cm)" type="number" onChange={e=>setForm({...form, height: e.target.value})} required />
                <input className="border p-2 rounded col-span-2" type="date" onChange={e=>setForm({...form, dob: e.target.value})} required />
              </div>
            )}
            <Button className="w-full mt-4">Next: {role === 'patient' ? "Health & Payment" : "Verification & Payout"} ➤</Button>
          </>
        )}

        {/* STEP 2: ROLE SPECIFIC */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-300">
            
            {/* --- PATIENT FLOW --- */}
            {role === 'patient' && (
              <>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Medical Conditions</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border p-2 rounded bg-gray-50">
                    {conditionsList.map(c => (
                      <label key={c.id} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-emerald-600" onChange={() => toggleCondition(c.name)} />
                        <span className="text-sm text-gray-700">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Subscription ($50/mo)</label>
                  <div className="flex gap-2 mb-3">
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-2 border rounded text-sm font-bold flex items-center justify-center gap-2 ${paymentMethod==='card' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'}`}>💳 Card</button>
                    <button type="button" onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-2 border rounded text-sm font-bold flex items-center justify-center gap-2 ${paymentMethod==='paypal' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}>🅿️ PayPal</button>
                  </div>
                  {paymentMethod === 'card' ? (
                    <div className="grid grid-cols-3 gap-2">
                      <input className="col-span-2 border p-2 rounded text-sm" placeholder="Card Number" required maxLength={19} onChange={e=>setForm({...form, paymentInfo: e.target.value})} />
                      <input className="border p-2 rounded text-sm" placeholder="CVV" required maxLength={3} />
                    </div>
                  ) : (
                    <input type="email" className="w-full border p-2 rounded text-sm" placeholder="PayPal Email" required onChange={e=>setForm({...form, paymentInfo: e.target.value})} />
                  )}
                </div>
              </>
            )}

            {/* --- DIETITIAN FLOW (NEW) --- */}
            {role === 'dietitian' && (
               <div className="space-y-5">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-800">
                    <strong>Admin Verification:</strong> You must upload your degree/license. You cannot accept patients until verified.
                  </div>

                  {/* 1. Certificate Upload */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Upload Certificate</label>
                    <input 
                        type="file" 
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
                        required 
                    />
                  </div>

                  {/* 2. Payout Details */}
                  <div className="border-t pt-4">
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Payout Method (Withdrawals)</label>
                    <input 
                        className="w-full border p-2 rounded mb-2" 
                        placeholder="Bank IBAN or PayPal Address" 
                        onChange={e => setForm({...form, payoutDetails: e.target.value})}
                        required 
                    />
                    <p className="text-xs text-gray-400">
                       Earnings are calculated as <strong>80%</strong> of patient subscriptions.
                    </p>
                  </div>
               </div>
            )}

            <div className="flex gap-2 mt-6">
              <Button variant="secondary" onClick={() => setStep(1)} type="button">Back</Button>
              <Button className="flex-1">Complete Registration</Button>
            </div>
          </div>
        )}
      </form>
      {step === 1 && <button onClick={toLogin} className="w-full text-center text-sm text-gray-500 mt-4 hover:underline">Back to Login</button>}
    </AuthLayout>
  );
};

export default RegisterPage;