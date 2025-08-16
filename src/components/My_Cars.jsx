import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UIkit from 'uikit';
import { useNavigate } from 'react-router-dom';

const My_Cars = () => {
  const { token, isAuthenticated, loading, user } = useAuth();
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  const [fetchingCars, setFetchingCars] = useState(false);
  const navigate = useNavigate(); 

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/cars/${carId}`, {

          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          
        });
        
        UIkit.notification({
          message: 'Vehicle deleted successfully!',
          status: 'success',
          pos: 'top-center'
        });
        
        // Refresh the car list or navigate away
        navigate('/Customer_dashboard');
      } catch (err) {
        UIkit.notification({
          message: err.response?.data?.error || 'Failed to delete vehicle',
          status: 'danger',
          pos: 'top-center'
        });
        console.error(err);
      }
    } 
  };
  
  // Add CSS animations for floating elements
  useEffect(() => {
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

    

    const fetchMyCars = async () => {
      if (loading || !isAuthenticated || !token) {
        console.log('Skipping API call: Auth not ready');
        return;
      }

      setFetchingCars(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8080/api/cars/my', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle different possible response structures
        if (data.data) {
          setCars(Array.isArray(data.data) ? data.data : []);
        } else if (Array.isArray(data)) {
          setCars(data);
        } else {
          setCars([]);
        }
        
        console.log('Fetched cars:', data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching cars:', error.message);
      } finally {
        setFetchingCars(false);
      }
    };

    fetchMyCars();

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [token, isAuthenticated, loading]);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23', color: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="uk-card uk-card-default uk-card-body uk-text-center" style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', maxWidth: '500px', margin: '20px' }}>
          <span uk-icon="icon: warning; ratio: 2" style={{ color: '#ef4444', display: 'block', marginBottom: '15px' }}></span>
          <h3 style={{ color: '#f1f5f9' }}>Error Loading Vehicles</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="uk-button uk-button-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              border: 'none',
              borderRadius: '20px',
              padding: '0 25px',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || fetchingCars) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23', color: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="uk-card uk-card-default uk-card-body uk-text-center" style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#f1f5f9' }}>Loading your vehicles...</h3>
          <span uk-spinner="ratio: 1.5" style={{ color: '#10b981' }}></span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23' }}>
      {/* Hero Section */}
      <div
        className="uk-section uk-section-primary"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '60px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '100px',
            height: '100px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '150px',
            height: '150px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        ></div>
        <div className="uk-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="uk-text-center">
            <div 
              className="uk-border-circle uk-flex uk-flex-center uk-flex-middle uk-margin-bottom" 
              style={{ 
                width: '100px', 
                height: '100px', 
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                margin: '0 auto 30px'
              }}
            >
              <span uk-icon="icon: car; ratio: 2.5" style={{ color: 'white' }}></span>
            </div>
            <h1
              className="uk-heading-medium uk-text-white uk-margin-remove-bottom"
              style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              My Vehicles
            </h1>
            <p
              className="uk-text-large uk-text-white uk-margin-small-top"
              style={{ opacity: 0.8, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
              Manage your registered cars
            </p>
          </div>
        </div>
      </div>

      {/* Cars List */}
      <div className="uk-section" style={{ backgroundColor: '#0f0f23' }}>
        <div className="uk-container">
          
          {/* Add Car Button - Always visible at top */}
          <div className="uk-text-center uk-margin-medium-bottom">
            <Link
              to="/Car_formPage"
              className="uk-button uk-button-large"
              style={{
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                border: 'none',
                borderRadius: '30px',
                padding: '0 35px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
              }}
            >
              <span uk-icon="icon: plus-circle; ratio: 0.8" style={{ marginRight: '8px' }}></span>
              Add New Vehicle
            </Link>
          </div>

          {cars.length === 0 ? (
            <div className="uk-card uk-card-default uk-card-body uk-text-center" 
                 style={{ 
                   backgroundColor: '#1e293b', 
                   borderRadius: '12px', 
                   border: '1px solid #334155',
                   animation: 'slideUp 0.6s ease-out'
                 }}>
              <div 
                className="uk-border-circle uk-flex uk-flex-center uk-flex-middle uk-margin-bottom" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(135deg, #64748b, #475569)',
                  margin: '0 auto 20px'
                }}
              >
                <span uk-icon="icon: car; ratio: 2" style={{ color: 'white' }}></span>
              </div>
              <h3 style={{ color: '#f1f5f9' }}>No Vehicles Found</h3>
              <p style={{ color: '#94a3b8' }}>Start by adding your first vehicle to get started with FoamUP!</p>
            </div>
          ) : (
            <>
              <h2 className="uk-heading-line uk-text-center uk-margin-medium-bottom" style={{ color: '#f1f5f9' }}>
                <span>Your Vehicles ({cars.length})</span>
              </h2>
              <div className="uk-grid-match uk-child-width-1-3@l uk-child-width-1-2@m uk-child-width-1-1@s uk-margin-medium-top" uk-grid="true">
                {cars.map((car, index) => (
                  <div key={car.id || car._id || index}>
                    <div
                      className="uk-card uk-card-hover uk-card-body uk-text-center"
                      style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        transition: 'all 0.4s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(245, 158, 11, 0.2)';
                        e.currentTarget.style.borderColor = '#f59e0b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                        e.currentTarget.style.borderColor = '#334155';
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.05))',
                          pointerEvents: 'none',
                        }}
                      ></div>
                      
                      {/* Default Badge */}
                      {car.isDefault && (
                        <div style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          zIndex: 3
                        }}>
                          DEFAULT
                        </div>
                      )}
                      
                      <div
                        className="uk-border-circle uk-flex uk-flex-center uk-flex-middle uk-margin-bottom"
                        style={{
                          width: '80px',
                          height: '80px',
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          margin: '0 auto 20px',
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        <span uk-icon="icon: car; ratio: 2" style={{ color: 'white' }}></span>
                      </div>
                      
                      <h3 className="uk-card-title uk-margin-remove-top" style={{ color: '#f1f5f9', position: 'relative', zIndex: 2 }}>
                        {car.model || 'Unknown Model'}
                      </h3>
                      
                      <div style={{ color: '#94a3b8', position: 'relative', zIndex: 2, marginBottom: '15px' }}>
                        <p style={{ margin: '5px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span uk-icon="icon: tag; ratio: 0.7" style={{ marginRight: '8px', color: '#64748b' }}></span>
                          {car.plate || 'No Plate'}
                        </p>
                        {car.color && (
                          <p style={{ margin: '5px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span uk-icon="icon: paint-bucket; ratio: 0.7" style={{ marginRight: '8px', color: '#64748b' }}></span>
                            {car.color}
                          </p>
                        )}
                      </div> 
                      
                      {car.note && (
                        <p style={{ 
                          color: '#94a3b8', 
                          position: 'relative', 
                          zIndex: 2, 
                          fontStyle: 'italic',
                          fontSize: '14px',
                          marginBottom: '20px',
                          padding: '10px',
                          backgroundColor: 'rgba(51, 65, 85, 0.3)',
                          borderRadius: '8px',
                          border: '1px solid rgba(71, 85, 105, 0.3)'
                        }}>
                          "{car.note}"
                        </p>
                      )}
                      
                      <div className="uk-flex uk-flex-center uk-child-width-auto" uk-grid="true">
                      <div>
                        <Link
                          to={`/Car_formPage/${car.id || car._id}`}
                          className="uk-button uk-button-small uk-margin-small-right"
                          style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '0 20px',
                            fontWeight: '600',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                            transition: 'all 0.3s ease',
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
                          }}
                        >
                          <span uk-icon="icon: pencil; ratio: 0.7" style={{ marginRight: '5px' }}></span>
                          Edit
                        </Link>
                      </div>
                      
                      {/* Delete Button */}
                      <div>
                        <button
                          onClick={() => handleDeleteCar(car.id || car._id)}
                          className="uk-button uk-button-small"
                          style={{
                            background: 'transparent',
                            border: '2px solid #ef4444',
                            color: '#ef4444',
                            borderRadius: '20px',
                            padding: '0 15px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ef4444';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#ef4444';
                          }}
                        >
                          <span uk-icon="icon: trash; ratio: 0.7" style={{ marginRight: '5px' }}></span>
                          Delete
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Back to Dashboard */}
          <div className="uk-text-center uk-margin-large-top">
            <Link 
              to="/Customer_dashboard"
              className="uk-button uk-button-large"
              style={{
                background: 'transparent',
                border: '2px solid #64748b',
                color: '#94a3b8',
                borderRadius: '30px',
                padding: '0 35px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
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
              <span uk-icon="icon: arrow-left; ratio: 0.8" style={{ marginRight: '8px' }}></span>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default My_Cars;