import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UIkit from 'uikit';
import { baseURL } from '../utils/environments';

const Profile = () => {
  const { user: authUser, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't proceed if auth isn't ready or user not authenticated
    if (authLoading || !authUser?.id) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/${authUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
         
        setProfile(response.data.data);
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
  }, [authUser?.id, token, authLoading]);

  // Handle navigation after all hooks
  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
    }
  }, [authLoading, authUser, navigate]);

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
      

      {/* Profile Content */}
      <div className="py-12 ">
        <div className="container mx-auto max-w-2xl mt-30" uk-scrollspy="cls: uk-animation-slide-bottom-small; target: .card; delay: 200">
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6 mt- ">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="sm:col-span-1 text-center">
                <div className="relative w-32 h-32 mx-auto">
                  {profile?.profile_photo ? (
                    <img 
                      src={profile.profile_photo} 
                      alt={`${profile.name}'s profile`}
                      className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 ${profile?.profile_photo ? 'hidden' : 'flex'}`}
                  >
                    <span uk-icon="icon: user; ratio: 2" className="text-white"></span>
                  </div>
                </div>
                {profile?.profile_photo && (
                  <div className="mt-2 flex items-center justify-center gap-1 text-sm text-blue-600">
                    <span uk-icon="icon: check; ratio: 0.8"></span>
                    Profile Photo
                  </div>
                )}
              </div>
              
              <div className="sm:col-span-3">
                <h2 className="text-2xl font-semibold text-gray-900">{profile?.name || 'No name provided'}</h2>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Account Information</h4>
                    <p className="text-gray-600 mt-2 flex items-center">
                      <span uk-icon="icon: mail" className="mr-2 text-blue-600"></span>
                      {profile?.email}
                    </p>
                    <p className="text-gray-600 mt-2 flex items-center">
                      <span uk-icon="icon: receiver" className="mr-2 text-blue-600"></span>
                      {profile?.phone || 'No phone number'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Account Type</h4>
                    <p className="text-gray-600 mt-2 flex items-center">
                      <span uk-icon="icon: user" className="mr-2 text-blue-600"></span>
                      {profile?.account_type || 'N/A'}
                    </p>
                    <p className="text-gray-600 mt-2 flex items-center">
                      <span uk-icon="icon: lock" className="mr-2 text-blue-600"></span>
                      {profile?.role || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/Profile_Edit/${profile?.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all"
                  >
                    <span uk-icon="icon: pencil" className="mr-2"></span>
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;