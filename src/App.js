import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientPage from './pages/PatientPage';
import DietitianPage from './pages/DietitianPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  const [db, setDb] = useState({
    users: [], ingredients: [], recipes: [], plans: [], logs: [], payments: [], messages: [], reviews: []
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, ingredients, recipes, plans, logs, payments, messages, reviews] = await Promise.all([
          fetch('http://localhost:5000/api/users').then(r => r.json()),
          fetch('http://localhost:5000/api/ingredients').then(r => r.json()),
          fetch('http://localhost:5000/api/recipes').then(r => r.json()),
          fetch('http://localhost:5000/api/plans').then(r => r.json()),
          fetch('http://localhost:5000/api/logs').then(r => r.json()),
          fetch('http://localhost:5000/api/payments').then(r => r.json()),
          fetch('http://localhost:5000/api/messages').then(r => r.json()),
          fetch('http://localhost:5000/api/reviews').then(r => r.json())
        ]);
        setDb({ users, ingredients, recipes, plans, logs, payments, messages, reviews });
      } catch (err) { console.error("Error fetching data", err); }
    };
    fetchData();
  }, []);

  const handleLogin = (email, password) => {
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
      if (user.isBlocked) return alert("Account Blocked");
      setCurrentUser(user);
      setView('dashboard');
    } else {
      alert("Invalid credentials");
    }
  };

  const handleRegister = async (formData) => {
    const newUser = { 
        ...formData, 
        id: Date.now(), 
        role: formData.role || 'patient', 
        isBlocked: false, 
        wallet: 0, 
        isVerified: formData.role === 'dietitian' ? false : true 
    };

    try {
        const res = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        const savedUser = await res.json();
        setDb(prev => ({ ...prev, users: [...prev.users, savedUser] }));
        setView('login');
    } catch (err) { alert("Registration failed"); }
  };

  const handleLogout = () => { setCurrentUser(null); setView('login'); };

  if (view === 'login') return <LoginPage onLogin={handleLogin} onRegisterClick={() => setView('register')} />;
  if (view === 'register') return <RegisterPage onRegister={handleRegister} toLogin={() => setView('login')} />;

  if (currentUser) {
    if (currentUser.role === 'admin') return <AdminPage db={db} setDb={setDb} user={currentUser} onLogout={handleLogout} />;
    if (currentUser.role === 'dietitian') return <DietitianPage user={currentUser} db={db} setDb={setDb} onLogout={handleLogout} />;
    if (currentUser.role === 'patient') return <PatientPage user={currentUser} db={db} setDb={setDb} onLogout={handleLogout} />;
  }
  return <div>Loading...</div>;
};

export default App;