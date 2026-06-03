import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [matricNo, setMatricNo] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [programme, setProgramme] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [message, setMessage] = useState({ text: '', isError: false });

  // Handle Login Flow connecting to our secure controller
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });
    try {
      const response = await api.post('/users/login', { matricNo, password });
      onLoginSuccess(response.data); // Passes User Object back to App.jsx state
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Invalid Matric Number or Password.', 
        isError: true 
      });
    }
  };

  // Handle Registration Flow with password hashing payload
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });
    try {
      const payload = { name, email, passwordHash: password, matricNo, programme, role };
      await api.post('/users/register', payload);
      setMessage({ text: 'Registration successful! You can log in now.', isError: false });
      setIsRegistering(false); // Snap back to login view
      setPassword('');
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Registration failed.', 
        isError: true 
      });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ background: 'var(--pure-white)', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 8px 24px rgba(255,107,139,0.15)', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary-pink)', marginBottom: '0.5rem' }}>CloudLMS</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>TaskBuddy Learning Workspace</p>
        
        {message.text && (
          <p style={{ color: message.isError ? '#d94663' : '#2ecc71', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
            {message.text}
          </p>
        )}

        {!isRegistering ? (
          /* SECURE LOGIN FORM */
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Matric Number / Staff ID</label>
              <input 
                type="text" required value={matricNo} onChange={(e) => setMatricNo(e.target.value)} placeholder="e.g. S76773" 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #ffd1dc', outline: 'none' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Password</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #ffd1dc', outline: 'none' }}
              />
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '0.9rem', background: 'var(--primary-pink)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>
              Enter Workspace
            </button>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              New here? <span onClick={() => { setIsRegistering(true); setMessage({text:'', isError:false}); }} style={{ color: 'var(--primary-pink)', cursor: 'pointer', fontWeight: 'bold' }}>Register Account</span>
            </p>
          </form>
        ) : (
          /* EXPANDED THESIS COMPLIANT REGISTRATION FORM */
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '0.8rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '2px solid #ffd1dc', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '0.8rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '2px solid #ffd1dc', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '0.8rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create secure password" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '2px solid #ffd1dc', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '0.8rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Matric No / ID</label>
              <input type="text" required value={matricNo} onChange={(e) => setMatricNo(e.target.value)} placeholder="e.g. S76773" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '2px solid #ffd1dc', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '0.8rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Programme</label>
              <input type="text" required value={programme} onChange={(e) => setProgramme(e.target.value)} placeholder="e.g. Computer Science" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '2px solid #ffd1dc', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Account Type</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '2px solid #ffd1dc', background: 'white', outline: 'none' }}>
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
              </select>
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '0.9rem', background: 'var(--primary-pink)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>
              Create Account
            </button>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Already registered? <span onClick={() => { setIsRegistering(false); setMessage({text:'', isError:false}); }} style={{ color: 'var(--primary-pink)', cursor: 'pointer', fontWeight: 'bold' }}>Log In</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}