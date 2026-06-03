import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) setUser(JSON.parse(cachedUser));
    fetchAvailableWorkspaces();
  }, []);

  const fetchAvailableWorkspaces = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error("Error accessing academic feed:", err);
    }
  };

  const handleJoinWorkspace = (courseCode) => {
    alert(`Successfully synced with workspace: ${courseCode}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const styles = {
    layout: { minHeight: '100vh', backgroundColor: '#e5f6f4', fontFamily: 'system-ui, sans-serif' },
    nav: { backgroundColor: '#0f4c5c', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' },
    logoutBtn: { backgroundColor: 'transparent', border: '1px solid #e5f6f4', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    main: { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },
    title: { color: '#0f4c5c', borderBottom: '2px solid #a3d2ca', paddingBottom: '10px', marginBottom: '25px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    code: { color: '#14a790', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', trackingSpacing: '1px' },
    heading: { color: '#0f4c5c', fontSize: '20px', margin: '8px 0 15px 0', fontWeight: '600' },
    meta: { fontSize: '13px', color: '#62929e', marginBottom: '20px' },
    joinBtn: { width: '100%', padding: '10px', backgroundColor: '#0f4c5c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }
  };

  return (
    <div style={styles.layout}>
      <header style={styles.nav}>
        <h3>Cloud LMS | Student Hub</h3>
        <div>
          <span style={{ marginRight: '20px' }}>{user?.name} ({user?.matricNo})</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Leave Hub</button>
        </div>
      </header>

      <main style={styles.main}>
        <h4 style={styles.title}>Available Learning Workspaces</h4>
        <div style={styles.grid}>
          {courses.map(c => (
            <div key={c.id} style={styles.card}>
              <div>
                <span style={styles.code}>{c.code}</span>
                <h3 style={styles.heading}>{c.title}</h3>
                <div style={styles.meta}>🎒 Lead: {c.instructorName}</div>
              </div>
              <button onClick={() => handleJoinWorkspace(c.code)} style={styles.joinBtn}>
                Enter Classroom
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}