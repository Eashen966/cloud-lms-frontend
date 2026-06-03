import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';

function App() {
  // FIX 1: Initialize user from localStorage so page refresh doesn't log out
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  // Unauthenticated Gateway
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Role-Based Routing — matches backend enum INSTRUCTOR / STUDENT
  if (user.role === 'INSTRUCTOR') {
    return <InstructorDashboard user={user} onLogout={handleLogout} />;
  }

  return <StudentDashboard user={user} onLogout={handleLogout} />;
}

export default App;