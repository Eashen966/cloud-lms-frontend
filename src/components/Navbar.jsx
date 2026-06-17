import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isInstructor = user?.role === 'INSTRUCTOR';
  const dashboardPath = isInstructor ? '/instructor' : '/student';

  const styles = {
    navbar: {
      backgroundColor: '#0f4c5c',
      padding: '0 30px',
      height: '64px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    leftSec: { display: 'flex', alignItems: 'center', gap: '30px' },
    brand: { fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', margin: 0 },
    navLinks: { display: 'flex', gap: '20px' },
    link: (active) => ({
      color: active ? '#14a790' : '#e5f6f4',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: active ? '600' : '400',
      textDecoration: 'none',
      borderBottom: active ? '2px solid #14a790' : '2px solid transparent',
      padding: '21px 0' // to center in 64px height
    }),
    rightSec: { display: 'flex', alignItems: 'center', gap: '20px' },
    logoutBtn: {
      backgroundColor: 'transparent',
      border: '1px solid #14a790',
      color: '#14a790',
      padding: '6px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: '0.2s'
    }
  };

  const isDashboard = location.pathname === '/instructor' || location.pathname === '/student';
  const isCourse = location.pathname.includes('/course/');

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSec}>
        <h1 style={styles.brand} onClick={() => navigate(dashboardPath)}>
          Cloud LMS
        </h1>
      </div>
      
      <div style={styles.rightSec}>
        <span style={{ fontSize: '14px', opacity: 0.9 }}>
          {user?.name} {user?.role === 'STUDENT' && `(${user?.matricNo})`}
        </span>
        <button style={styles.logoutBtn} onClick={onLogout}>Log Out</button>
      </div>
    </nav>
  );
}
