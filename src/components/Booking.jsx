import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { baseURL } from '../utils/environments';
import 'uikit/dist/css/uikit.min.css';

export const bookingService = {
  getUserCars: async () => {
    const response = await fetch(`${baseURL}/cars/my`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getCarwashes: async () => {
    const response = await fetch(`${baseURL}/carwashes`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getAvailableSlots: async (carwashId, date) => {
    const response = await fetch(`${baseURL}/bookings/carwash/${carwashId}/date?date=${date}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createBooking: async (bookingData) => {
    const response = await fetch(`${baseURL}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  getMyBookings: async () => {
    const response = await fetch(`${baseURL}/bookings/user/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
};

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    carId: '',
    carwashId: '',
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    bookingType: 'slot_booking',
    userLocation: '',
    addressNote: '',
    notes: '',
  });

  // Data states
  const [userCars, setUserCars] = useState([]);
  const [carwashes, setCarwashes] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedCarwash, setSelectedCarwash] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Helper Functions
  const generateTimeSlots = (openHours, duration = 30) => {
    if (!openHours) return [];
    const { start, end } = openHours;
    const slots = [];
    let current = new Date(`2025-01-01T${start}`);
    const endTime = new Date(`2025-01-01T${end}`);
    const interval = duration * 60 * 1000; // Duration in milliseconds

    while (current < endTime) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      current = new Date(current.getTime() + interval);
    }
    return slots;
  };

  const filterAvailableSlots = (allSlots, existingBookings) => {
    const takenSlots = existingBookings.map((booking) => {
      const bookingTime = new Date(booking.booking_time);
      return `${bookingTime.getHours().toString().padStart(2, '0')}:${bookingTime.getMinutes().toString().padStart(2, '0')}`;
    });
    return allSlots.map((slot) => ({
      time: slot,
      available: !takenSlots.includes(slot),
    }));
  };

  const getOpenHoursForDate = (carwash, date) => {
    if (!carwash || !carwash.open_hours) return null;
    const day = new Date(date).toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
    return carwash.open_hours[day];
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Data Fetching
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const [carsResponse, carwashesResponse] = await Promise.all([
        bookingService.getUserCars(),
        bookingService.getCarwashes(),
      ]);

      if (carsResponse.success) {
        setUserCars(carsResponse.data || []);
      } else {
        setErrors((prev) => ({ ...prev, general: 'Failed to load cars' }));
      }

      if (carwashesResponse.success) {
        setCarwashes(carwashesResponse.data || []);
      } else {
        setErrors((prev) => ({ ...prev, general: 'Failed to load car washes' }));
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setErrors({ general: 'Failed to load initial data' });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (formData.carwashId && formData.bookingDate && formData.serviceId) {
      fetchAvailableSlots(formData.carwashId, formData.bookingDate);
    }
  }, [formData.carwashId, formData.bookingDate, formData.serviceId]);

  const fetchAvailableSlots = async (carwashId, date) => {
    try {
      console.log("🔍 Fetching available slots...");
      console.log("📌 Carwash ID:", carwashId);
      console.log("📌 Selected Date:", date);
  
      const carwash = carwashes.find((c) => c.id === carwashId);
      console.log("🏪 Selected Carwash:", carwash);
  
      const service = carwash?.services.find((s) => s.name === formData.serviceId);
      console.log("🛠️ Selected Service:", service);
  
      const openHours = getOpenHoursForDate(carwash, date);
      console.log("⏰ Carwash Open Hours for Date:", openHours);
      console.log("🕑 Carwash Open Hours:", carwash?.open_hours);

      if (!openHours) {
        console.warn("⚠️ Carwash is closed on this date:", date);
        setAvailableSlots([]);
        setErrors((prev) => ({
          ...prev,
          bookingDate: "Car wash is closed on this day",
        }));
        return;
      }
  
      // Fetch available slots from API
      console.log(
        "🌐 API Request:",
        `${baseURL}/bookings/carwash/${carwashId}/date?date=${date}`
      );
      const response = await bookingService.getAvailableSlots(carwashId, date);
      console.log("🌐 API Response:", response);
  
      const existingBookings = response.data || [];
      console.log("📌 Existing Bookings:", existingBookings);
  
      // Generate possible slots based on open hours + service duration
      const allSlots = generateTimeSlots(openHours, service?.duration || 30);
      console.log("🕒 All Possible Time Slots:", allSlots);
  
      // Filter available slots based on booked times
      const slots = filterAvailableSlots(allSlots, existingBookings);
      console.log("✅ Final Available Slots:", slots);
  
      setAvailableSlots(slots);
    } catch (error) {
      console.error("❌ Error fetching available slots:", error);
      setAvailableSlots([]);
      setErrors((prev) => ({ ...prev, general: "Failed to load available slots" }));
    }
  };
  

  // Form Handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (field === 'carwashId') {
      const carwash = carwashes.find((c) => c.id === value);
      setSelectedCarwash(carwash);
      setFormData((prev) => ({ ...prev, serviceId: '', bookingTime: '' }));
      setAvailableSlots([]);
    }

    if (field === 'serviceId') {
      const carwash = carwashes.find((c) => c.id === formData.carwashId);
      const service = carwash?.services.find((s) => s.name === value);
      setSelectedService(service);
      setFormData((prev) => ({ ...prev, bookingTime: '' }));
      setAvailableSlots([]);
    }
  };

  const handleBookingTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      bookingType: type,
      userLocation: type === 'slot_booking' ? '' : prev.userLocation,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.carId) newErrors.carId = 'Please select a car';
    if (!formData.carwashId) newErrors.carwashId = 'Please select a car wash';
    if (!formData.serviceId) newErrors.serviceId = 'Please select a service';
    if (!formData.bookingDate) newErrors.bookingDate = 'Please select a date';
    if (!formData.bookingTime) newErrors.bookingTime = 'Please select a time';

    if (formData.bookingType === 'home_service' && !formData.userLocation) {
      newErrors.userLocation = 'Location is required for home service';
    }

    const selectedDate = new Date(formData.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.bookingDate = 'Cannot book for past dates';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const bookingData = {
        car_id: formData.carId,
        carwash_id: formData.carwashId,
        service_name: formData.serviceId,
        booking_time: new Date(`${formData.bookingDate}T${formData.bookingTime}`).toISOString(),
        booking_type: formData.bookingType,
        user_location: formData.bookingType === 'home_service' ? { type: 'Point', coordinates: [0, 0] } : null,
        address_note: formData.addressNote,
        notes: formData.notes,
      };

      const response = await bookingService.createBooking(bookingData);
      if (response.success || response.id) {
        alert('Booking created successfully!');
        navigate('/Booking_display');
      } else {
        setErrors({ general: response.message || 'Failed to create booking' });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors({ general: 'An error occurred while creating the booking' });
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    padding: '2rem',
    margin: '1rem 0',
  };

  const LoadingSkeleton = () => (
    <div className="uk-card uk-card-body" style={cardStyle}>
      <div style={{ height: '20px', background: '#374151', borderRadius: '4px', marginBottom: '20px' }}></div>
      <div style={{ height: '40px', background: '#374151', borderRadius: '4px' }}></div>
    </div>
  );

  if (initialLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f23' }}>
        <div className="uk-container uk-margin-large-top">
          <div className="uk-text-center uk-margin-large-bottom">
            <h1 className="uk-heading-medium" style={{ color: '#f1f5f9' }}>
              Loading Booking Page...
            </h1>
          </div>
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
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
            Book Your Car Wash Service
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '18px' }}>
            Select your car, car wash, service, date, and time
          </p>
          <Link
            to="/Customer_dashboard"
            className="uk-button uk-button-text"
            style={{ color: '#3b82f6' }}
          >
            <span uk-icon="icon: chevron-left"></span> Back to Dashboard
          </Link>
        </div>

        {/* Error Messages */}
        {errors.general && (
          <div className="uk-alert-danger uk-margin-bottom" uk-alert="true">
            <p>{errors.general}</p>
          </div>
        )}

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="uk-form-stacked"
          uk-scrollspy="cls: uk-animation-slide-bottom-small; target: .uk-card; delay: 200"
        >
          {/* Step 1: Car Selection */}
          <div className="uk-card uk-card-body" style={cardStyle}>
            <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
              <span uk-icon="icon: car; ratio: 1.2" style={{ color: '#3b82f6', marginRight: '10px' }}></span>
              1. Select Your Car
            </h3>
            <select
              value={formData.carId}
              onChange={(e) => handleInputChange('carId', e.target.value)}
              className={`uk-select ${errors.carId ? 'uk-form-danger' : ''}`}
              style={{ background: '#374151', border: '1px solid #4b5563', color: '#f1f5f9', borderRadius: '8px' }}
            >
              <option value="">Choose a car...</option>
              {userCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.make} {car.model} - {car.license_plate}
                </option>
              ))}
            </select>
            {errors.carId && <div className="uk-text-danger uk-margin-small-top">{errors.carId}</div>}
            {userCars.length === 0 && (
              <p style={{ color: '#94a3b8', marginTop: '10px' }}>
                No cars found.{' '}
                <Link to="/Car_formPage" style={{ color: '#3b82f6' }}>
                  Add a car
                </Link>{' '}
                to your account first.
              </p>
            )}
          </div>

          {/* Step 2: Car Wash Selection */}
          <div className="uk-card uk-card-body" style={cardStyle}>
            <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
              <span uk-icon="icon: location; ratio: 1.2" style={{ color: '#10b981', marginRight: '10px' }}></span>
              2. Select Car Wash
            </h3>
            <select
              value={formData.carwashId}
              onChange={(e) => handleInputChange('carwashId', e.target.value)}
              className={`uk-select ${errors.carwashId ? 'uk-form-danger' : ''}`}
              style={{ background: '#374151', border: '1px solid #4b5563', color: '#f1f5f9', borderRadius: '8px' }}
            >
              <option value="">Choose a car wash...</option>
              {carwashes.map((carwash) => (
                <option key={carwash.id} value={carwash.id}>
                  {carwash.name} - {carwash.address}
                </option>
              ))}
            </select>
            {errors.carwashId && <div className="uk-text-danger uk-margin-small-top">{errors.carwashId}</div>}
            {selectedCarwash && (
              <div className="uk-margin-top uk-padding-small" style={{ background: '#374151', borderRadius: '8px', border: '1px solid #4b5563' }}>
                <h4 style={{ color: '#f1f5f9', margin: '0 0 10px 0' }}>{selectedCarwash.name}</h4>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0' }}>{selectedCarwash.description}</p>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0' }}>
                  <span uk-icon="icon: location"></span> {selectedCarwash.address}
                </p>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0' }}>
                  <span uk-icon="icon: star"></span> Rating: {selectedCarwash.rating || 'N/A'}
                </p>
                {formData.bookingDate && (
                  <p style={{ color: '#94a3b8', margin: '0' }}>
                    <span uk-icon="icon: clock"></span> Hours:{' '}
                    {(() => {
                      const openHours = getOpenHoursForDate(selectedCarwash, formData.bookingDate);
                      return openHours ? `${openHours.start} - ${openHours.end}` : 'Closed';
                    })()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Service Selection */}
          <div className="uk-card uk-card-body" style={cardStyle}>
            <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
              <span uk-icon="icon: settings; ratio: 1.2" style={{ color: '#f59e0b', marginRight: '10px' }}></span>
              3. Select Service
            </h3>

            <select
              value={formData.serviceId}
              onChange={(e) => handleInputChange('serviceId', e.target.value)}
              className={`uk-select ${errors.serviceId ? 'uk-form-danger' : ''}`}
              disabled={!formData.carwashId}
              style={{ background: '#374151', border: '1px solid #4b5563', color: '#f1f5f9', borderRadius: '8px' }}
            >
              <option value="">Choose a service...</option>

              {selectedCarwash?.services?.length > 0 ? (
              selectedCarwash.services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name} - ₦{service.price} ({service.duration} mins)
                </option>
              ))
            ) : (
              <option disabled>No services available</option>
            )}

            </select>

            {errors.serviceId && <div className="uk-text-danger uk-margin-small-top">{errors.serviceId}</div>}
            {selectedService && (
              <div className="uk-margin-top uk-padding-small" style={{ background: '#374151', borderRadius: '8px', border: '1px solid #4b5563' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0' }}>{selectedService.description}</p>
                <p style={{ color: '#94a3b8', margin: '0' }}>
                  <span uk-icon="icon: tag"></span> Price: ₦{selectedService.price} | Duration: {selectedService.duration} mins
                </p>
              </div>
            )}
          </div>
           

          {/* Step 4: Date & Time Selection */}
          <div className="uk-card uk-card-body" style={cardStyle}>
            <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
              <span uk-icon="icon: calendar; ratio: 1.2" style={{ color: '#ec4899', marginRight: '10px' }}></span>
              4. Select Date & Time
            </h3>
            <div className="uk-grid-small uk-child-width-1-2@m" uk-grid="true">
              <div>
                <label className="uk-form-label" style={{ color: '#f1f5f9' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                  min={getMinDate()}
                  className={`uk-input ${errors.bookingDate ? 'uk-form-danger' : ''}`}
                  style={{ background: '#374151', border: '1px solid #4b5563', color: '#f1f5f9', borderRadius: '8px' }}
                />
                {errors.bookingDate && <div className="uk-text-danger uk-margin-small-top">{errors.bookingDate}</div>}
              </div>
              <div>
                <label className="uk-form-label" style={{ color: '#f1f5f9' }}>
                  Time
                </label>
                <div className="uk-grid-small uk-child-width-1-3@s uk-margin-top" uk-grid="true">
                  {availableSlots.map((slot) => (
                    <div key={slot.time}>
                      <button
                        type="button"
                        disabled={!slot.available}
                        onClick={() => handleInputChange('bookingTime', slot.time)}
                        className="uk-button uk-button-small"
                        style={{
                          background: slot.time === formData.bookingTime ? '#3b82f6' : slot.available ? '#374151' : '#6b7280',
                          color: '#f1f5f9',
                          border: '1px solid #4b5563',
                          borderRadius: '8px',
                          width: '100%',
                          padding: '10px',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (slot.available) {
                            e.currentTarget.style.background = '#3b82f6';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (slot.available) {
                            e.currentTarget.style.background = slot.time === formData.bookingTime ? '#3b82f6' : '#374151';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {slot.time} {slot.available ? '' : '(Booked)'}
                      </button>
                    </div>
                  ))}
                </div>
                {errors.bookingTime && <div className="uk-text-danger uk-margin-small-top">{errors.bookingTime}</div>}
                {formData.bookingDate && availableSlots.length === 0 && !errors.bookingDate && (
                  <p style={{ color: '#94a3b8', marginTop: '10px' }}>
                    No available slots for this date. Please select another date or car wash.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 5: Booking Type */}
          <div className="uk-card uk-card-body" style={cardStyle}>
            <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
              <span uk-icon="icon: settings; ratio: 1.2" style={{ color: '#8b5cf6', marginRight: '10px' }}></span>
              5. Booking Type
            </h3>
            <div>
              <label className="uk-margin-right" style={{ color: '#f1f5f9', marginRight: '30px' }}>
                <input
                  type="radio"
                  value="slot_booking"
                  checked={formData.bookingType === 'slot_booking'}
                  onChange={(e) => handleBookingTypeChange(e.target.value)}
                  className="uk-radio uk-margin-small-right"
                />
                Slot Booking (Visit car wash)
              </label>
              <label style={{ color: '#f1f5f9' }}>
                <input
                  type="radio"
                  value="home_service"
                  checked={formData.bookingType === 'home_service'}
                  onChange={(e) => handleBookingTypeChange(e.target.value)}
                  className="uk-radio uk-margin-small-right"
                  disabled={!selectedCarwash?.home_service}
                />
                Home Service (They come to you)
              </label>
            </div>
          </div>

          {/* Step 6: Location (for home service) */}
          {formData.bookingType === 'home_service' && (
            <div className="uk-card uk-card-body" style={cardStyle}>
              <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
                <span uk-icon="icon: home; ratio: 1.2" style={{ color: '#ec4899', marginRight: '10px' }}></span>
                6. Your Location
              </h3>
              <input
                type="text"
                placeholder="Enter your full address"
                value={formData.userLocation}
                onChange={(e) => handleInputChange('userLocation', e.target.value)}
                className={`uk-input uk-margin-small-bottom ${errors.userLocation ? 'uk-form-danger' : ''}`}
                style={{ background: '#374151', border: '1px solid #4b5563', color: '#f1f5f9', borderRadius: '8px' }}
              />
              <textarea
                placeholder="Additional directions or landmark notes (e.g., 'Blue gate, next to pharmacy')"
                value={formData.addressNote}
                onChange={(e) => handleInputChange('addressNote', e.target.value)}
                className="uk-textarea"
                rows="3"
                style={{ background: '#374151', border: '1px solid #4b5563', color: '#f1f5f9', borderRadius: '8px' }}
              ></textarea>
              {errors.userLocation && <div className="uk-text-danger uk-margin-small-top">{errors.userLocation}</div>}
            </div>
          )}

          {/* Step 7: Additional Notes */}
          <div className="uk-card uk-card-body" style={cardStyle}>
            <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
              <span uk-icon="icon: commenting; ratio: 1.2" style={{ color: '#06b6d4', marginRight: '10px' }}></span>
              7. Additional Notes
            </h3>
            <textarea
              placeholder="Any special requests or instructions (e.g., 'Please clean interior thoroughly')"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="uk-textarea"
              rows="4"
              style={{ background: '#374151', border: '1px solid #4b5563', color: '#f1f5f9', borderRadius: '8px' }}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="uk-text-center uk-margin-large-top">
            <button
              type="submit"
              disabled={loading}
              className="uk-button uk-button-large"
              style={{
                background: loading ? '#6b7280' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                border: 'none',
                borderRadius: '30px',
                padding: '15px 50px',
                fontWeight: '600',
                color: 'white',
                fontSize: '18px',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {loading ? (
                <>
                  <span uk-spinner="ratio: 0.8" style={{ marginRight: '10px' }}></span>
                  Creating Booking...
                </>
              ) : (
                <>
                  <span uk-icon="icon: check" style={{ marginRight: '10px' }}></span>
                  Create Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;