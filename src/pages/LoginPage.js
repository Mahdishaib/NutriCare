import React, { useState } from 'react';
import Card from '../components/ui/Card';     // changed from AuthLayout
import Button from '../components/ui/Button'; // making sure this path is correct

const LoginPage = ({ onLogin, onRegisterClick }) => { // Fixed prop name here
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      {/* Replaced AuthLayout with Card to ensure it works */}
      <Card title="NutriCare Login" className="w-full max-w-md p-6 shadow-lg">
        
        <form onSubmit={e => { e.preventDefault(); onLogin(email, pass); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none" 
              placeholder="doc@keto.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none" 
              type="password" 
              placeholder="123" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
            />
          </div>

          <Button className="w-full py-3 text-lg font-semibold">Sign In</Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          New here?{' '}
          <button 
            onClick={onRegisterClick} 
            className="text-emerald-600 font-bold hover:underline"
          >
            Create Account
          </button>
        </div>

        <div className="mt-8 text-xs text-center text-gray-500 bg-gray-100 p-3 rounded border border-gray-200">
          <strong>Demo Logins:</strong><br/>
          admin@keto.com / 123<br/>
          doc@keto.com / 123
        </div>

      </Card>
    </div>
  );
};

export default LoginPage;