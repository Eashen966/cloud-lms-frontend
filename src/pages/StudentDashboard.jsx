import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function StudentDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [enrollMsg, setEnrollMsg] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // FIX: use user.userId from backend response and correct API endpoint
  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`, { studentId: user.userId });
      setEnrollMsg(`Successfully enrolled!`);
      setTimeout(() => setEnrollMsg(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed.';
      setEnrollMsg(msg);
      setTimeout(() => setEnrollMsg(''), 3000);
    }
  };

  const styles = {
    layout: { minHeight: '100vh', backgroundColor: '#e5f6f4', fontFamily: 'system-ui, sans-serif' },
    nav: { backgroundColor: '#0f4c5c', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' },
    logoutBtn: { backgroundColor: 'transparent', border: '1px solid #e5f6f4', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    main: { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },
    title: { color: '#0f4c5c', borderBottom: '2px solid #a3d2ca', paddingBottom: '10px', marginBottom: '25px' },
    banner: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    code: { color: '#14a790', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase' },
    heading: { color: '#0f4c5c', fontSize: '18px', margin: '8px 0 10px 0', fontWeight: '600' },
    meta: { fontSize: '13px', color: '#62929e', marginBottom: '15px' },
    joinBtn: { width: '100%', padding: '10px', backgroundColor: '#0f4c5c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }
  };

  return (
    <div style={styles.layout}>
      <header style={styles.nav}>
        <h3>Cloud LMS | Student Hub</h3>
        <div>
          {/* FIX: use correct field names from backend User model */}
          <span style={{ marginRight: '20px' }}>{user?.name} ({user?.matricNo})</span>
          <button onClick={onLogout} style={styles.logoutBtn}>Leave Hub</button>
        </div>
      </header>

      <main style={styles.main}>
        <h4 style={styles.title}>Available Learning Workspaces</h4>
        {enrollMsg && <div style={styles.banner}>{enrollMsg}</div>}
        <div style={styles.grid}>
          {courses.map(c => (
            // FIX: use correct field names from backend — courseId, courseCode, courseName, instructor
            <div key={c.courseId} style={styles.card}>
              <div>
                <span style={styles.code}>{c.courseCode}</span>
                <h3 style={styles.heading}>{c.courseName}</h3>
                <div style={styles.meta}>🎒 Instructor: {c.instructor?.name || 'N/A'}</div>
                <div style={styles.meta}>Capacity: {c.enrolledStudents?.length || 0} / {c.enrollmentCapacity}</div>
              </div>
              <button onClick={() => handleEnroll(c.courseId)} style={styles.joinBtn}>
                Enroll in Course
              </button>
            </div>
          ))}
          {courses.length === 0 && <p style={{ color: '#62929e' }}>No courses available yet.</p>}
        </div>
      </main>
    </div>
  );
}