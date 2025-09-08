import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ 
      paddingLeft: '20px',
      paddingRight: '20px', 
      backgroundColor: '#f5f5f5',
      height: 'calc(100vh - 60px)', // Adjust for navbar height
      width: '250px',
      position: 'fixed',
      top: '60px', // Push it down below navbar
      left: 0,
      overflowY: 'auto' // Optional: makes sidebar scrollable if content is long
    }}>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '40px' }}>
        <li style={{ marginBottom: '20px' }}>
          <Link 
            to="/Customer_dashboard" 
            style={{ fontSize: '18px', textDecoration: 'none', color: '#333' }}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/other-page" 
            style={{ fontSize: '18px', textDecoration: 'none', color: '#333' }}
          >
            Other Page
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
