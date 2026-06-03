import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', code: '' });
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) setUser(JSON.parse(cachedUser));
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching workspaces:", err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      // Maps accurately to backend Course entity payload constraints
      await api.post('/courses', {
        title: newCourse.title,
        code: newCourse.code,
        instructorName: user?.name || 'Instructor'
      });
      setMsg({ type: 'success', text: 'New learning workspace launched successfully!' });
      setNewCourse({ title: '', code: '' });
      fetchCourses();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to create workspace. Verify if code is unique.' });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const styles = {
    layout: { minHeight: '100vh', backgroundColor: '#e5f6f4', fontFamily: 'system-ui, sans-serif' },
    nav: { backgroundColor: '#0f4c5c', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' },
    logoutBtn: { backgroundColor: 'transparent', border: '1px solid #e5f6f4', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    main: { maxWIdth: '1000px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(15,76,92,0.05)' },
    title: { color: '#0f4c5c', marginBottom: '20px', marginTop: 0 },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f4c5c', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1.5px solid #a3d2ca', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#14a790', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    item: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #14a790', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
    banner: { padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', color: '#fff', backgroundColor: msg.type === 'success' ? '#14a790' : '#c62828' }
  };

  return (
    <div style={styles.layout}>
      <header style={styles.nav}>
        <h3>Cloud LMS | Instructor Console</h3>
        <div>
          <span style={{ marginRight: '20px' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Exit Console</button>
        </div>
      </header>
      
      <main style={styles.main}>
        <section style={styles.card}>
          <h4 style={styles.title}>Launch Workspace</h4>
          {msg.text && <div style={styles.banner}>{msg.text}</div>}
          <form onSubmit={handleCreateCourse}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Course Title</label>
              <input type="text" style={styles.input} required value={newCourse.title} placeholder="e.g. System Architecture" onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Course Code</label>
              <input type="text" style={styles.input} required value={newCourse.code} placeholder="e.g. CSF3103" onChange={e => setNewCourse({...newCourse, code: e.target.value})} />
            </div>
            <button type="submit" style={styles.btn}>Deploy Course</button>
          </form>
        </section>

        <section>
          <h4 style={{ ...styles.title, margin: '0 0 20px 0' }}>Active Cloud Classrooms</h4>
          <div style={styles.grid}>
            {courses.map(c => (
              <div key={c.id} style={styles.item}>
                <b style={{ color: '#0f4c5c', fontSize: '18px' }}>{c.code}</b>
                <div style={{ color: '#62929e', margin: '5px 0 10px 0', fontSize: '14px' }}>{c.title}</div>
                <small style={{ color: '#14a790', fontWeight: '500' }}>Host: {c.instructorName}</small>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}