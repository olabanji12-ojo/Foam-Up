import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UIkit from 'uikit';
import { baseURL } from '../utils/environments';


const Profile = () => {
  const { user: authUser, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't proceed if auth isn't ready or user not authenticated
    if (authLoading || !authUser?.id) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/${authUser.id}`, {
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
  }, [authUser?.id, token, authLoading]);

  // Handle navigation after all hooks
  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
    }
  }, [authLoading, authUser, navigate]);

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
            My Profile
          </h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="uk-section" style={{ backgroundColor: '#0f0f23' }}>
        <div className="uk-container uk-container-small">
          <div className="uk-card uk-card-default uk-card-body" 
               style={{ 
                 backgroundColor: '#1e293b',
                 borderRadius: '16px',
                 border: '1px solid #334155'
               }}>
            <div className="uk-grid-medium" data-uk-grid>
              <div className="uk-width-1-4@s">
                <div className="uk-card uk-card-body uk-text-center">
                  {/*  UPDATED: Display Cloudinary Image or Default Avatar */}
                  <div className="uk-border-circle" 
                       style={{
                         width: '120px',
                         height: '120px',
                         margin: '0 auto',
                         overflow: 'hidden', // Important for circular image
                         position: 'relative' 

                       }}>
                    {profile?.profile_photo ? (
                      // Display Cloudinary image if available
                      <img 
                        src={profile.profile_photo} 
                        alt={`${profile.name}'s profile`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover', // Ensures image covers the circle properly
                          objectPosition: 'center'
                        }}
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Default Avatar - shows if no profile photo or image fails */}
                    <div 
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                        display: profile?.profile_photo ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%'
                      }}
                    >
                      <span uk-icon="icon: user; ratio: 2" style={{ color: 'white' }}></span>
                    </div>
                  </div>
                  
                  {/* ✨ NEW: Image upload status indicator */}
                  {profile?.profile_photo && (
                    <div style={{ 
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      <span uk-icon="icon: check; ratio: 0.8"></span>
                      Profile Photo
                    </div>
                  )}
                </div>
              </div>
              
              <div className="uk-width-3-4@s">
                <div className="uk-card uk-card-body">
                  <h2 style={{ color: '#f1f5f9' }}>{profile?.name || 'No name provided'}</h2>
                  
                  <div className="uk-margin-top">
                    <div className="uk-grid-small" data-uk-grid>
                      <div className="uk-width-1-2@s">
                        <h4 style={{ color: '#f1f5f9' }}>Account Information</h4>
                        <p style={{ color: '#94a3b8' }}>
                          <span uk-icon="icon: mail" className="uk-margin-small-right"></span>
                          {profile?.email}
                        </p>
                        <p style={{ color: '#94a3b8' }}>
                          <span uk-icon="icon: receiver" className="uk-margin-small-right"></span>
                          {profile?.phone || 'No phone number'}
                        </p>
                      </div>
                      
                      <div className="uk-width-1-2@s">
                        <h4 style={{ color: '#f1f5f9' }}>Account Type</h4>
                        <p style={{ color: '#94a3b8' }}>
                          <span uk-icon="icon: user" className="uk-margin-small-right"></span>
                          {profile?.account_type || 'N/A'}
                        </p>
                        <p style={{ color: '#94a3b8' }}>
                          <span uk-icon="icon: lock" className="uk-margin-small-right"></span>
                          {profile?.role || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="uk-margin-top">
                      <button
                        className="uk-button uk-button-primary"
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          borderRadius: '20px'
                        }}
                      >
                        <span uk-icon="icon: pencil" className="uk-margin-small-right"></span>
                        <Link
                          to={`/Profile_Edit/${profile?.id}`}
                          style={{
                            color: '#f1f5f9',
                            textDecoration: 'none',
                          }}
                        >
                          Edit Profile 
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;