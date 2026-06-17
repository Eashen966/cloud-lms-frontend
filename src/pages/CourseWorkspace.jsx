import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CourseWorkspace({ user, onLogout }) {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [instructorSubmissions, setInstructorSubmissions] = useState([]); // for viewing submissions as instructor
  const [activeTab, setActiveTab] = useState('CONTENT'); // CONTENT or ASSIGNMENTS
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Forms
  const [showContentForm, setShowContentForm] = useState(false);
  const [newContent, setNewContent] = useState({ title: '', contentType: 'LECTURE_NOTE', urlLink: '' });

  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', maxScore: 100 });

  const [submissionUrl, setSubmissionUrl] = useState('');
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);

  // Instructor Grading
  const [gradeData, setGradeData] = useState({ grade: 0, feedback: '' });

  useEffect(() => {
    fetchCourseDetails();
    fetchContents();
    fetchAssignments();
    if (user.role === 'STUDENT') {
      fetchStudentSubmissions();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      // Temporarily fetching from /courses and finding the one since we didn't add a GET /courses/{id} backend endpoint
      const res = await api.get('/courses');
      const found = res.data.find(c => c.courseId === parseInt(courseId));
      if (found) setCourse(found);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchContents = async () => {
    try {
      const res = await api.get(`/contents/course/${courseId}`);
      setContents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get(`/assignments/course/${courseId}`);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentSubmissions = async () => {
    try {
      const res = await api.get(`/submissions/student/${user.userId}`);
      setStudentSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissionsForAssignment = async (assignmentId) => {
    try {
      const res = await api.get(`/submissions/assignment/${assignmentId}`);
      setInstructorSubmissions(res.data);
      setActiveAssignmentId(assignmentId);
    } catch (err) {
      console.error(err);
    }
  };

  // ---- Handlers ----
  const handleUploadContent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contents', { ...newContent, course: { courseId: parseInt(courseId) } });
      setMsg({ type: 'success', text: 'Content uploaded successfully' });
      setShowContentForm(false);
      setNewContent({ title: '', contentType: 'LECTURE_NOTE', urlLink: '' });
      fetchContents();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to upload content' });
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments', { ...newAssignment, course: { courseId: parseInt(courseId) } });
      setMsg({ type: 'success', text: 'Assignment created successfully' });
      setShowAssignmentForm(false);
      setNewAssignment({ title: '', description: '', dueDate: '', maxScore: 100 });
      fetchAssignments();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to create assignment' });
    }
  };

  const handleSubmitAssignment = async (e, assignmentId) => {
    e.preventDefault();
    try {
      await api.post('/submissions', {
        assignment: { assignmentId },
        student: { userId: user.userId },
        fileUrl: submissionUrl,
        status: 'SUBMITTED'
      });
      setMsg({ type: 'success', text: 'Assignment submitted successfully' });
      setSubmissionUrl('');
      setActiveAssignmentId(null);
      fetchStudentSubmissions();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to submit assignment' });
    }
  };

  const handleGradeSubmission = async (e, submissionId) => {
    e.preventDefault();
    try {
      await api.put(`/submissions/${submissionId}/grade`, {
        grade: parseInt(gradeData.grade),
        feedback: gradeData.feedback
      });
      setMsg({ type: 'success', text: 'Graded successfully' });
      setGradeData({ grade: 0, feedback: '' });
      fetchSubmissionsForAssignment(activeAssignmentId);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to grade submission' });
    }
  };

  const styles = {
    layout: { minHeight: '100vh', backgroundColor: '#e5f6f4', fontFamily: "'Google Sans', Roboto, Arial, sans-serif" },
    nav: { backgroundColor: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', color: '#0f4c5c' },
    btnLayout: { display: 'flex', gap: '10px' },
    navBtn: { backgroundColor: 'transparent', border: '1px solid #0f4c5c', color: '#0f4c5c', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
    main: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
    headerCard: { backgroundColor: '#0f4c5c', padding: '50px 40px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px', color: '#fff', position: 'relative', overflow: 'hidden' },
    tabs: { display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #e0e0e0' },
    tab: (active) => ({ padding: '15px 20px', cursor: 'pointer', borderBottom: active ? '3px solid #14a790' : '3px solid transparent', fontWeight: active ? '600' : '500', color: active ? '#14a790' : '#62929e', transition: '0.2s' }),
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e0e0e0', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)', display: 'flex', flexDirection: 'column' },
    btn: { padding: '10px 20px', backgroundColor: '#14a790', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', marginTop: '10px' },
    input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0', boxSizing: 'border-box', fontSize: '14px', marginBottom: '15px', backgroundColor: '#f1f3f4' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f4c5c', marginBottom: '5px' },
    banner: { padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', textAlign: 'center', backgroundColor: msg.type === 'success' ? '#e8f5e9' : '#ffebee', color: msg.type === 'success' ? '#2e7d32' : '#c62828', fontWeight: '500' }
  };

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        {course && (
          <div style={styles.headerCard}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '36px', fontWeight: '500' }}>{course.courseName}</h1>
            <div style={{ fontSize: '18px', opacity: 0.9 }}>{course.courseCode}</div>
            <p style={{ margin: '20px 0 0 0', opacity: 0.8 }}>Instructor: {course.instructor?.name}</p>
            {course.description && <p style={{ marginTop: '10px', fontStyle: 'italic', opacity: 0.9 }}>{course.description}</p>}
          </div>
        )}

        {msg.text && <div style={styles.banner}>{msg.text}</div>}

        <div style={styles.tabs}>
          <div style={styles.tab(activeTab === 'CONTENT')} onClick={() => setActiveTab('CONTENT')}>Course Content</div>
          <div style={styles.tab(activeTab === 'ASSIGNMENTS')} onClick={() => setActiveTab('ASSIGNMENTS')}>Assignments</div>
        </div>

        {activeTab === 'CONTENT' && (
          <div>
            {user.role === 'INSTRUCTOR' && (
              <div style={{ marginBottom: '20px' }}>
                <button style={styles.btn} onClick={() => setShowContentForm(!showContentForm)}>
                  {showContentForm ? 'Cancel' : '+ Add Content'}
                </button>
                {showContentForm && (
                  <form onSubmit={handleUploadContent} style={{ ...styles.card, marginTop: '15px', backgroundColor: '#f0fdfa' }}>
                    <label style={styles.label}>Title</label>
                    <input style={styles.input} required value={newContent.title} onChange={e => setNewContent({ ...newContent, title: e.target.value })} />
                    <label style={styles.label}>Type</label>
                    <select style={styles.input} value={newContent.contentType} onChange={e => setNewContent({ ...newContent, contentType: e.target.value })}>
                      <option value="LECTURE_NOTE">Lecture Note</option>
                      <option value="VIDEO_LINK">Video Link</option>
                      <option value="SYLLABUS">Syllabus</option>
                    </select>
                    <label style={styles.label}>URL Link</label>
                    <input style={styles.input} type="url" required value={newContent.urlLink} onChange={e => setNewContent({ ...newContent, urlLink: e.target.value })} placeholder="https://..." />
                    <button type="submit" style={styles.btn}>Post Content</button>
                  </form>
                )}
              </div>
            )}
            {contents.map(c => (
              <div key={c.contentId} style={{ ...styles.card, flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                <div style={{ backgroundColor: '#14a790', color: '#fff', padding: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
                  {c.contentType === 'VIDEO_LINK' ? '▶' : '📄'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#0f4c5c', fontWeight: '500' }}>{c.title}</h3>
                  <span style={{ fontSize: '12px', color: '#62929e', textTransform: 'uppercase' }}>{c.contentType.replace('_', ' ')}</span>
                </div>
                <a href={c.urlLink} target="_blank" rel="noreferrer" style={{ color: '#14a790', fontWeight: '500', textDecoration: 'none', padding: '10px 15px', border: '1px solid #e0e0e0', borderRadius: '6px' }}>
                  Open Link
                </a>
              </div>
            ))}
            {contents.length === 0 && <p style={{ color: '#62929e' }}>No content posted yet.</p>}
          </div>
        )}

        {activeTab === 'ASSIGNMENTS' && (
          <div>
            {user.role === 'INSTRUCTOR' && (
              <div style={{ marginBottom: '20px' }}>
                <button style={styles.btn} onClick={() => setShowAssignmentForm(!showAssignmentForm)}>
                  {showAssignmentForm ? 'Cancel' : '+ Create Assignment'}
                </button>
                {showAssignmentForm && (
                  <form onSubmit={handleCreateAssignment} style={{ ...styles.card, marginTop: '15px', backgroundColor: '#f0fdfa' }}>
                    <label style={styles.label}>Title</label>
                    <input style={styles.input} required value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                    <label style={styles.label}>Description</label>
                    <textarea style={styles.input} required value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} />
                    <label style={styles.label}>Due Date</label>
                    <input type="datetime-local" style={styles.input} required value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
                    <label style={styles.label}>Max Score</label>
                    <input type="number" style={styles.input} required value={newAssignment.maxScore} onChange={e => setNewAssignment({ ...newAssignment, maxScore: e.target.value })} />
                    <button type="submit" style={styles.btn}>Create Assignment</button>
                  </form>
                )}
              </div>
            )}
            
            {assignments.map(a => {
              const studentSub = studentSubmissions.find(s => s.assignment?.assignmentId === a.assignmentId);
              
              return (
                <div key={a.assignmentId} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#0f4c5c' }}>{a.title}</h3>
                    <span style={{ fontSize: '13px', color: '#62929e', fontWeight: 'bold' }}>Max Score: {a.maxScore}</span>
                  </div>
                  <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#333' }}>{a.description}</p>
                  <div style={{ fontSize: '13px', color: '#c62828', marginBottom: '15px' }}>
                    ⏰ Due: {new Date(a.dueDate).toLocaleString()}
                  </div>

                  {user.role === 'STUDENT' && (
                    <div style={{ padding: '15px', backgroundColor: studentSub ? '#e8f5e9' : '#f5f5f5', borderRadius: '8px' }}>
                      {studentSub ? (
                        <div>
                          <p style={{ margin: '0 0 5px 0', color: '#2e7d32', fontWeight: 'bold' }}>✓ Submitted on {new Date(studentSub.submissionDate).toLocaleString()}</p>
                          <a href={studentSub.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#0f4c5c' }}>View Submitted File</a>
                          {studentSub.grade !== null && (
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #a3d2ca' }}>
                              <strong style={{ color: '#0f4c5c' }}>Grade: {studentSub.grade} / {a.maxScore}</strong>
                              {studentSub.feedback && <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>Feedback: {studentSub.feedback}</p>}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {activeAssignmentId === a.assignmentId ? (
                            <form onSubmit={(e) => handleSubmitAssignment(e, a.assignmentId)}>
                              <label style={styles.label}>Submission URL (Google Drive / GitHub Link)</label>
                              <input style={styles.input} type="url" required placeholder="https://..." value={submissionUrl} onChange={e => setSubmissionUrl(e.target.value)} />
                              <button type="submit" style={styles.btn}>Submit</button>
                              <button type="button" onClick={() => setActiveAssignmentId(null)} style={{ ...styles.btn, backgroundColor: '#62929e', marginLeft: '10px' }}>Cancel</button>
                            </form>
                          ) : (
                            <button style={styles.btn} onClick={() => setActiveAssignmentId(a.assignmentId)}>Add Submission</button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {user.role === 'INSTRUCTOR' && (
                    <div style={{ marginTop: '15px' }}>
                      <button style={{ ...styles.btn, backgroundColor: '#0f4c5c' }} onClick={() => fetchSubmissionsForAssignment(a.assignmentId)}>
                        View Submissions
                      </button>
                      
                      {activeAssignmentId === a.assignmentId && (
                        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f0fdfa', borderRadius: '8px' }}>
                          <h4 style={{ margin: '0 0 10px 0' }}>Submissions ({instructorSubmissions.length})</h4>
                          {instructorSubmissions.map(sub => (
                            <div key={sub.submissionId} style={{ padding: '10px', backgroundColor: '#fff', marginBottom: '10px', borderRadius: '6px' }}>
                              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{sub.student?.name} ({sub.student?.matricNo})</p>
                              <a href={sub.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#14a790' }}>View Work 🔗</a>
                              <div style={{ marginTop: '10px' }}>
                                {sub.grade !== null ? (
                                  <div style={{ fontSize: '13px', color: '#2e7d32', fontWeight: 'bold' }}>
                                    Graded: {sub.grade} / {a.maxScore} <br />
                                    <span style={{ fontWeight: 'normal', color: '#62929e' }}>{sub.feedback}</span>
                                  </div>
                                ) : (
                                  <form onSubmit={(e) => handleGradeSubmission(e, sub.submissionId)} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <div>
                                      <input type="number" style={{...styles.input, marginBottom: 0, width: '80px'}} required placeholder="Score" max={a.maxScore} min={0} onChange={e => setGradeData({...gradeData, grade: e.target.value})} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <input type="text" style={{...styles.input, marginBottom: 0}} placeholder="Feedback..." onChange={e => setGradeData({...gradeData, feedback: e.target.value})} />
                                    </div>
                                    <button type="submit" style={{...styles.btn, marginTop: 0}}>Grade</button>
                                  </form>
                                )}
                              </div>
                            </div>
                          ))}
                          {instructorSubmissions.length === 0 && <p style={{ fontSize: '13px', color: '#62929e' }}>No submissions yet.</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {assignments.length === 0 && <p style={{ color: '#62929e' }}>No assignments created yet.</p>}
          </div>
        )}
      </main>
    </div>
  );
}
