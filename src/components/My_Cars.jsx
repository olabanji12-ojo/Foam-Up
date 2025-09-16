import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosConfiguration/axiosClient';

const My_Cars = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [fetchingCars, setFetchingCars] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCars = async () => {
      if (loading || !isAuthenticated) {
        console.log('Skipping API call: Auth not ready');
        return;
      }

      setFetchingCars(true);
      setError(null);

      try {
        const response = await axiosClient.get('/cars/my');
        const data = response.data;
        
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
        setError(error.response?.data?.message || 'Failed to fetch cars');
        console.error('Error fetching cars:', error.message);
      } finally {
        setFetchingCars(false);
      }
    };

    fetchMyCars();
  }, [isAuthenticated, loading]);

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    
    setDeletingId(carId);
    try {
      await axiosClient.delete(`/cars/${carId}`);
      
      // Remove the car from state
      setCars(cars.filter(car => (car.id || car._id) !== carId));
      
      // Show success message
      alert('Vehicle deleted successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete vehicle');
    } finally {
      setDeletingId(null);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Error Loading Vehicles</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || fetchingCars) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-slate-800">Loading your vehicles...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16">
      {/* Header Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            My Vehicles
          </h1>
          <p className="text-lg text-slate-600">
            Manage your registered cars and their details
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4">
        {/* Add Car Button */}
        <div className="text-center mb-10">
          <Link
            to="/Car_formPage"
            className="inline-flex items-center px-6 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Vehicle
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-100 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">No Vehicles Found</h3>
            <p className="text-slate-600 mb-8">
              Start by adding your first vehicle to get started with FoamUP!
            </p>
            <Link
              to="/Car_formPage"
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors duration-300"
            >
              Add Your First Vehicle
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
              Your Vehicles ({cars.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car, index) => (
                <div 
                  key={car.id || car._id || index}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-100 group hover:-translate-y-1 transition-transform duration-300"
                >
                  {/* Default Badge */}
                  {car.isDefault && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      DEFAULT
                    </div>
                  )}
                  
                  {/* Car Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  {/* Car Details */}
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {car.model || 'Unknown Model'}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-600">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {car.plate || 'No Plate'}
                    </div>
                    
                    {car.color && (
                      <div className="flex items-center text-slate-600">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        {car.color}
                      </div>
                    )}
                  </div>
                  
                  {/* Notes */}
                  {car.note && (
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <p className="text-sm text-slate-600 italic">"{car.note}"</p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Link
                      to={`/Car_formPage/${car.id || car._id}`}
                      className="flex-1 px-4 py-2.5 rounded-xl font-medium text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors duration-300"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </span>
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteCar(car.id || car._id)}
                      disabled={deletingId === (car.id || car._id)}
                      className="flex-1 px-4 py-2.5 rounded-xl font-medium text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors duration-300 disabled:opacity-50"
                    >
                      {deletingId === (car.id || car._id) ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <Link
            to="/Customer_dashboard"
            className="inline-flex items-center px-6 py-2.5 rounded-xl font-medium text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default My_Cars;