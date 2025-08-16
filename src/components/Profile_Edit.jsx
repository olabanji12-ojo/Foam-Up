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
    profile_photo: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null); // For new file upload
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !authUser?.id) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data.data;
        setProfile(userData);
        // Set current profile photo as preview if exists
        if (userData.profile_photo) {
          setPreviewImage(userData.profile_photo);
        }
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfilePhoto(null);
    setPreviewImage(profile.profile_photo || null); // Revert to original or null
    // Clear file input
    const fileInput = document.querySelector('input[name="profile_photo"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add profile fields
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      
      // Add profile photo if selected
      if (profilePhoto) {
        formData.append('profile_photo', profilePhoto);
      }

      await axios.put(`${baseURL}/user/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
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
            
            {/* Profile Photo Section */}
            <div className="uk-margin-large-bottom uk-text-center">
              <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Profile Photo</h3>
              
              {/* Current/Preview Image */}
              <div className="uk-margin-bottom">
                <div className="uk-border-circle uk-display-inline-block" 
                     style={{
                       width: '150px',
                       height: '150px',
                       overflow: 'hidden',
                       position: 'relative',
                       border: '3px solid #64748b'
                     }}>
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span uk-icon="icon: user; ratio: 3" style={{ color: 'white' }}></span>
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload Input */}
              <div className="uk-margin-bottom">
                <div className="uk-form-controls uk-text-center">
                  <label style={{ 
                    display: 'inline-block',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    <span uk-icon="icon: camera; ratio: 0.8" className="uk-margin-small-right"></span>
                    Choose New Photo
                    <input 
                      type="file" 
                      name="profile_photo"
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Remove/Reset Button */}
              {(profilePhoto || previewImage !== profile.profile_photo) && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="uk-button uk-button-default uk-button-small"
                  style={{
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    borderRadius: '15px'
                  }}
                >
                  <span uk-icon="icon: close; ratio: 0.7" className="uk-margin-small-right"></span>
                  Reset Photo
                </button>
              )}
              
              {/* File Info */}
              {profilePhoto && (
                <div style={{ 
                  marginTop: '10px',
                  fontSize: '12px',
                  color: '#94a3b8'
                }}>
                  Selected: {profilePhoto.name} ({(profilePhoto.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Form Fields */}
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

                <div className="uk-margin-top">
                  <button
                    type="submit"
                    className="uk-button uk-button-primary"
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      borderRadius: '20px',
                      marginRight: '10px'
                    }}>

                    {isSubmitting ? (
                      <>
                        <span uk-spinner="ratio: 0.6"></span> Saving...
                      </>
                    ) : (
                      <>
                        <span uk-icon="icon: check; ratio: 0.8" className="uk-margin-small-right"></span>
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${id}`)}
                    className="uk-button uk-button-default"
                    style={{
                      borderRadius: '20px',
                      borderColor: '#64748b',
                      color: '#94a3b8'
                    }}
                  >
                    <span uk-icon="icon: arrow-left; ratio: 0.8" className="uk-margin-small-right"></span>
                    Cancel
                  </button>
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