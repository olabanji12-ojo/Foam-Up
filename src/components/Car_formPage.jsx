import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { baseURL } from '../utils/environments';

const CarFormPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Authentication check
  useEffect(() => {
    if (!isAuthenticated || user?.account_type !== 'car_owner' || user?.role !== 'car_owner') {
      navigate('/login');
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
  const [previewImage, setPreviewImage] = useState(null);

  const isEditMode = !!id;

  // Fetch car data if in edit mode
  useEffect(() => {
    const fetchCarData = async () => {
      if (!id) return;
      
      setFetchingCar(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setFetchingCar(false);
        return;
      }

      try {
        const res = await axios.get(`${baseURL}/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const car = res.data.data;
        setFormData({
          model: car.model || '',
          plate: car.plate || '',
          color: car.color || '',
          profile_photo: car.profile_photo || '',
          isDefault: car.isDefault || false,
          note: car.note || '',
        });
        
        // Set preview if image exists
        if (car.profile_photo) {
          setPreviewImage(car.profile_photo);
        }
      } catch (err) {
        console.error("Failed to fetch car", err);
        setError("Failed to load car details");
      } finally {
        setFetchingCar(false);
      }
    };

    fetchCarData();
  }, [id]);

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
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // For actual upload, you would handle this differently
      setFormData({ ...formData, profile_photo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isEditMode && error) {
      // Show error notification
      return;
    }
    
    setLoading(true);
    setError(null);

    // Basic validation
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
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('model', formData.model);
      submitData.append('plate', formData.plate);
      submitData.append('color', formData.color);
      submitData.append('isDefault', formData.isDefault);
      submitData.append('note', formData.note);
      
      if (formData.profile_photo instanceof File) {
        submitData.append('profile_photo', formData.profile_photo);
      }

      let response;
      if (isEditMode) {
        response = await axios.put(`${baseURL}/cars/update/${id}`, submitData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        // Show success notification
      } else {
        response = await axios.post(`${baseURL}/cars/`, submitData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        // Show success notification
      }

      navigate('/Customer_dashboard');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'add'} vehicle`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (fetchingCar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-white text-lg font-medium">Loading vehicle data...</h3>
        </div>
      </div>
    );
  }

  // Error state
  if (isEditMode && error && !fetchingCar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-bold mb-2">Error Loading Vehicle</h3>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl font-medium text-white bg-slate-700 hover:bg-slate-600 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            {isEditMode ? 'Edit Your Vehicle' : 'Add Your Vehicle'}
          </h1>
          <p className="text-lg text-slate-600">
            {isEditMode 
              ? 'Update your vehicle information' 
              : 'Register your car to track services and bookings'
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vehicle Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="e.g., Toyota Camry, Honda Civic"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
            </div>

            {/* License Plate Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                License Plate *
              </label>
              <input
                type="text"
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                required
                placeholder="e.g., ABC-1234"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
            </div>

            {/* Color Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g., White, Black, Silver"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
            </div>

            {/* Photo Upload Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vehicle Photo
              </label>
              
              <div className="flex flex-col items-center">
                {previewImage ? (
                  <div className="mb-4 relative">
                    <img 
                      src={previewImage} 
                      alt="Vehicle preview" 
                      className="w-48 h-32 object-cover rounded-xl shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData({...formData, profile_photo: ''});
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : null}
                
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-400 transition-colors duration-300 p-6 text-center">
                  <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-slate-500">
                    {previewImage ? 'Change image' : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    PNG, JPG up to 10MB
                  </span>
                  <input
                    type="file"
                    name="profile_photo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Default Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="default-vehicle"
                  name="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="default-vehicle" className="font-medium text-slate-700">
                  Set as Default Vehicle
                </label>
                <p className="text-slate-500 mt-1">
                  This vehicle will be pre-selected for bookings
                </p>
              </div>
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="4"
                placeholder="Any additional details about your vehicle..."
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/Customer_dashboard')}
                className="flex-1 px-6 py-3.5 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors duration-300"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    {isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarFormPage;


