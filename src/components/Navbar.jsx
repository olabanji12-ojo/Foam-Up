import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();   
  useEffect(() => {
    if (window.UIkit) {
      window.UIkit.update();
    }    
  }, []); 

  const handleLogout = () => {
    logout(); // This should clear user data and redirect
    // You might also want to clear localStorage
    navigate("/Login")
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const closeOffcanvas = () => {
    if (window.UIkit && window.UIkit.offcanvas) {
      window.UIkit.offcanvas('#offcanvas-nav').hide();
    }
  };

  return (
    <>
      <nav
        className="uk-navbar-container"
        style={{ 
          backgroundColor: '#1e293b', 
          padding: '15px 0',
          borderBottom: '1px solid #334155',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <div className="uk-navbar" uk-navbar="true">
            <div className="uk-navbar-left">
              <Link to="/" className="uk-navbar-item" style={{ paddingLeft: '0' }}>
                <h1
                  style={{
                    fontWeight: '800',
                    fontSize: '1.8rem',
                    margin: '0',
                    fontFamily: 'Arial, sans-serif',
                    letterSpacing: '-0.5px',
                    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(96, 165, 250, 0.5)'
                  }}
                >
                  <span>Foam</span>
                  <span style={{ color: '#10b981' }}>UP</span>
                </h1>
              </Link> 
            </div>

            {/* Mobile Toggle Button */}
            <div className="uk-navbar-right uk-hidden@s">
              <a 
                className="uk-navbar-toggle" 
                uk-navbar-toggle-icon="true"
                href="#offcanvas-nav" 
                uk-toggle="target: #offcanvas-nav"
                aria-label="Open navigation menu"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '45px',
                  height: '45px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span></span>
              </a>
            </div>
          
            {/* Desktop Navigation */}
            <div className="uk-navbar-right uk-visible@s">
              <ul className="uk-navbar-nav" style={{ gap: '8px' }}>
                {isAuthenticated ? (
                  // Show these links when user is logged in
                  <>
                    <li>
                      <Link 
                        to="/Customer_dashboard" 
                        style={{ 
                          color: '#e2e8f0', 
                          fontWeight: '600',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                          e.currentTarget.style.color = '#60a5fa';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span data-uk-icon="icon: home"></span>
                        Home
                      </Link>
                    </li>
 
                    <li>
                      <Link 
                        to="/favourites" 
                        style={{ 
                          color: '#e2e8f0', 
                          fontWeight: '600',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.1)';
                          e.currentTarget.style.color = '#ec4899';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span data-uk-icon="icon: heart"></span>
                        Favourites
                      </Link>
                    </li>

                    <li>
                      <Link 
                        to="/bookings" 
                        style={{ 
                          color: '#e2e8f0', 
                          fontWeight: '600',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                          e.currentTarget.style.color = '#10b981';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span data-uk-icon="icon: calendar"></span>
                        Bookings
                      </Link>
                    </li>

                    <li> 
                      <Link 
                        to={`/Profile/${user.id}`} 
                        style={{ 
                          color: '#e2e8f0',  
                          fontWeight: '600',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                          e.currentTarget.style.color = '#f59e0b';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span data-uk-icon="icon: user"></span>
                        Profile
                      </Link>
                    </li>
                    
                    <li>
                      <button 
                        onClick={handleLogout}
                        style={{ 
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                          border: 'none', 
                          color: 'white', 
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: 'inherit',
                          fontFamily: 'inherit',
                          padding: '10px 18px',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                        }}
                      >
                        <span data-uk-icon="icon: sign-out"></span>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  // Show these links when user is NOT logged in
                  <>
                    <li>
                      <Link 
                        to="/" 
                        style={{ 
                          color: '#e2e8f0', 
                          fontWeight: '600',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                          e.currentTarget.style.color = '#60a5fa';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/Login" 
                        style={{ 
                          color: '#e2e8f0', 
                          fontWeight: '600',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                          e.currentTarget.style.color = '#10b981';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/signup" 
                        style={{ 
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          color: 'white',
                          fontWeight: '600',
                          padding: '10px 20px',
                          borderRadius: '12px',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                        }}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    
      {/* Mobile Off-canvas Navigation */}
      <div id="offcanvas-nav" uk-offcanvas="overlay: true; mode: slide">
        <div 
          className="uk-offcanvas-bar" 
          style={{ 
            backgroundColor: '#1e293b',
            borderRight: '1px solid #334155'
          }}
        >
          <button 
            className="uk-offcanvas-close" 
            type="button" 
            uk-close="true" 
            aria-label="Close navigation menu"
            style={{ 
              color: '#e2e8f0',
              fontSize: '1.5rem'
            }}
          ></button>

          <div style={{ marginTop: '40px' }}>
            {/* Brand in mobile menu */}
            <div style={{ marginBottom: '30px', paddingLeft: '20px' }}>
              <h2
                style={{
                  fontWeight: '800',
                  fontSize: '1.5rem',
                  margin: '0',
                  fontFamily: 'Arial, sans-serif',
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                <span>Foam</span>
                <span style={{ color: '#10b981' }}>UP</span>
              </h2>
            </div>

            <ul className="uk-nav uk-nav-default">
              {isAuthenticated ? (
                // Mobile menu for logged in users
                <>
                  <li>
                    <Link 
                      to="/Customer_dashboard" 
                      onClick={closeOffcanvas}
                      style={{ 
                        fontSize: '18px', 
                        padding: '15px 20px',
                        color: '#e2e8f0',
                        borderRadius: '8px',
                        margin: '0 10px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        e.currentTarget.style.color = '#60a5fa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#e2e8f0';
                      }}
                    >
                      <span data-uk-icon="icon: home"></span>
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link 
                      to="/favourites" 
                      onClick={closeOffcanvas}
                      style={{ 
                        fontSize: '18px', 
                        padding: '15px 20px',
                        color: '#e2e8f0',
                        borderRadius: '8px',
                        margin: '0 10px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.1)';
                        e.currentTarget.style.color = '#ec4899';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#e2e8f0';
                      }}
                    >
                      <span data-uk-icon="icon: heart"></span>
                      Favourites
                    </Link>
                  </li>

                  <li>
                    <Link 
                      to="/bookings" 
                      onClick={closeOffcanvas}
                      style={{ 
                        fontSize: '18px', 
                        padding: '15px 20px',
                        color: '#e2e8f0',
                        borderRadius: '8px',
                        margin: '0 10px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                        e.currentTarget.style.color = '#10b981';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#e2e8f0';
                      }}
                    >
                      <span data-uk-icon="icon: calendar"></span>
                      Bookings
                    </Link>
                  </li>

                  <li>
                    <Link 
                      to="/profile" 
                      onClick={closeOffcanvas}
                      style={{ 
                        fontSize: '18px', 
                        padding: '15px 20px',
                        color: '#e2e8f0',
                        borderRadius: '8px',
                        margin: '0 10px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                        e.currentTarget.style.color = '#f59e0b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#e2e8f0';
                      }}
                    >
                      <span data-uk-icon="icon: user"></span>
                      Profile
                    </Link>
                  </li>

                  <li style={{ marginTop: '20px' }}>
                    <button 
                      onClick={() => {
                        handleLogout();
                        closeOffcanvas();
                      }}
                      style={{ 
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                        border: 'none', 
                        fontSize: '18px', 
                        padding: '15px 20px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: 'calc(100% - 20px)',
                        margin: '0 10px',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span data-uk-icon="icon: sign-out"></span>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                // Mobile menu for guests
                <>
                  <li>
                    <Link 
                      to="/" 
                      onClick={closeOffcanvas}
                      style={{ 
                        fontSize: '18px', 
                        padding: '15px 20px',
                        color: '#e2e8f0',
                        borderRadius: '8px',
                        margin: '0 10px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        e.currentTarget.style.color = '#60a5fa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#e2e8f0';
                      }}
                    >
                      <span data-uk-icon="icon: home"></span>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/Login" 
                      onClick={closeOffcanvas}
                      style={{ 
                        fontSize: '18px', 
                        padding: '15px 20px',
                        color: '#e2e8f0',
                        borderRadius: '8px',
                        margin: '0 10px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                        e.currentTarget.style.color = '#10b981';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#e2e8f0';
                      }}
                    >
                      <span data-uk-icon="icon: sign-in"></span>
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/signup" 
                      onClick={closeOffcanvas}
                      style={{ 
                        fontSize: '18px', 
                        padding: '15px 20px',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: 'white',
                        borderRadius: '8px',
                        margin: '0 10px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span data-uk-icon="icon: user"></span>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};


export default Navbar; 