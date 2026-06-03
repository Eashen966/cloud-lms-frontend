import React, { useState } from 'react';
import api from '../services/api';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    matricNo: '',
    programme: '',
    password: '',
    role: 'STUDENT'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const payload = {
          matricNo: formData.matricNo,
          password: formData.password
        };
        const response = await api.post('/users/login', payload);
        localStorage.setItem('user', JSON.stringify(response.data));
        setSuccessMsg('Access granted! Entering workspace...');

        // FIX: call onLoginSuccess to update App state instead of just redirecting
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(response.data);
        }, 1000);

      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          matricNo: formData.matricNo,
          programme: formData.programme,
          passwordHash: formData.password,  // FIX: matches User model field name
          role: formData.role               // FIX: sends STUDENT or INSTRUCTOR
        };
        await api.post('/users/register', payload);
        setSuccessMsg('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      console.error('API Error:', err);
      if (err.response && err.response.data) {
        const msg = err.response.data.message || err.response.data;
        setErrorMsg(typeof msg === 'string' ? msg : 'Request failed. Verify credentials.');
      } else {
        setErrorMsg(isLogin ? 'Authentication failed. Server unreachable.' : 'Registration failed. Check network or duplicate entry.');
      }
    }
  };

  const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5f6f4', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", padding: '20px' },
    card: { backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(15, 76, 92, 0.1)', width: '100%', maxWidth: '420px', textAlign: 'center' },
    title: { color: '#0f4c5c', fontSize: '28px', fontWeight: '700', marginBottom: '6px', letterSpacing: '-0.5px' },
    subtitle: { color: '#62929e', fontSize: '14px', marginBottom: '30px', fontWeight: '500' },
    formGroup: { marginBottom: '20px', textAlign: 'left' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f4c5c', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #a3d2ca', fontSize: '14px', color: '#0f4c5c', boxSizing: 'border-box', outline: 'none' },
    select: { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #a3d2ca', fontSize: '14px', color: '#0f4c5c', backgroundColor: '#ffffff', boxSizing: 'border-box' },
    submitBtn: { width: '100%', padding: '14px', backgroundColor: '#14a790', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
    toggleText: { marginTop: '25px', fontSize: '13px', color: '#62929e' },
    toggleLink: { color: '#14a790', fontWeight: '600', cursor: 'pointer', marginLeft: '5px' },
    errorBanner: { backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', fontWeight: '500', textAlign: 'left' },
    successBanner: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', fontWeight: '500', textAlign: 'left' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Cloud LMS</h1>
        <div style={styles.subtitle}>Cloud Native Learning Management System</div>

        {errorMsg && <div style={styles.errorBanner}>⚠️ {errorMsg}</div>}
        {successMsg && <div style={styles.successBanner}>✓ {successMsg}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input type="text" name="name" required style={styles.input} value={formData.name} onChange={handleInputChange} placeholder="Enter full name" />
            </div>
          )}

          {!isLogin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" name="email" required style={styles.input} value={formData.email} onChange={handleInputChange} placeholder="e.g. student@university.edu" />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Matric Number / Staff ID</label>
            <input type="text" name="matricNo" required style={styles.input} value={formData.matricNo} onChange={handleInputChange} placeholder="e.g. s12345" />
          </div>

          {!isLogin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Academic Programme</label>
              <input type="text" name="programme" required style={styles.input} value={formData.programme} onChange={handleInputChange} placeholder="e.g. Computer Science" />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" required style={styles.input} value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
          </div>

          {!isLogin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Account Workspace Type</label>
              <select name="role" style={styles.select} value={formData.role} onChange={handleInputChange}>
                <option value="STUDENT">Student Space</option>
                <option value="INSTRUCTOR">Instructor Console</option>
              </select>
            </div>
          )}

          <button type="submit" style={styles.submitBtn}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0f8b77'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#14a790'}>
            {isLogin ? 'Enter Workspace' : 'Create Account'}
          </button>
        </form>

        <div style={styles.toggleText}>
          {isLogin ? "New to Cloud LMS?" : "Already registered?"}
          <span style={styles.toggleLink} onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); setSuccessMsg(''); }}>
            {isLogin ? 'Register Account' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
}