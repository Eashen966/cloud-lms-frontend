import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function InstructorDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', { 
        courseCode, 
        courseName, 
        enrollmentCapacity: capacity, 
        instructor: { userId: user.userId } 
      });
      setCourseCode(''); setCourseName('');
      fetchCourses();
    } catch (err) { alert('Failed to create course'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light-pink)' }}>
      {/* Navbar */}
      <div style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: 'var(--primary-pink)', margin: 0 }}>CloudLMS (Instructor Portal)</h2>
        <div>
          <span style={{ marginRight: '1rem', fontWeight: '500' }}>Welcome, Dr. {user.name}</span>
          <button onClick={onLogout} style={{ background: 'var(--primary-pink)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>Log Out</button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(255,107,139,0.08)' }}>
          <h3 style={{ borderBottom: '2px solid var(--light-pink)', paddingBottom: '0.5rem' }}>Create a New Course</h3>
          <form onSubmit={handleCreateCourse} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '1rem', alignItems: 'end', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600' }}>Course Code</label>
              <input type="text" required value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="e.g. FSKM3100" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ffd1dc', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600' }}>Course Name</label>
              <input type="text" required value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g. Cloud Application Architecture" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ffd1dc', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600' }}>Capacity</label>
              <input type="number" required value={capacity} onChange={(e) => setCapacity(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ffd1dc', outline: 'none' }} />
            </div>
            <button type="submit" style={{ padding: '0.6rem 1.2rem', background: 'var(--primary-pink)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Add Course</button>
          </form>
        </div>

        {/* Catalog */}
        <h3 style={{ marginTop: '2rem', color: 'var(--text-dark)' }}>Active Course Catalog</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
          {courses.map((c) => (
            <div key={c.courseId} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderLeft: '5px solid var(--primary-pink)' }}>
              <span style={{ background: 'var(--light-pink)', color: 'var(--dark-pink)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{c.courseCode}</span>
              <h4 style={{ margin: '0.5rem 0' }}>{c.courseName}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Capacity: {c.enrollmentCapacity} Seats Max</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}