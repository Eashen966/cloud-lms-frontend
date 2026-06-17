import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function StudentDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollMsg, setEnrollMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allRes = await api.get('/courses');
      const enrolledRes = await api.get(`/courses/enrolled/${user.userId}`);
      
      const enrolledIds = enrolledRes.data.map(c => c.courseId);
      const available = allRes.data.filter(c => !enrolledIds.includes(c.courseId));
      
      setEnrolledCourses(enrolledRes.data);
      setAvailableCourses(available);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`, { studentId: user.userId });
      setEnrollMsg(`Successfully enrolled!`);
      setTimeout(() => setEnrollMsg(''), 3000);
      fetchData(); // refresh lists
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed.';
      setEnrollMsg(msg);
      setTimeout(() => setEnrollMsg(''), 3000);
    }
  };

  const filteredCourses = availableCourses.filter(c => 
    c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.instructor?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    layout: { minHeight: '100vh', backgroundColor: '#e5f6f4', fontFamily: "'Google Sans', Roboto, Arial, sans-serif" },
    nav: { backgroundColor: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', color: '#0f4c5c' },
    logoutBtn: { backgroundColor: 'transparent', border: '1px solid #0f4c5c', color: '#0f4c5c', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
    main: { maxWidth: '1100px', margin: '40px auto', padding: '0 20px' },
    title: { color: '#0f4c5c', borderBottom: '2px solid #a3d2ca', paddingBottom: '10px', marginBottom: '25px', fontSize: '20px', fontWeight: '500' },
    banner: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
    searchBar: { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1.5px solid #a3d2ca', fontSize: '15px', marginBottom: '30px', boxSizing: 'border-box' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' },
    cardContainer: { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #e0e0e0', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)', backgroundColor: '#fff', overflow: 'hidden' },
    cardHeader: { backgroundColor: '#14a790', padding: '20px', color: '#fff', cursor: 'pointer' },
    cardHeaderSecondary: { backgroundColor: '#0f4c5c', padding: '20px', color: '#fff' },
    cardBody: { padding: '20px', flex: 1, backgroundColor: '#fff' },
    cardActions: { borderTop: '1px solid #e0e0e0', padding: '10px 15px', backgroundColor: '#fff', display: 'flex', justifyContent: 'flex-end', gap: '8px' },
    actionBtn: { padding: '8px 12px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: '500' },
    joinBtn: { width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#14a790', border: '1px solid #14a790', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }
  };

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        {enrollMsg && <div style={styles.banner}>{enrollMsg}</div>}

        <h4 style={styles.title}>My Enrolled Courses</h4>
        <div style={styles.grid}>
          {enrolledCourses.map(c => (
            <div key={c.courseId} style={styles.cardContainer}>
              <div style={styles.cardHeader} onClick={() => navigate(`/course/${c.courseId}`)}>
                <div style={{ fontSize: '20px', fontWeight: '500', marginBottom: '5px' }}>{c.courseName}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>{c.courseCode}</div>
              </div>
              <div style={styles.cardBody}>
                <div style={{ fontSize: '13px', color: '#62929e', marginBottom: '10px' }}>Instructor: {c.instructor?.name || 'N/A'}</div>
                {c.syllabus && <div style={{ fontSize: '13px', color: '#62929e', fontStyle: 'italic' }}>{c.syllabus}</div>}
              </div>
              <div style={styles.cardActions}>
                <button style={{ ...styles.actionBtn, backgroundColor: 'transparent', color: '#14a790', border: '1px solid #14a790' }} onClick={() => navigate(`/course/${c.courseId}`)}>
                  Enter Workspace
                </button>
              </div>
            </div>
          ))}
          {enrolledCourses.length === 0 && <p style={{ color: '#62929e' }}>You haven't enrolled in any courses yet.</p>}
        </div>

        <h4 style={styles.title}>Available Learning Workspaces</h4>
        <input 
          type="text" 
          placeholder="Search courses by name, code, or instructor..." 
          style={styles.searchBar}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        
        <div style={styles.grid}>
          {filteredCourses.map(c => (
            <div key={c.courseId} style={styles.cardContainer}>
              <div style={styles.cardHeaderSecondary}>
                <div style={{ fontSize: '20px', fontWeight: '500', marginBottom: '5px' }}>{c.courseName}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>{c.courseCode}</div>
              </div>
              <div style={styles.cardBody}>
                <div style={{ fontSize: '13px', color: '#62929e', marginBottom: '10px' }}>Instructor: {c.instructor?.name || 'N/A'}</div>
                <div style={{ fontSize: '13px', color: '#62929e' }}>Capacity: {c.enrolledStudents?.length || 0} / {c.enrollmentCapacity}</div>
              </div>
              <div style={styles.cardActions}>
                <button onClick={() => handleEnroll(c.courseId)} style={styles.joinBtn}>
                  Enroll in Course
                </button>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && <p style={{ color: '#62929e' }}>No available courses match your search.</p>}
        </div>
      </main>
    </div>
  );
}