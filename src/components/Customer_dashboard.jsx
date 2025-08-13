import React from 'react'; 
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 

const Customer_dashboard = () => {
  const { user } = useAuth();

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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSearchCarwash = () => {
    // Navigate to search carwash page
    console.log('Navigating to search carwash...');
  };

  const handleAddCar = () => {
    // Navigate to add car page
    console.log('Navigating to add car...');
  };


  const handleMyCars = () => {
    // Navigate to my cars page
    console.log('Navigating to my cars...');
  };

  const handleBookings = () => {
    // Navigate to bookings page
    console.log('Navigating to bookings...');
  };

  const handleFavourites = () => {
    // Navigate to favourites page
    console.log('Navigating to favourites...');
  };

  return (
    <>
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
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '150px',
            height: '150px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}></div>
          
          <div className="uk-container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="uk-text-center">
              <h1 className="uk-heading-medium uk-text-white uk-margin-remove-bottom" style={{ 
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Welcome back, {user?.name || 'Car Owner'}!
              </h1>
              <p className="uk-text-large uk-text-white uk-margin-small-top" style={{ 
                opacity: 0.8,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                Keep your vehicle sparkling clean with FoamUP
              </p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="uk-section" style={{ backgroundColor: '#0f0f23' }}>
          <div className="uk-container">
            
            {/* Quick Actions Cards */}
            <div className="uk-grid-match uk-child-width-1-2@m uk-child-width-1-1@s" uk-grid="true">
              
              {/* Find Car Wash Card */}
              <div>
                <div 
                  className="uk-card uk-card-hover uk-card-body uk-text-center" 
                  style={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '16px', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = '#334155';
                  }}
                >
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
                    pointerEvents: 'none'
                  }}></div>
                  
                  <div 
                    className="uk-border-circle uk-flex uk-flex-center uk-flex-middle uk-margin-bottom" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      margin: '0 auto 20px',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <span uk-icon="icon: location; ratio: 2" style={{ color: 'white' }}></span>
                  </div>
                  <h3 className="uk-card-title uk-margin-remove-top" style={{ color: '#f1f5f9', position: 'relative', zIndex: 2 }}>Find Car Wash</h3>
                  <p style={{ color: '#94a3b8', position: 'relative', zIndex: 2 }}>
                    Discover the best car wash services near you
                  </p>
                  <button 
                    onClick={handleSearchCarwash}
                    className="uk-button uk-button-large"
                    style={{ 
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      border: 'none',
                      borderRadius: '30px',
                      padding: '0 35px',
                      fontWeight: '600',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      zIndex: 2
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    Search Nearby
                  </button>
                </div>
              </div>

              {/* Add Vehicle Card */}
              <div>
                <div 
                  className="uk-card uk-card-hover uk-card-body uk-text-center" 
                  style={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '16px', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.2)';
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = '#334155';
                  }}
                >
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(6, 182, 212, 0.05))',
                    pointerEvents: 'none'
                  }}></div>
                  
                  <div 
                    className="uk-border-circle uk-flex uk-flex-center uk-flex-middle uk-margin-bottom" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      margin: '0 auto 20px',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <span uk-icon="icon: plus-circle; ratio: 2" style={{ color: 'white' }}></span>
                  </div>
                  
                  <h3 className="uk-card-title uk-margin-remove-top" style={{ color: '#f1f5f9', position: 'relative', zIndex: 2 }}>Add Vehicle</h3>
                  <p style={{ color: '#94a3b8', position: 'relative', zIndex: 2 }}>
                    Register your cars to track services and bookings
                  </p>
                  <Link 
                    to={"/Car_formPage"} 
                    onClick={handleAddCar}
                    className="uk-button uk-button-large"
                    style={{ 
                      background: 'transparent',
                      border: '2px solid #10b981',
                      color: '#10b981',
                      borderRadius: '30px',
                      padding: '0 35px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      zIndex: 2
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#10b981';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Add Car
                  </Link>
                </div>
              </div>

            </div>

            {/* Quick Stats/Overview */}
            <div className="uk-margin-large-top">
              <h2 className="uk-heading-line uk-text-center" style={{ color: '#f1f5f9' }}>
                <span>Your Dashboard Overview</span>
              </h2>
              
              <div className="uk-grid-small uk-child-width-1-3@m uk-child-width-1-1@s uk-margin-medium-top" uk-grid="true">
                
                {/* My Cars */}

                <Link to="/My_Cars"> 

                <div>
                  <div 
                    onClick={handleMyCars}
                    className="uk-card uk-card-hover uk-card-body uk-text-center" 
                    style={{ 
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#f59e0b';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(245, 158, 11, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#334155';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,  
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.05))',
                      pointerEvents: 'none'
                    }}></div>
                    
                    <span uk-icon="icon: car; ratio: 1.5" style={{ color: '#f59e0b', position: 'relative', zIndex: 2 }}></span>
                    
                    <h4 className="uk-margin-small-top uk-margin-remove-bottom" style={{ color: '#f1f5f9', position: 'relative', zIndex: 2 }}>My Vehicles</h4>
                    <p className="uk-text-small uk-margin-small-top" style={{ color: '#94a3b8', position: 'relative', zIndex: 2 }}>Manage your cars</p>
                  </div>
                </div>

                </Link>

                {/* Recent Bookings */}
                <div>
                  <div 
                    onClick={handleBookings}
                    className="uk-card uk-card-hover uk-card-body uk-text-center" 
                    style={{ 
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#334155';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
                      pointerEvents: 'none'
                    }}></div>
                    <span uk-icon="icon: calendar; ratio: 1.5" style={{ color: '#3b82f6', position: 'relative', zIndex: 2 }}></span>
                    <h4 className="uk-margin-small-top uk-margin-remove-bottom" style={{ color: '#f1f5f9', position: 'relative', zIndex: 2 }}>Bookings</h4>
                    <p className="uk-text-small uk-margin-small-top" style={{ color: '#94a3b8', position: 'relative', zIndex: 2 }}>View appointments</p>
                  </div>
                </div>

                {/* Favorites */}
                <div>
                  <div 
                    onClick={handleFavourites}
                    className="uk-card uk-card-hover uk-card-body uk-text-center" 
                    style={{ 
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ec4899';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(236, 72, 153, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#334155';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(219, 39, 119, 0.05))',
                      pointerEvents: 'none'
                    }}></div>
                    <span uk-icon="icon: heart; ratio: 1.5" style={{ color: '#ec4899', position: 'relative', zIndex: 2 }}></span>
                    <h4 className="uk-margin-small-top uk-margin-remove-bottom" style={{ color: '#f1f5f9', position: 'relative', zIndex: 2 }}>Favourites</h4>
                    <p className="uk-text-small uk-margin-small-top" style={{ color: '#94a3b8', position: 'relative', zIndex: 2 }}>Saved car washes</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Customer_dashboard;