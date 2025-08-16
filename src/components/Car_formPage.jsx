import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UIkit from 'uikit' 
import { useParams } from 'react-router-dom';

const Car_formPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL params for edit mode

  // Check if user is authenticated and has the right role
  useEffect(() => {
    if (!isAuthenticated || user?.account_type !== 'car_owner' || user?.role !== 'car_owner') {
      navigate('/login'); // Redirect to login if not authorized
    }
  }, [isAuthenticated, user, navigate]);

  const [formData, setFormData] = useState({
    model: '',
    plate: '',  
    color: '',
    profile_photo: '',
    isDefault: false,
    note: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCar, setFetchingCar] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = !!id;

  // Fetch car data if in edit mode
  useEffect(() => {
    const fetchCarData = async () => {
      if (!id) return;
      console.log('Edit mode detected, ID:', id); // Verify ID is correct
      setFetchingCar(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setFetchingCar(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched car data:', res.data.data); // Verify response data
        const car = res.data.data;
        setFormData({
          model: car.model || '',
          plate: car.plate || '',
          color: car.color || '',
          profile_photo: car.profile_photo || '',
          isDefault: car.isDefault || false,
          note: car.note || '',
        });
      } catch (err) {
        console.error("Failed to fetch car", err);
        setError("Failed to load car details");
      } finally {
        setFetchingCar(false);
      }
    };

    fetchCarData();
  }, [id]);

  // Add CSS animations for floating elements
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For simplicity, store file name; in production, upload to server/S3
      setFormData({ ...formData, profile_photo: file.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if we're in edit mode but fetching failed
    if (isEditMode && error) {
      UIkit.notification({
        message: 'Cannot save: Failed to load original car data',
        status: 'danger',
        pos: 'top-center'
      });
      return;
    }
    
    setLoading(true);
    setError(null);

    // Basic client-side validation
    if (!formData.model || !formData.plate) {
      setError('Model and License Plate are required');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        model: formData.model,
        plate: formData.plate,
        color: formData.color,
        profile_photo: formData.profile_photo,
        isDefault: formData.isDefault,
        note: formData.note,
      }; 
 
      let response;
      if (isEditMode) {
        // Update existing car
        response = await axios.put(`${baseURL}/cars/${id}`, requestData, {

          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        UIkit.notification({ 
          message: 'Vehicle updated successfully!', 
          status: 'success', 
          pos: 'top-center' 
        });
      } else {
        // Create new car
        response = await axios.post('${baseURL}/cars/', requestData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        UIkit.notification({
          message: 'Vehicle added successfully!',
          status: 'success',
          pos: 'top-center',
        });
      }

      // Navigate back to dashboard on success
      navigate('/Customer_dashboard');

    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'add'} vehicle`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching car data in edit mode
  if (fetchingCar) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="uk-card uk-card-body uk-text-center" style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#f1f5f9' }}>Loading vehicle data...</h3>
          <span uk-spinner="ratio: 1.5" style={{ color: '#10b981' }}></span>
        </div>
      </div>
    );
  }

  // If fetch failed in edit mode, show error message
  if (isEditMode && error && !fetchingCar) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="uk-card uk-card-body uk-text-center" style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', maxWidth: '500px', padding: '40px' }}>
          <h3 style={{ color: '#f1f5f9' }}>Error Loading Vehicle Data</h3>
          <p style={{ color: '#ef4444', margin: '20px 0' }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="uk-button uk-button-default"
            style={{ 
              background: 'transparent',
              border: '2px solid #64748b',
              color: '#94a3b8',
              borderRadius: '30px',
              padding: '10px 25px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#f1f5f9';
              e.currentTarget.style.color = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#64748b';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23' }}>
      
      {/* Hero Section with Welcome */}
      <div 
        className="uk-section uk-section-primary" 
        style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '60px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '100px',
          height: '100px',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '150px',
          height: '150px',
          background: 'rgba(6, 182, 212, 0.1)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        
        <div className="uk-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="uk-text-center">
            <div 
              className="uk-border-circle uk-flex uk-flex-center uk-flex-middle uk-margin-bottom" 
              style={{ 
                width: '100px', 
                height: '100px', 
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                margin: '0 auto 30px'
              }}
            >
              <span uk-icon={`icon: ${isEditMode ? 'pencil' : 'plus-circle'}; ratio: 2.5`} style={{ color: 'white' }}></span>
            </div>
            
            <h1 className="uk-heading-medium uk-text-white uk-margin-remove-bottom" style={{ 
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {isEditMode ? 'Edit Your Vehicle' : 'Add Your Vehicle'}
            </h1>
            <p className="uk-text-large uk-text-white uk-margin-small-top" style={{ 
              opacity: 0.8,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {isEditMode 
                ? 'Update your vehicle information' 
                : 'Register your car to track services and bookings'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="uk-section" style={{ backgroundColor: '#0f0f23' }}>
        <div className="uk-container">
          <div className="uk-flex uk-flex-center">
            <div style={{ width: '100%', maxWidth: '600px' }}>
              
              <div 
                className="uk-card uk-card-body" 
                style={{ 
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '16px', 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'slideUp 0.6s ease-out'
                }}
              >
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.02), rgba(6, 182, 212, 0.02))',
                  pointerEvents: 'none'
                }}></div>
                
                <form className="uk-form-stacked" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 2 }}>
                  
                  {/* Model Field */}
                  <div className="uk-margin-medium">
                    <label 
                      className="uk-form-label uk-text-bold" 
                      style={{ 
                        color: '#f1f5f9',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block'
                      }}
                    >
                      Vehicle Model *
                    </label>
                    <input
                      className="uk-input uk-form-large"
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Toyota Camry, Honda Civic"
                      style={{ 
                        borderRadius: '12px', 
                        backgroundColor: '#334155', 
                        color: '#f1f5f9',
                        border: '2px solid #475569',
                        padding: '15px 20px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10b981';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#475569';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* License Plate Field */}
                  <div className="uk-margin-medium">
                    <label 
                      className="uk-form-label uk-text-bold" 
                      style={{ 
                        color: '#f1f5f9',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block'
                      }}
                    >
                      License Plate *
                    </label>
                    <input
                      className="uk-input uk-form-large"
                      type="text"
                      name="plate"
                      value={formData.plate}
                      onChange={handleChange}
                      required
                      placeholder="e.g., ABC-1234"
                      style={{ 
                        borderRadius: '12px', 
                        backgroundColor: '#334155', 
                        color: '#f1f5f9',
                        border: '2px solid #475569',
                        padding: '15px 20px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10b981';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#475569';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Color Field */}
                  <div className="uk-margin-medium">
                    <label 
                      className="uk-form-label uk-text-bold" 
                      style={{ 
                        color: '#f1f5f9',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block'
                      }}
                    >
                      Color
                    </label>
                    <input
                      className="uk-input uk-form-large"
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g., White, Black, Silver"
                      style={{ 
                        borderRadius: '12px', 
                        backgroundColor: '#334155', 
                        color: '#f1f5f9',
                        border: '2px solid #475569',
                        padding: '15px 20px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10b981';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#475569';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Photo Upload Field */}
                  <div className="uk-margin-medium">
                    <label 
                      className="uk-form-label uk-text-bold" 
                      style={{ 
                        color: '#f1f5f9',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block'
                      }}
                    >
                      Vehicle Photo
                    </label>
                    <div 
                      className="uk-form-custom uk-form-large"
                      style={{
                        border: '2px dashed #475569',
                        borderRadius: '12px',
                        padding: '30px 20px',
                        textAlign: 'center',
                        backgroundColor: '#334155',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.backgroundColor = '#3f4a5a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#475569';
                        e.currentTarget.style.backgroundColor = '#334155';
                      }}
                      onClick={() => document.querySelector('input[name="profile_photo"]').click()}
                    >
                      <input
                        type="file"
                        name="profile_photo"
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ 
                          position: 'absolute', 
                          opacity: 0, 
                          width: '1px', 
                          height: '1px',
                          overflow: 'hidden',
                          clip: 'rect(0, 0, 0, 0)',
                          border: 0
                        }}
                      />
                      <div style={{ pointerEvents: 'none', zIndex: 1 }}>
                        <span uk-icon="icon: cloud-upload; ratio: 2" style={{ color: '#94a3b8', display: 'block', marginBottom: '10px' }}></span>
                        <p style={{ 
                          color: '#94a3b8', 
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.4',
                          maxWidth: '100%',
                          wordWrap: 'break-word'
                        }}>
                          {formData.profile_photo ? (
                            <span style={{ color: '#10b981', fontWeight: '500' }}>
                              Selected: {formData.profile_photo}
                            </span>
                          ) : (
                            'Click to upload or drag and drop'
                          )}
                        </p>
                        {!formData.profile_photo && (
                          <p style={{ 
                            color: '#64748b', 
                            margin: '5px 0 0 0',
                            fontSize: '12px'
                          }}>
                            PNG, JPG, GIF up to 10MB
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Default Checkbox */}
                  <div className="uk-margin-medium">
                    <label 
                      className="uk-form-label uk-flex uk-flex-middle" 
                      style={{ 
                        color: '#f1f5f9',
                        fontSize: '16px',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        className="uk-checkbox"
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        style={{ 
                          marginRight: '12px',  
                          transform: 'scale(1.2)', 
                          accentColor: '#10b981'
                        }}
                      />
                      <span>Set as Default Vehicle</span>
                    </label>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '5px 0 0 32px' }}>
                      This vehicle will be pre-selected for bookings
                    </p>
                  </div>

                  {/* Notes Field */}
                  <div className="uk-margin-medium">
                    <label 
                      className="uk-form-label uk-text-bold" 
                      style={{ 
                        color: '#f1f5f9',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block'
                      }}
                    >
                      Notes (Optional)
                    </label>
                    <textarea
                      className="uk-textarea"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Any additional details about your vehicle..."
                      style={{ 
                        borderRadius: '12px', 
                        backgroundColor: '#334155', 
                        color: '#f1f5f9',
                        border: '2px solid #475569',
                        padding: '15px 20px',
                        fontSize: '16px',
                        resize: 'vertical',
                        minHeight: '100px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10b981';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#475569';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div 
                      className="uk-margin-medium" 
                      style={{
                        padding: '15px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px'
                      }}
                    >
                      <p style={{ color: '#ef4444', margin: 0, fontSize: '14px' }}>
                        <span uk-icon="icon: warning; ratio: 0.8" style={{ marginRight: '8px' }}></span>
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="uk-margin-large-top uk-flex uk-flex-center uk-flex-column uk-flex-row@s uk-child-width-1-1 uk-child-width-auto@s" uk-grid="true">
                    
                    <div>
                      <button
                        type="button"
                        onClick={() => navigate('/Customer_dashboard')}
                        className="uk-button uk-button-large uk-width-1-1 uk-width-auto@s"
                        style={{ 
                          background: 'transparent',
                          border: '2px solid #64748b',
                          color: '#94a3b8',
                          borderRadius: '30px',
                          padding: '0 35px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          marginRight: '15px' 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#f1f5f9';
                          e.currentTarget.style.color = '#f1f5f9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#64748b';
                          e.currentTarget.style.color = '#94a3b8';
                        }}
                      >
                        Cancel
                      </button>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="uk-button uk-button-large uk-width-1-1 uk-width-auto@s"
                        disabled={loading}
                        style={{
                          background: loading ? '#475569' : 'linear-gradient(135deg, #10b981, #06b6d4)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '30px',
                          padding: '0 35px',
                          fontWeight: '600',
                          boxShadow: loading ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.3s ease',
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (!loading) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                          }
                        }}
                      >
                        {loading ? (
                          <>
                            <span uk-spinner="ratio: 0.8" style={{ marginRight: '10px' }}></span>
                            {isEditMode ? 'Updating Vehicle...' : 'Adding Vehicle...'}
                          </>
                        ) : (
                          <>
                            <span uk-icon={`icon: ${isEditMode ? 'check' : 'plus-circle'}; ratio: 0.8`} style={{ marginRight: '8px' }}></span>
                            {isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
                          </>
                        )}
                      </button>
                    </div>
                    
                  </div>
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Car_formPage;