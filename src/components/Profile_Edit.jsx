import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UIkit from 'uikit';

const ProfileEdit = () => {
  const { user: authUser, token, loading: authLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    // account_type: '',
    // role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !authUser?.id) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        UIkit.notification({
          message: 'Failed to load profile data',
          status: 'danger',
          pos: 'top-center'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token, authLoading, authUser?.id]);

  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
    }
  }, [authLoading, authUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.put(`http://localhost:8080/api/user/${id}`, profile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      UIkit.notification({
        message: 'Profile updated successfully!',
        status: 'success',
        pos: 'top-center'
      });
      navigate(`/profile/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      UIkit.notification({
        message: 'Failed to update profile',
        status: 'danger',
        pos: 'top-center'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="uk-card uk-card-body uk-text-center" style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#f1f5f9' }}>Loading profile...</h3>
          <span uk-spinner="ratio: 1.5" style={{ color: '#10b981' }}></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="uk-card uk-card-body uk-text-center" style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#f1f5f9' }}>Error Loading Profile</h3>
          <p style={{ color: '#ef4444' }}>{error}</p>
          <button 
            className="uk-button uk-button-default"
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '20px',
              borderColor: '#64748b',
              color: '#94a3b8'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23' }}>
      {/* Hero Section */}
      <div className="uk-section uk-section-primary" 
           style={{ 
             background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
             padding: '60px 0'
           }}>
        <div className="uk-container">
          <h1 className="uk-heading-medium uk-text-white uk-text-center">
            Edit Profile
          </h1>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="uk-section" style={{ backgroundColor: '#0f0f23' }}>
        <div className="uk-container uk-container-small">
          <div className="uk-card uk-card-default uk-card-body" 
               style={{ 
                 backgroundColor: '#1e293b',
                 borderRadius: '16px',
                 border: '1px solid #334155'
               }}>
            <form onSubmit={handleSubmit}>
              <fieldset className="uk-fieldset">
                <div className="uk-margin">
                  <label className="uk-form-label" style={{ color: '#f1f5f9' }}>Full Name</label>
                  <div className="uk-form-controls">
                    <input 
                      className="uk-input" 
                      type="text" 
                      name="name"
                      value={profile.name || ''}
                      onChange={handleChange}
                      style={{ 
                        backgroundColor: '#334155',
                        color: '#f1f5f9',
                        borderColor: '#64748b'
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="uk-margin">
                  <label className="uk-form-label" style={{ color: '#f1f5f9' }}>Email</label>
                  <div className="uk-form-controls">
                    <input 
                      className="uk-input" 
                      type="email" 
                      name="email"
                      value={profile.email || ''}
                      onChange={handleChange}
                      style={{ 
                        backgroundColor: '#334155',
                        color: '#f1f5f9',
                        borderColor: '#64748b'
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="uk-margin">
                  <label className="uk-form-label" style={{ color: '#f1f5f9' }}>Phone Number</label>
                  <div className="uk-form-controls">
                    <input 
                      className="uk-input" 
                      type="tel" 
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      style={{ 
                        backgroundColor: '#334155',
                        color: '#f1f5f9',
                        borderColor: '#64748b'
                      }}
                    />
                  </div>
                </div>

                {/* Commented out for future implementation */}
                {/* <div className="uk-margin">
                  <label className="uk-form-label" style={{ color: '#f1f5f9' }}>Account Type</label>
                  <div className="uk-form-controls">
                    <input 
                      className="uk-input" 
                      type="text" 
                      name="account_type"
                      value={profile.account_type || ''}
                      onChange={handleChange}
                      style={{ 
                        backgroundColor: '#334155',
                        color: '#f1f5f9',
                        borderColor: '#64748b'
                      }}
                      disabled
                    />
                  </div>
                </div>

                <div className="uk-margin">
                  <label className="uk-form-label" style={{ color: '#f1f5f9' }}>Role</label>
                  <div className="uk-form-controls">
                    <input 
                      className="uk-input" 
                      type="text" 
                      name="role"
                      value={profile.role || ''}
                      onChange={handleChange}
                      style={{ 
                        backgroundColor: '#334155',
                        color: '#f1f5f9',
                        borderColor: '#64748b'
                      }}
                      disabled
                    />
                  </div>
                </div> */}

                <div className="uk-margin-top">
                  <button
                    type="submit"
                    className="uk-button uk-button-primary"
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      borderRadius: '20px',
                      marginRight: '10px'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span uk-spinner="ratio: 0.6"></span> Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>

                  <Link
                    to={`Profile/${id}`}
                    className="uk-button uk-button-default"
                    style={{
                      borderRadius: '20px',
                      borderColor: '#64748b',
                      color: '#94a3b8'
                    }}
                  >
                    Cancel
                  </Link>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;