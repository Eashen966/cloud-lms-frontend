import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseWorkspace from './pages/CourseWorkspace';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={
          user.role === 'INSTRUCTOR' ? 
            <Navigate to="/instructor" replace /> : 
            <Navigate to="/student" replace />
        } />
        <Route path="/instructor" element={
          user.role === 'INSTRUCTOR' ? 
            <InstructorDashboard user={user} onLogout={handleLogout} /> :
            <Navigate to="/" replace />
        } />
        <Route path="/student" element={
          user.role === 'STUDENT' ? 
            <StudentDashboard user={user} onLogout={handleLogout} /> :
            <Navigate to="/" replace />
        } />
        <Route path="/course/:courseId" element={
          <CourseWorkspace user={user} onLogout={handleLogout} />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;