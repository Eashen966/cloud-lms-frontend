import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function InstructorDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);
  // FIX: field names match Course model — courseName, courseCode, enrollmentCapacity
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    courseCode: '',
    description: '',
    enrollmentCapacity: 30
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      // FIX: send correct field names matching Course entity + link instructor by userId
      await api.post('/courses', {
        courseName: newCourse.courseName,
        courseCode: newCourse.courseCode,
        description: newCourse.description,
        enrollmentCapacity: parseInt(newCourse.enrollmentCapacity),
        instructor: { userId: user.userId }  // FIX: backend expects instructor as User object with userId
      });
      setMsg({ type: 'success', text: 'Course created successfully!' });
      setNewCourse({ courseName: '', courseCode: '', description: '', enrollmentCapacity: 30 });
      fetchCourses();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create course. Check if course code is unique.';
      setMsg({ type: 'error', text: errMsg });
    }
  };

  const styles = {
    layout: { minHeight: '100vh', backgroundColor: '#e5f6f4', fontFamily: 'system-ui, sans-serif' },
    nav: { backgroundColor: '#0f4c5c', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' },
    logoutBtn: { backgroundColor: 'transparent', border: '1px solid #e5f6f4', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    // FIX: fixed typo maxWIdth -> maxWidth
    main: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(15,76,92,0.05)' },
    title: { color: '#0f4c5c', marginBottom: '20px', marginTop: 0 },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f4c5c', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1.5px solid #a3d2ca', boxSizing: 'border-box', fontSize: '14px' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#14a790', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    item: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #14a790', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    successBanner: { padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', color: '#2e7d32', backgroundColor: '#e8f5e9' },
    errorBanner: { padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', color: '#c62828', backgroundColor: '#ffebee' }
  };

  return (
    <div style={styles.layout}>
      <header style={styles.nav}>
        <h3>Cloud LMS | Instructor Console</h3>
        <div>
          <span style={{ marginRight: '20px' }}>Welcome, {user?.name}</span>
          <button onClick={onLogout} style={styles.logoutBtn}>Exit Console</button>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h4 style={styles.title}>Create New Course</h4>
          {msg.text && (
            <div style={msg.type === 'success' ? styles.successBanner : styles.errorBanner}>
              {msg.text}
            </div>
          )}
          <form onSubmit={handleCreateCourse}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Course Name</label>
              {/* FIX: field name courseName matches backend model */}
              <input type="text" style={styles.input} required value={newCourse.courseName}
                placeholder="e.g. System Architecture"
                onChange={e => setNewCourse({ ...newCourse, courseName: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Course Code</label>
              {/* FIX: field name courseCode matches backend model */}
              <input type="text" style={styles.input} required value={newCourse.courseCode}
                placeholder="e.g. CSF3103"
                onChange={e => setNewCourse({ ...newCourse, courseCode: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <input type="text" style={styles.input} value={newCourse.description}
                placeholder="Brief course description"
                onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Enrollment Capacity</label>
              <input type="number" style={styles.input} required value={newCourse.enrollmentCapacity}
                min="1" max="200"
                onChange={e => setNewCourse({ ...newCourse, enrollmentCapacity: e.target.value })} />
            </div>
            <button type="submit" style={styles.btn}>Deploy Course</button>
          </form>
        </section>

        <section>
          <h4 style={{ ...styles.title, margin: '0 0 20px 0' }}>Active Courses</h4>
          <div style={styles.grid}>
            {courses.map(c => (
              // FIX: use correct field names from backend — courseId, courseCode, courseName, instructor
              <div key={c.courseId} style={styles.item}>
                <b style={{ color: '#0f4c5c', fontSize: '16px' }}>{c.courseCode}</b>
                <div style={{ color: '#62929e', margin: '5px 0 8px 0', fontSize: '14px' }}>{c.courseName}</div>
                <small style={{ color: '#14a790', fontWeight: '500' }}>
                  Instructor: {c.instructor?.name || 'N/A'}
                </small>
                <div style={{ fontSize: '12px', color: '#62929e', marginTop: '5px' }}>
                  Students: {c.enrolledStudents?.length || 0} / {c.enrollmentCapacity}
                </div>
              </div>
            ))}
            {courses.length === 0 && <p style={{ color: '#62929e' }}>No courses created yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}