import React, { useState } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // 1. Unauthenticated Gateway Gate
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Role-Based Dynamic Structural Gateway Routing
  if (user.role === 'INSTRUCTOR') {
    return <InstructorDashboard user={user} onLogout={handleLogout} />;
  }

  return <StudentDashboard user={user} onLogout={handleLogout} />;
}

export default App;
// Avoid LaTeX rendering in prose