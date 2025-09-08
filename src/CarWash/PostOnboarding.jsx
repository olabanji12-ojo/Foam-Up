import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../utils/environments';
import { useParams } from 'react-router-dom';

const PostOnboarding = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    openHours: {
      Monday: { start: '', end: '' },
      Tuesday: { start: '', end: '' },
      Wednesday: { start: '', end: '' },
      Thursday: { start: '', end: '' },
      Friday: { start: '', end: '' },
      Saturday: { start: '', end: '' },
      Sunday: { start: '', end: '' },
    },
    homeService: false,
    deliveryRadiusKm: '',
    maxCarsPerSlot: '',
    state: '',
    country: '',
    lga: '',
    serviceRangeMinutes: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info when component mounts
    // Replace the fetchUser function in PostOnboarding.jsx
const fetchUser = async () => {
    try {
      console.log('=== POSTONBOARDING DEBUG ===');
      console.log('Fetching user with ID:', id);
      console.log('Request URL:', `${baseURL}/user/${id}`);
      
      const response = await fetch(`${baseURL}/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched user data:', data);
      console.log('User carwash_id:', data.carwash_id);
      console.log('carwash_id type:', typeof data.carwash_id);
      console.log('carwash_id exists?', !!data.carwash_id);
  
      // Check all possible carwash_id variations
      console.log('Checking all carwash_id variations:');
      console.log('- data.carwash_id:', data.carwash_id);
      console.log('- data.CarWashID:', data.CarWashID);
      console.log('- data.carwashId:', data.carwashId);
      console.log('- data.carWashId:', data.carWashId);
  
      // If CarWashID exists → redirect to dashboard
      if (data.carwash_id) {
        console.log('carwash_id found, redirecting to dashboard');
        console.log('carwash_id value:', data.carwash_id);
        navigate('/CarwashDashboard');
      } else {
        console.log('No carwash_id found, staying on onboarding page');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOpenHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      openHours: {
        ...prev.openHours,
        [day]: {
          ...prev.openHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    const transformedData = {
      name: formData.name,
      description: formData.description,
      address: formData.address,
      location: {
        type: "Point",
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
      },
      open_hours: Object.fromEntries(
        Object.entries(formData.openHours).map(([day, times]) => [
          day.slice(0, 3).toLowerCase(),
          { start: times.start, end: times.end }
        ])
      ),
      home_service: formData.homeService,
      delivery_radius_km: formData.deliveryRadiusKm ? parseInt(formData.deliveryRadiusKm) : 0,
      max_cars_per_slot: parseInt(formData.maxCarsPerSlot),
      state: formData.state,
      country: formData.country,
      lga: formData.lga,
      service_range_minutes: formData.serviceRangeMinutes ? parseInt(formData.serviceRangeMinutes) : 0,
    };
  
    try {
      const response = await fetch(`${baseURL}/carwashes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(transformedData),
      });
  
      if (!response.ok) throw new Error("Failed to submit form");
  
      navigate(`/CarwashDashboard/${carwashId}`);
    } catch (err) {
      console.error(err);
    }
  };
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Register Your Car Wash
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Car Wash Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Car Wash Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter car wash name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your car wash (optional)"
              rows="4"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full address"
              required
            />
          </div>

          {/* Location (Latitude and Longitude) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 6.5244"
                step="any"
                required
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 3.3792"
                step="any"
                required
              />
            </div>
          </div>

          {/* Open Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Hours
            </label>
            {Object.keys(formData.openHours).map((day) => (
              <div key={day} className="mb-4">
                <h3 className="text-sm font-semibold text-gray-800">{day}</h3>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <div>
                    <label htmlFor={`${day}-start`} className="block text-xs text-gray-600">
                      Start Time
                    </label>
                    <input
                      type="time"
                      id={`${day}-start`}
                      value={formData.openHours[day].start}
                      onChange={(e) => handleOpenHoursChange(day, 'start', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`${day}-end`} className="block text-xs text-gray-600">
                      End Time
                    </label>
                    <input
                      type="time"
                      id={`${day}-end`}
                      value={formData.openHours[day].end}
                      onChange={(e) => handleOpenHoursChange(day, 'end', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Home Service */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="homeService"
              name="homeService"
              checked={formData.homeService}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="homeService" className="ml-2 text-sm text-gray-700">
              Offer Home Service
            </label>
          </div>

          {/* Delivery Radius (Conditional) */}
          {formData.homeService && (
            <div>
              <label htmlFor="deliveryRadiusKm" className="block text-sm font-medium text-gray-700">
                Delivery Radius (km)
              </label>
              <input
                type="number"
                id="deliveryRadiusKm"
                name="deliveryRadiusKm"
                value={formData.deliveryRadiusKm}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 10"
                min="1"
                required
              />
            </div>
          )}

          {/* Max Cars Per Slot */}
          <div>
            <label htmlFor="maxCarsPerSlot" className="block text-sm font-medium text-gray-700">
              Max Cars Per Slot
            </label>
            <input
              type="number"
              id="maxCarsPerSlot"
              name="maxCarsPerSlot"
              value={formData.maxCarsPerSlot}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 5"
              min="1"
              required
            />
          </div>

          {/* State, Country, LGA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Lagos"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Nigeria"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lga" className="block text-sm font-medium text-gray-700">
              Local Government Area (LGA)
            </label>
            <input
              type="text"
              id="lga"
              name="lga"
              value={formData.lga}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Ikeja"
            />
          </div>

          {/* Service Range Minutes */}
          <div>
            <label htmlFor="serviceRangeMinutes" className="block text-sm font-medium text-gray-700">
              Service Range (minutes)
            </label>
            <input
              type="number"
              id="serviceRangeMinutes"
              name="serviceRangeMinutes"
              value={formData.serviceRangeMinutes}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 30"
              min="1"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Car Wash Details
            </button>
          </div>
        </form>
     
      </div>
    </div>
  );
};

export default PostOnboarding;

