import React from 'react';
import Button from '../ui/Button.js';

const DashboardLayout = ({ user, onLogout, children }) => (
  <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
    <nav className="bg-emerald-700 text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">🩺</span> NutriCare
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-90 hidden sm:inline">{user.name} ({user.role})</span>
          <Button variant="ghost" onClick={onLogout} className="text-white hover:bg-emerald-800 hover:text-white">Logout</Button>
        </div>
      </div>
    </nav>
    <main className="max-w-6xl mx-auto p-6">{children}</main>
  </div>
);

export default DashboardLayout;