import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function InstructorDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    courseCode: '',
    description: '',
    syllabus: '',
    enrollmentCapacity: 30
  });
  const [editingCourse, setEditingCourse] = useState(null);
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
      await api.post('/courses', {
        courseName: newCourse.courseName,
        courseCode: newCourse.courseCode,
        description: newCourse.description,
        syllabus: newCourse.syllabus,
        enrollmentCapacity: parseInt(newCourse.enrollmentCapacity),
        instructor: { userId: user.userId }
      });
      setMsg({ type: 'success', text: 'Course created successfully!' });
      setNewCourse({ courseName: '', courseCode: '', description: '', syllabus: '', enrollmentCapacity: 30 });
      fetchCourses();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create course. Check if course code is unique.';
      setMsg({ type: 'error', text: errMsg });
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await api.put(`/courses/${editingCourse.courseId}?instructorId=${user.userId}`, editingCourse);
      setMsg({ type: 'success', text: 'Course updated successfully!' });
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update course.';
      setMsg({ type: 'error', text: errMsg });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${courseId}?instructorId=${user.userId}`);
        setMsg({ type: 'success', text: 'Course deleted successfully!' });
        fetchCourses();
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to delete course.';
        setMsg({ type: 'error', text: errMsg });
      }
    }
  };

  const styles = {
    layout: { minHeight: '100vh', backgroundColor: '#e5f6f4', fontFamily: "'Google Sans', Roboto, Arial, sans-serif" },
    nav: { backgroundColor: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', color: '#0f4c5c' },
    logoutBtn: { backgroundColor: 'transparent', border: '1px solid #0f4c5c', color: '#0f4c5c', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
    main: { maxWidth: '1100px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #e0e0e0', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)' },
    title: { color: '#0f4c5c', marginBottom: '20px', marginTop: 0, fontSize: '20px', fontWeight: '500' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f4c5c', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1.5px solid #a3d2ca', boxSizing: 'border-box', fontSize: '14px' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#14a790', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', marginTop: '10px' },
    actionBtn: { padding: '8px 12px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: '500' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    itemHeader: { backgroundColor: '#0f4c5c', padding: '20px', color: '#fff', cursor: 'pointer', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' },
    itemBody: { padding: '20px', backgroundColor: '#fff', flex: 1 },
    itemActions: { borderTop: '1px solid #e0e0e0', padding: '10px 15px', backgroundColor: '#fff', display: 'flex', justifyContent: 'flex-end', gap: '8px', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' },
    itemContainer: { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #e0e0e0', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)' },
    successBanner: { padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', color: '#2e7d32', backgroundColor: '#e8f5e9' },
    errorBanner: { padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', color: '#c62828', backgroundColor: '#ffebee' }
  };

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <section style={styles.card}>
          <h4 style={styles.title}>{editingCourse ? "Edit Course" : "Create New Course"}</h4>
          {msg.text && (
            <div style={msg.type === 'success' ? styles.successBanner : styles.errorBanner}>
              {msg.text}
            </div>
          )}

          {editingCourse ? (
            <form onSubmit={handleUpdateCourse}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Course Name</label>
                <input type="text" style={styles.input} required value={editingCourse.courseName}
                  onChange={e => setEditingCourse({ ...editingCourse, courseName: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Course Code</label>
                <input type="text" style={styles.input} required value={editingCourse.courseCode}
                  onChange={e => setEditingCourse({ ...editingCourse, courseCode: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }} value={editingCourse.description || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Syllabus</label>
                <textarea style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }} value={editingCourse.syllabus || ''}
                  placeholder="Week 1: Intro..."
                  onChange={e => setEditingCourse({ ...editingCourse, syllabus: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Enrollment Capacity</label>
                <input type="number" style={styles.input} required value={editingCourse.enrollmentCapacity}
                  min="1" max="200"
                  onChange={e => setEditingCourse({ ...editingCourse, enrollmentCapacity: e.target.value })} />
              </div>
              <button type="submit" style={styles.btn}>Save Changes</button>
              <button type="button" onClick={() => setEditingCourse(null)} style={{ ...styles.btn, backgroundColor: '#62929e', marginTop: '5px' }}>Cancel Edit</button>
            </form>
          ) : (
            <form onSubmit={handleCreateCourse}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Course Name</label>
                <input type="text" style={styles.input} required value={newCourse.courseName}
                  placeholder="e.g. System Architecture"
                  onChange={e => setNewCourse({ ...newCourse, courseName: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Course Code</label>
                <input type="text" style={styles.input} required value={newCourse.courseCode}
                  placeholder="e.g. CSF3103"
                  onChange={e => setNewCourse({ ...newCourse, courseCode: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }} value={newCourse.description}
                  placeholder="Brief course description"
                  onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Syllabus</label>
                <textarea style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }} value={newCourse.syllabus}
                  placeholder="Week 1: Intro..."
                  onChange={e => setNewCourse({ ...newCourse, syllabus: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Enrollment Capacity</label>
                <input type="number" style={styles.input} required value={newCourse.enrollmentCapacity}
                  min="1" max="200"
                  onChange={e => setNewCourse({ ...newCourse, enrollmentCapacity: e.target.value })} />
              </div>
              <button type="submit" style={styles.btn}>Deploy Course</button>
            </form>
          )}
        </section>

        <section>
          <div style={styles.grid}>
            {courses.map(c => (
              <div key={c.courseId} style={styles.itemContainer}>
                <div style={styles.itemHeader} onClick={() => navigate(`/course/${c.courseId}`)}>
                  <div style={{ fontSize: '20px', fontWeight: '500', marginBottom: '5px' }}>{c.courseName}</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>{c.courseCode}</div>
                </div>
                <div style={styles.itemBody}>
                  <div style={{ fontSize: '13px', color: '#62929e', marginBottom: '10px' }}>
                    Instructor: {c.instructor?.name || 'N/A'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#62929e' }}>
                    Capacity: {c.enrolledStudents?.length || 0} / {c.enrollmentCapacity}
                  </div>
                </div>
                <div style={styles.itemActions}>
                  <button style={{ ...styles.actionBtn, backgroundColor: '#14a790', color: '#fff' }} onClick={() => navigate(`/course/${c.courseId}`)}>View Course</button>
                  {c.instructor?.userId === user.userId && (
                    <>
                      <button style={{ ...styles.actionBtn, backgroundColor: 'transparent', color: '#0f4c5c', border: '1px solid #0f4c5c' }} onClick={() => { setEditingCourse(c); setMsg({ type: '', text: '' }); }}>Edit</button>
                      <button style={{ ...styles.actionBtn, backgroundColor: 'transparent', color: '#c62828' }} onClick={() => handleDeleteCourse(c.courseId)}>Delete</button>
                    </>
                  )}
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