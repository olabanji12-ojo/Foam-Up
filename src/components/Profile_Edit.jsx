import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UIkit from 'uikit';
import { baseURL } from '../utils/environments';

const ProfileEdit = () => {
  const { user: authUser, token, loading: authLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    profile_photo: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null); // For new file upload
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !authUser?.id) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data.data;
        setProfile(userData);
        // Set current profile photo as preview if exists
        if (userData.profile_photo) {
          setPreviewImage(userData.profile_photo);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        UIkit.notification({
          message: 'Failed to load profile data',
          status: 'danger',
          pos: 'top-center'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token, authLoading, authUser?.id]);

  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
    }
  }, [authLoading, authUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfilePhoto(null);
    setPreviewImage(profile.profile_photo || null); // Revert to original or null
    // Clear file input
    const fileInput = document.querySelector('input[name="profile_photo"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add profile fields
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      
      // Add profile photo if selected
      if (profilePhoto) {
        formData.append('profile_photo', profilePhoto);
      }

      await axios.put(`${baseURL}/user/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      UIkit.notification({
        message: 'Profile updated successfully!',
        status: 'success',
        pos: 'top-center'
      });
      navigate(`/profile/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      UIkit.notification({
        message: 'Failed to update profile',
        status: 'danger',
        pos: 'top-center'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900">Loading profile...</h3>
          <span uk-spinner="ratio: 1.5" className="text-blue-600"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900">Error Loading Profile</h3>
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      {/* <div className="bg-white shadow-md py-12">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Edit Profile</h1>
        </div>
      </div> */}

      {/* Profile Edit Form */}
      <div className="py-12">
        <div className="container mx-auto max-w-2xl" uk-scrollspy="cls: uk-animation-slide-bottom-small; target: .card; delay: 200">
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6 mt-20">
            {/* Profile Photo Section */}
            <div className="mb-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Photo</h3>
              <div className="mb-4">
                <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500">
                      <span uk-icon="icon: user; ratio: 3" className="text-white"></span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-all">
                  <span uk-icon="icon: camera; ratio: 0.8" className="mr-2"></span>
                  Choose New Photo
                  <input 
                    type="file" 
                    name="profile_photo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
              {(profilePhoto || previewImage !== profile.profile_photo) && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <span uk-icon="icon: close; ratio: 0.7" className="mr-1"></span>
                  Reset Photo
                </button>
              )}
              {profilePhoto && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {profilePhoto.name} ({(profilePhoto.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={profile.name || ''}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profile.email || ''}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <span uk-spinner="ratio: 0.6" className="mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span uk-icon="icon: check; ratio: 0.8" className="mr-2"></span>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${id}`)}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <span uk-icon="icon: arrow-left; ratio: 0.8" className="mr-2"></span>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;