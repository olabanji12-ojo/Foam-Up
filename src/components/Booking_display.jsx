import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from './Booking';
import { baseURL } from '../utils/environments';
import 'uikit/dist/css/uikit.min.css';

const BookingDisplay = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    // Add custom animations
    const style = document.createElement('style');
    style.textContent = `
      .uk-container {
        background: #0f0f23 !important;
      }
      .uk-card-hover:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
        border-color: #3b82f6;
      }
    `;
    document.head.appendChild(style);

    // Poll for UIkit
    const checkUIkit = () => {
      if (window.UIkit) {
        try {
          window.UIkit.update();
          console.log('UIkit initialized successfully in BookingDisplay');
        } catch (error) {
          console.error('Error initializing UIkit:', error);
        }
      } else {
        console.warn('UIkit not found, retrying...');
        setTimeout(checkUIkit, 100);
      }
    };
    checkUIkit();

    // Fetch bookings
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getMyBookings();
        if (response.success) {
          setBookings(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();

    return () => document.head.removeChild(style);
  }, []);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`${baseURL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
        alert('Booking cancelled successfully');
      } else {
        setError(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('An error occurred while cancelling the booking');
    }
  };

  const handleRateBooking = (booking) => {
    setSelectedBooking(booking);
  };

  const submitRating = (rating) => {
    console.log(`Rated ${rating} stars for booking ${selectedBooking.id}`);
    setSelectedBooking(null);
  };

  const cardStyle = {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    padding: '2rem',
    margin: '1rem 0',
    transition: 'all 0.4s ease',
  };

  const LoadingSkeleton = () => (
    <div className="uk-card uk-card-body" style={cardStyle}>
      <div style={{ height: '20px', background: '#374151', borderRadius: '4px', marginBottom: '20px' }}></div>
      <div style={{ height: '40px', background: '#374151', borderRadius: '4px', marginBottom: '20px' }}></div>
      <div style={{ height: '60px', background: '#374151', borderRadius: '4px' }}></div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f23' }}>
        <div className="uk-container uk-margin-large-top">
          <div className="uk-text-center uk-margin-large-bottom">
            <h1 className="uk-heading-medium" style={{ color: '#f1f5f9' }}>
              Loading Your Bookings...
            </h1>
          </div>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f23' }}>
        <div className="uk-container uk-margin-large-top">
          <div className="uk-alert-danger" uk-alert="true">
            <p>{error}</p>
          </div>
          <button
            className="uk-button uk-button-primary"
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 30px',
              color: 'white',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div style={{ minHeight: '100vh', background: '#0f0f23' }}>
      <div className="uk-container uk-margin-large-top">
        {/* Header */}
        <div className="uk-text-center uk-margin-large-bottom">
          <h1
            className="uk-heading-medium"
            style={{
              color: '#f1f5f9',
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Your Bookings
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '18px' }}>
            View and manage your upcoming and past car wash appointments
          </p>
          <div className="uk-flex uk-flex-center uk-flex-wrap uk-margin-medium-top">
            <Link
              to="/Booking"
              className="uk-button uk-button-primary uk-margin-small-right"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                border: 'none',
                borderRadius: '30px',
                padding: '12px 40px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }}
            >
              <span uk-icon="icon: plus" style={{ marginRight: '8px' }}></span>
              Make a Booking
            </Link>
            <Link
              to="/Customer_dashboard"
              className="uk-button uk-button-secondary"
              style={{
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                border: 'none',
                borderRadius: '30px',
                padding: '12px 40px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
              }}
            >
              <span uk-icon="icon: chevron-left" style={{ marginRight: '8px' }}></span>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* No Bookings Message */}
        {bookings.length === 0 && (
          <div className="uk-card uk-card-body uk-text-center" style={cardStyle}>
            <h3 style={{ color: '#f1f5f9' }}>No Bookings Found</h3>
            <p style={{ color: '#94a3b8' }}>
              You don't have any bookings yet. Click the button above to make your first booking!
            </p>
          </div>
        )}

        {/* Bookings List */}
        <div
          className="uk-grid-medium uk-child-width-1-2@m uk-child-width-1-1@s"
          uk-grid="true"
          uk-scrollspy="cls: uk-animation-slide-bottom-small; target: .uk-card; delay: 200"
        >
          {bookings.map((booking) => (
            <div key={booking.id}>
              <div className="uk-card uk-card-hover uk-card-body" style={cardStyle}>
                <div className="uk-grid-small" uk-grid="true">
                  <div className="uk-width-expand@m">
                    <h3 style={{ color: '#f1f5f9', marginTop: '0' }}>
                      {booking.carwash?.name || 'Car Wash Service'}
                    </h3>
                    <p style={{ color: '#94a3b8', margin: '5px 0' }}>
                      <span uk-icon="icon: location" style={{ marginRight: '5px', color: '#3b82f6' }}></span>
                      {booking.carwash?.address || 'Location not available'}
                    </p>
                    <p style={{ color: '#94a3b8', margin: '5px 0' }}>
                      <span uk-icon="icon: calendar" style={{ marginRight: '5px', color: '#f59e0b' }}></span>
                      {formatDateTime(booking.booking_time)}
                    </p>
                    <p style={{ color: '#94a3b8', margin: '5px 0' }}>
                      <span uk-icon="icon: car" style={{ marginRight: '5px', color: '#10b981' }}></span>
                      {booking.car?.make} {booking.car?.model} ({booking.car?.license_plate})
                    </p>
                    <p style={{ color: '#94a3b8', margin: '5px 0' }}>
                      <span uk-icon="icon: settings" style={{ marginRight: '5px', color: '#8b5cf6' }}></span>
                      Service: {booking.service_name}
                    </p>
                    {booking.booking_type === 'home_service' && booking.user_location && (
                      <p style={{ color: '#94a3b8', margin: '5px 0' }}>
                        <span uk-icon="icon: home" style={{ marginRight: '5px', color: '#ec4899' }}></span>
                        Home Service at {booking.user_location.address || booking.address_note || 'Your location'}
                      </p>
                    )}
                    {booking.notes && (
                      <p style={{ color: '#94a3b8', margin: '5px 0' }}>
                        <span uk-icon="icon: comment" style={{ marginRight: '5px', color: '#06b6d4' }}></span>
                        {booking.notes}
                      </p>
                    )}
                  </div>
                  <div className="uk-width-auto@m uk-flex uk-flex-column uk-flex-middle">
                    <span
                      className="uk-label"
                      style={{
                        background:
                          booking.status === 'completed'
                            ? '#10b981'
                            : booking.status === 'cancelled'
                            ? '#ef4444'
                            : booking.status === 'pending'
                            ? '#f59e0b'
                            : '#3b82f6',
                        color: 'white',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {booking.status}
                    </span>
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        className="uk-button uk-button-danger uk-button-small uk-margin-small-bottom"
                        onClick={() => handleCancelBooking(booking.id)}
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          border: 'none',
                          color: 'white',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === 'completed' && (
                      <button
                        className="uk-button uk-button-primary uk-button-small"
                        onClick={() => handleRateBooking(booking)}
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          border: 'none',
                          color: 'white',
                        }}
                        uk-toggle="target: #rating-modal"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Rate Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating Modal */}
        {selectedBooking && (
          <div id="rating-modal" uk-modal="true">
            <div className="uk-modal-dialog uk-modal-body">
              <h2 className="uk-modal-title">Rate {selectedBooking.service_name}</h2>
              <div className="uk-flex uk-flex-center uk-margin">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    uk-icon="icon: star; ratio: 2"
                    style={{ color: '#f59e0b', cursor: 'pointer', margin: '0 5px' }}
                    onClick={() => submitRating(star)}
                  ></span>
                ))}
              </div>
              <p className="uk-text-right">
                <button className="uk-button uk-button-default uk-modal-close" type="button">
                  Close
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDisplay;