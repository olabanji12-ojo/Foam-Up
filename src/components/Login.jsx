import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { baseURL } from '../utils/environments';

const Login = () => {
  const { login, user, isAuthenticated } = useAuth(); // Get auth status
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check where to redirect based on user type
      if (user.account_type === 'car_owner' && user.role === 'car_owner') {
        navigate('/Customer_dashboard', { replace: true });
      } else {
        // Redirect to appropriate dashboard based on user type
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(baseURL+'/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }

      const response = await res.json(); 
      console.log('Logged in successfully:', response);

      // Extract the token and user data from the response
      const token = response.data.token;
      const userData = response.data.user;
      
      if (token && userData) {
        // Pass both user data and token to the login function
        login(userData, token);
      } else {
        throw new Error('Missing token or user data in response');
      }

      // Check account_type and role from the actual user data
      if (userData && userData.account_type === 'car_owner' && userData.role === 'car_owner') {
        navigate('/Customer_dashboard');
      } else {
        // Log what we actually received to help debug
        console.log('User data received:', userData);
        console.log('account_type:', userData?.account_type);
        console.log('role:', userData?.role);
        setError('Access denied: not a car owner.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isAuthenticated === undefined) {
    return (
      <div className="uk-section uk-flex uk-flex-center uk-flex-middle" style={{ minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="uk-section uk-flex uk-flex-top" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '80px 0 40px 0'
    }}>
      <div className="uk-width-1-1">
        <div style={{ 
          maxWidth: '480px', 
          margin: '0 auto',
          padding: '0 20px'
        }}>  
          
          {/* Title */}
          <h2 className="uk-text-center" style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#333',
            margin: '0 0 1.5rem 0',
            fontFamily: 'Arial, sans-serif'
          }}>
            Welcome back
          </h2>

          {/* Error Message */}
          {error && (
            <p style={{ 
              color: 'red', 
              marginBottom: '1rem',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {error}
            </p>
          )}

          {/* Form */}
          <form className="uk-form-stacked" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="uk-margin-bottom">
              <div className="uk-form-controls">
                <input 
                  className="uk-input" 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email address*" 
                  required 
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    height: '56px',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="uk-margin-bottom">
              <div className="uk-form-controls">
                <input 
                  className="uk-input" 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="password*" 
                  required 
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    height: '56px',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="uk-text-right uk-margin-bottom">
              <Link to="/forgot-password" style={{ 
                color: '#7CB342', 
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif'
              }}>
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <div className="uk-margin-bottom">
              <button 
                className="uk-button uk-width-1-1" 
                type="submit"
                disabled={loading}
                style={{ 
                  backgroundColor: '#A8D5AA', 
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '18px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  height: '56px',
                  fontFamily: 'Arial, sans-serif',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Don't have account */}
          <p className="uk-text-center" style={{
            color: '#666',
            fontSize: '15px',
            fontFamily: 'Arial, sans-serif',
            margin: '1rem 0'
          }}>
            Don't have an account? <Link to="/signup" style={{ color: '#7CB342', textDecoration: 'none' }}>Sign up</Link>
          </p>

          {/* Continue with text */}
          <p className="uk-text-center" style={{
            color: '#999',
            fontSize: '15px',
            fontFamily: 'Arial, sans-serif',
            margin: '0 0 1rem 0'
          }}>
            or continue with
          </p>

          {/* Social Login Buttons */}
          <div className="uk-grid-small uk-child-width-1-2" uk-grid="true">
            <div>
              <button className="uk-button uk-width-1-1" style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px 12px',
                backgroundColor: '#fff',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '15px',
                fontFamily: 'Arial, sans-serif',
                height: '56px',
                cursor: 'pointer'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>
            <div>
              <button className="uk-button uk-width-1-1" style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px 12px',
                backgroundColor: '#fff',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '15px',
                fontFamily: 'Arial, sans-serif',
                height: '56px',
                cursor: 'pointer'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;