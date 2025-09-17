import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../utils/environments';
import { useParams } from 'react-router-dom';
import 'uikit/dist/css/uikit.min.css';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../axiosConfiguration/axiosClient';

const PostOnboarding = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useAuth();
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
    const fetchUser = async () => {
      try {
        console.log('=== POSTONBOARDING DEBUG ===');
        console.log('Fetching user with ID:', id);
        console.log('Request URL:', `${baseURL}/user/${id}`);
        
        const response = await axiosClient.get(`/user/${id}`);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.status >= 200 && response.status < 300);
        
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = response.data;
        const res = data.data;
        console.log('Fetched user data:', data);
        console.log('User carwash_id:', res.carwash_id);
        console.log('carwash_id type:', typeof data.carwash_id);
        console.log('carwash_id exists?', !!data.carwash_id);
  
        // Check all possible carwash_id variations
        console.log('Checking all carwash_id variations:');
        console.log('- data.carwash_id:', data.carwash_id);
        console.log('- data.CarWashID:', data.CarWashID);
        console.log('- data.carwashId:', data.carwashId);
        console.log('- data.carWashId:', data.carWashId);
     
        // If carwash_id exists → redirect to dashboard
        if (res.carwash_id) {
          console.log('carwash_id found, redirecting to dashboard');
          console.log('carwash_id value:', res.carwash_id);
          navigate(`/CarwashDashboard/${res.id}`);
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
      const response = await axiosClient.post('/carwashes', transformedData);
      console.log('Full response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Trying to navigate to:', `/CarwashDashboard/${response.data.data.id}`);
    
  
      if (response.status !== 201) throw new Error("Failed to submit form");
      navigate(`/CarwashDashboard/${response.data.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900">Loading...</h3>
          <span uk-spinner="ratio: 1.5" className="text-blue-600"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="container mx-auto max-w-lg sm:max-w-2xl mt-40 " uk-scrollspy="cls: uk-animation-slide-bottom-small; target: .card; delay: 200">
        <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6 sm:p-8 ">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6">
            Register Your Car Wash
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Provide details to set up your car wash business
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Wash Name */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Car Wash Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                placeholder="Enter car wash name"
                required
              />
            </div>

            {/* Description */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                placeholder="Describe your car wash (optional)"
                rows="4"
              />
            </div>

            {/* Address */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                placeholder="Enter full address"
                required
              />
            </div>

            {/* Location (Latitude and Longitude) */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-xs font-medium text-gray-600">
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                    placeholder="e.g., 6.5244"
                    step="any"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-xs font-medium text-gray-600">
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                    placeholder="e.g., 3.3792"
                    step="any"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Open Hours */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Open Hours
                <span uk-icon="icon: clock; ratio: 1.2" className="ml-2 text-blue-600"></span>
              </label>
              <div className="space-y-4">
                {Object.keys(formData.openHours).map((day) => (
                  <div key={day} className="card bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{day}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`${day}-start`} className="block text-xs text-gray-600">
                          Start Time
                        </label>
                        <input
                          type="time"
                          id={`${day}-start`} 
                          value={formData.openHours[day].start}
                          onChange={(e) => handleOpenHoursChange(day, 'start', e.target.value)}
                          className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
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
                          className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Service */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="homeService"
                  name="homeService"
                  checked={formData.homeService}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="homeService" className="ml-2 text-sm text-gray-700 flex items-center">
                  Offer Home Service
                  <span uk-icon="icon: home; ratio: 1.2" className="ml-2 text-blue-600"></span>
                </label>
              </div>
            </div>

            {/* Delivery Radius (Conditional) */}
            {formData.homeService && (
              <div className="card bg-white border border-gray-200 rounded-lg p-4">
                <label htmlFor="deliveryRadiusKm" className="block text-sm font-medium text-gray-700">
                  Delivery Radius (km)
                </label>
                <input
                  type="number"
                  id="deliveryRadiusKm"
                  name="deliveryRadiusKm"
                  value={formData.deliveryRadiusKm}
                  onChange={handleInputChange}
                  className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                  placeholder="e.g., 10"
                  min="1"
                  required
                />
              </div>
            )}

            {/* Max Cars Per Slot */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <label htmlFor="maxCarsPerSlot" className="block text-sm font-medium text-gray-700">
                Max Cars Per Slot
              </label>
              <input
                type="number"
                id="maxCarsPerSlot"
                name="maxCarsPerSlot"
                value={formData.maxCarsPerSlot}
                onChange={handleInputChange}
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                placeholder="e.g., 5"
                min="1"
                required
              />
            </div>

            {/* State, Country, LGA */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location Details</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-xs font-medium text-gray-600">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                    placeholder="e.g., Lagos"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-xs font-medium text-gray-600">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                    placeholder="e.g., Nigeria"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="lga" className="block text-xs font-medium text-gray-600">
                  Local Government Area (LGA)
                </label>
                <input
                  type="text"
                  id="lga"
                  name="lga"
                  value={formData.lga}
                  onChange={handleInputChange}
                  className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                  placeholder="e.g., Ikeja"
                />
              </div>
            </div>

            {/* Service Range Minutes */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <label htmlFor="serviceRangeMinutes" className="block text-sm font-medium text-gray-700">
                Service Range (minutes)
              </label>
              <input
                type="number"
                id="serviceRangeMinutes"
                name="serviceRangeMinutes"
                value={formData.serviceRangeMinutes}
                onChange={handleInputChange}
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                placeholder="e.g., 30"
                min="1"
              />
            </div>

            {/* Submit Button */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all"
              >
                <span uk-icon="icon: check; ratio: 1" className="mr-2"></span>
                Submit Car Wash Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostOnboarding;