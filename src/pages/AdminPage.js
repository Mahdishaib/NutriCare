import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AdminPage = ({ db, onLogout }) => {
  const [activeTab, setActiveTab] = useState('ingredients');

  const handleAddItem = async (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Send to Backend
    await fetch(`http://localhost:5000/api/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, id: Date.now(), cals: parseInt(data.cals) })
    });
    alert('Item Added!');
    window.location.reload(); // Refresh to see new data
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button variant="danger" onClick={onLogout}>Logout</Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={() => setActiveTab('ingredients')} variant={activeTab === 'ingredients' ? 'primary' : 'secondary'}>Manage Ingredients</Button>
        <Button onClick={() => setActiveTab('recipes')} variant={activeTab === 'recipes' ? 'primary' : 'secondary'}>Manage Recipes</Button>
      </div>

      <Card title={`Add New ${activeTab === 'ingredients' ? 'Ingredient' : 'Recipe'}`}>
        <form onSubmit={(e) => handleAddItem(e, activeTab)} className="space-y-4">
          <input name="name" placeholder="Name (e.g., Avocado)" className="w-full border p-2 rounded" required />
          <input name="cals" type="number" placeholder="Calories" className="w-full border p-2 rounded" required />
          <Button className="w-full">Save to Database</Button>
        </form>
      </Card>

      <div className="mt-8">
        <h3 className="font-bold mb-4">Current Database:</h3>
        <div className="grid grid-cols-3 gap-4">
          {db[activeTab].map(item => (
            <div key={item.id} className="bg-white p-3 rounded shadow text-sm flex justify-between">
              <span>{item.name}</span>
              <span className="font-bold text-gray-500">{item.cals} kcal</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
