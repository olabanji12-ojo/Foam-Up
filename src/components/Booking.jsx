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

  const LoadingSkeleton = () => (
    <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-4">
      <div className="h-5 bg-gray-200 rounded w-1/4 mb-5"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto pt-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Loading Booking Page...</h1>
          </div>
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="container mx-auto pt-16 ">
        {/* Header */}
        <div className="text-center mb-12 mt-20 ">
          <h1 className="text-4xl font-bold text-gray-900">Book Your Car Wash Service</h1>
          <p className="text-lg text-gray-600 mt-2">Select your car, car wash, service, date, and time</p>
          <Link to="/Customer_dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <span uk-icon="icon: chevron-left" className="mr-1"></span> Back to Dashboard
          </Link>
        </div>

        {/* Error Messages */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            <p>{errors.general}</p>
          </div>
        )}

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          uk-scrollspy="cls: uk-animation-slide-bottom-small; target: .card; delay: 200"
        >
          {/* Step 1: Car Selection */}
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
              <span uk-icon="icon: car; ratio: 1.2" className="text-blue-600 mr-2"></span>
              1. Select Your Car
            </h3>
            <select
              value={formData.carId}
              onChange={(e) => handleInputChange('carId', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.carId ? 'border-red-500' : 'border-gray-300'
              } bg-white text-gray-900`}
            >
              <option value="">Choose a car...</option>
              {userCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.make} {car.model} - {car.license_plate}
                </option>
              ))}
            </select>
            {errors.carId && <p className="text-red-600 text-sm mt-2">{errors.carId}</p>}
            {userCars.length === 0 && (
              <p className="text-gray-600 text-sm mt-2">
                No cars found.{' '}
                <Link to="/Car_formPage" className="text-blue-600 hover:text-blue-700">
                  Add a car
                </Link>{' '}
                to your account first.
              </p>
            )}
          </div>

          {/* Step 2: Car Wash Selection */}
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
              <span uk-icon="icon: location; ratio: 1.2" className="text-green-600 mr-2"></span>
              2. Select Car Wash
            </h3>
            <select
              value={formData.carwashId}
              onChange={(e) => handleInputChange('carwashId', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.carwashId ? 'border-red-500' : 'border-gray-300'
              } bg-white text-gray-900`}
            >
              <option value="">Choose a car wash...</option>
              {carwashes.map((carwash) => (
                <option key={carwash.id} value={carwash.id}>
                  {carwash.name} - {carwash.address}
                </option>
              ))}
            </select>
            {errors.carwashId && <p className="text-red-600 text-sm mt-2">{errors.carwashId}</p>}
            {selectedCarwash && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedCarwash.name}</h4>
                <p className="text-gray-600 mb-2">{selectedCarwash.description}</p>
                <p className="text-gray-600 mb-2 flex items-center">
                  <span uk-icon="icon: location" className="mr-1"></span> {selectedCarwash.address}
                </p>
                <p className="text-gray-600 mb-2 flex items-center">
                  <span uk-icon="icon: star" className="mr-1"></span> Rating: {selectedCarwash.rating || 'N/A'}
                </p>
                {formData.bookingDate && (
                  <p className="text-gray-600 flex items-center">
                    <span uk-icon="icon: clock" className="mr-1"></span> Hours:{' '}
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
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
              <span uk-icon="icon: settings; ratio: 1.2" className="text-amber-600 mr-2"></span>
              3. Select Service
            </h3>
            <select
              value={formData.serviceId}
              onChange={(e) => handleInputChange('serviceId', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.serviceId ? 'border-red-500' : 'border-gray-300'
              } bg-white text-gray-900 ${!formData.carwashId ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!formData.carwashId}
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
            {errors.serviceId && <p className="text-red-600 text-sm mt-2">{errors.serviceId}</p>}
            {selectedService && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600 mb-2">{selectedService.description}</p>
                <p className="text-gray-600 flex items-center">
                  <span uk-icon="icon: tag" className="mr-1"></span> Price: ₦{selectedService.price} | Duration: {selectedService.duration} mins
                </p>
              </div>
            )}
          </div>

          {/* Step 4: Date & Time Selection */}
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
              <span uk-icon="icon: calendar; ratio: 1.2" className="text-pink-600 mr-2"></span>
              4. Select Date & Time
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                  min={getMinDate()}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.bookingDate ? 'border-red-500' : 'border-gray-300'
                  } bg-white text-gray-900`}
                />
                {errors.bookingDate && <p className="text-red-600 text-sm mt-2">{errors.bookingDate}</p>}
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2">Time</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => handleInputChange('bookingTime', slot.time)}
                      className={`p-3 border rounded-lg text-sm transition-all ${
                        slot.time === formData.bookingTime
                          ? 'bg-blue-600 text-white border-blue-600'
                          : slot.available
                          ? 'bg-white border-gray-300 text-gray-900 hover:bg-blue-50 hover:border-blue-500'
                          : 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {slot.time} {slot.available ? '' : '(Booked)'}
                    </button>
                  ))}
                </div>
                {errors.bookingTime && <p className="text-red-600 text-sm mt-2">{errors.bookingTime}</p>}
                {formData.bookingDate && availableSlots.length === 0 && !errors.bookingDate && (
                  <p className="text-gray-600 text-sm mt-2">
                    No available slots for this date. Please select another date or car wash.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 5: Booking Type */}
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
              <span uk-icon="icon: settings; ratio: 1.2" className="text-purple-600 mr-2"></span>
              5. Booking Type
            </h3>
            <div className="flex space-x-6">
              <label className="flex items-center text-gray-900">
                <input
                  type="radio"
                  value="slot_booking"
                  checked={formData.bookingType === 'slot_booking'}
                  onChange={(e) => handleBookingTypeChange(e.target.value)}
                  className="mr-2 accent-blue-600"
                />
                Slot Booking (Visit car wash)
              </label>
              <label className="flex items-center text-gray-900">
                <input
                  type="radio"
                  value="home_service"
                  checked={formData.bookingType === 'home_service'}
                  onChange={(e) => handleBookingTypeChange(e.target.value)}
                  className="mr-2 accent-blue-600"
                  disabled={!selectedCarwash?.home_service}
                />
                Home Service (They come to you)
              </label>
            </div>
          </div>

          {/* Step 6: Location (for home service) */}
          {formData.bookingType === 'home_service' && (
            <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
                <span uk-icon="icon: home; ratio: 1.2" className="text-pink-600 mr-2"></span>
                6. Your Location
              </h3>
              <input
                type="text"
                placeholder="Enter your full address"
                value={formData.userLocation}
                onChange={(e) => handleInputChange('userLocation', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3 ${
                  errors.userLocation ? 'border-red-500' : 'border-gray-300'
                } bg-white text-gray-900`}
              />
              <textarea
                placeholder="Additional directions or landmark notes (e.g., 'Blue gate, next to pharmacy')"
                value={formData.addressNote}
                onChange={(e) => handleInputChange('addressNote', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                rows="3"
              ></textarea>
              {errors.userLocation && <p className="text-red-600 text-sm mt-2">{errors.userLocation}</p>}
            </div>
          )}

          {/* Step 7: Additional Notes */}
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
              <span uk-icon="icon: commenting; ratio: 1.2" className="text-cyan-600 mr-2"></span>
              7. Additional Notes
            </h3>
            <textarea
              placeholder="Any special requests or instructions (e.g., 'Please clean interior thoroughly')"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
              rows="4"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-12">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-full transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
              } shadow-md`}
            >
              {loading ? (
                <>
                  <span uk-spinner="ratio: 0.8" className="mr-2"></span>
                  Creating Booking...
                </>
              ) : (
                <>
                  <span uk-icon="icon: check" className="mr-2"></span>
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