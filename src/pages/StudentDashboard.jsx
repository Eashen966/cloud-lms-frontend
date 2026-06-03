import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function StudentDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) { console.error(err); }
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`, { studentId: user.userId });
      alert('Successfully enrolled in the workspace!');
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light-pink)' }}>
      {/* Navbar */}
      <div style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: 'var(--primary-pink)', margin: 0 }}>CloudLMS (Student Workspace)</h2>
        <div>
          <span style={{ marginRight: '1rem', fontWeight: '500' }}>{user.name} ({user.matricNo})</span>
          <button onClick={onLogout} style={{ background: 'var(--primary-pink)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>Log Out</button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
        <h3 style={{ color: 'var(--text-dark)' }}>Available Courses for Enrollment</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
          {courses.map((c) => {
            const isEnrolled = c.enrolledStudents?.some(s => s.userId === user.userId);
            return (
              <div key={c.courseId} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ background: 'var(--light-pink)', color: 'var(--dark-pink)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{c.courseCode}</span>
                  <h4 style={{ margin: '0.5rem 0 0.2rem 0' }}>{c.courseName}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instructor: {c.instructor ? c.instructor.name : 'TBA'}</p>
                </div>
                <button 
                  onClick={() => !isEnrolled && handleEnroll(c.courseId)}
                  disabled={isEnrolled}
                  style={{ padding: '0.6rem 1.2rem', background: isEnrolled ? '#2ecc71' : 'var(--primary-pink)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isEnrolled ? 'default' : 'pointer' }}
                >
                  {isEnrolled ? 'Enrolled' : 'Join'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}