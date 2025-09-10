import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UIkit from 'uikit';
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/js/uikit.min.js';

const Customer_dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleSearchCarwash = async () => {
    setIsGettingLocation(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });
      const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log("✅ Location found:", userLocation);
      // Navigate to map with location data
      navigate("/CarWashFinderMap", { 
        state: { 
          userLocation,
          autoSearch: true 
        } 
      });
    } catch (error) {
      console.error("❌ Location access denied:", error);
      if (error.code === 1) {
        alert("Please enable location access to find nearby car washes");
      } else {
        alert("Could not get your location. Please try again.");
      }
      setIsGettingLocation(false);
    }
  };

  return (
    <>
      {/* Consistent Font Setup */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600&display=swap');
          .font-fredoka { font-family: 'Fredoka', sans-serif; }
        `}
      </style>

      {/* Main Container with Welcome Page Gradient */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-fredoka pt-25">

        {/* Hero Welcome Section */}

        <section className="container mx-auto px-6 py-12 text-center"
          uk-scrollspy="target: > div; cls: uk-animation-slide-top-medium; delay: 100; repeat: true"
        >

          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 ">
            Welcome back, <span className="text-blue-600">{user?.name || 'Car Owner'}</span>!
          </h1>
          <p className="text-xl text-slate-600 text-center">
            Keep your vehicle sparkling clean with FoamUP
          </p>
        </section>

        {/* Quick Actions - Main Cards */}
        <section className="container mx-auto px-6 pb-16"
          uk-scrollspy="cls: uk-animation-slide-top-medium; repeat: true"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
             uk-scrollspy="target: > div; cls: uk-animation-slide-bottom-medium; delay: 200; repeat: true"
          >

            {/* Find Car Wash Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">Find Car Wash</h3>
              <p className="text-slate-600 mb-6">
                Discover the best car wash services near you
              </p>
              <button
                onClick={handleSearchCarwash}
                disabled={isGettingLocation}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isGettingLocation ? (
                  <>⏳ Getting your location...</>
                ) : (
                  <>📍 Search Nearby Car Washes</>
                )}
              </button>
            </div>

            {/* Add Vehicle Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">Add Vehicle</h3>
              <p className="text-slate-600 mb-6">
                Register your cars to track services and bookings
              </p>
              <Link
                to="/Car_formPage"
                className="block w-full py-4 px-6 rounded-2xl font-semibold text-center border-2 border-emerald-500 text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-600 hover:text-white hover:border-transparent shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Add Car
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Overview Section */}
        <section className="container mx-auto px-6 pb-20"
         uk-scrollspy="target: > h2, > p, > div; cls: uk-animation-slide-bottom-medium; delay: 100; repeat: true"
        >
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Your Dashboard Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* My Vehicles Card */}
            <Link 
              to="/My_Cars" 
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-100 text-center group hover:-translate-y-1 transition-transform duration-300 no-underline"
            >
              <div className="w-14 h-14 mx-auto bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors duration-300">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">My Vehicles</h4>
              <p className="text-sm text-slate-500">Manage your cars</p>
            </Link>

            {/* Bookings Card */}
            <Link 
              to="/Booking" 
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-100 text-center group hover:-translate-y-1 transition-transform duration-300 no-underline"
            >
              <div className="w-14 h-14 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">Bookings</h4>
              <p className="text-sm text-slate-500">View appointments</p>
            </Link>

            {/* Favourites Card */}
            <div 
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-100 text-center group hover:-translate-y-1 transition-transform duration-300 cursor-pointer" 
              onClick={() => {/* Navigate to favourites */}}
            >
              <div className="w-14 h-14 mx-auto bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors duration-300">
                <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">Favourites</h4>
              <p className="text-sm text-slate-500">Saved car washes</p>
            </div>

          </div>
        </section>
             {/* Footer Section */}
             <footer className="bg-slate-800 text-white pt-12 pb-8 mt-auto"
              uk-scrollspy="cls: uk-animation-slide-left-medium; delay: 300; repeat: true"
             >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Brand Column */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold">FoamUP</span>
                </div>
                <p className="text-slate-300 text-sm mb-4">
                  Premium car care solutions at your fingertips. Book instantly, shine constantly.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div
                uk-scrollspy="cls: uk-animation-slide-right-medium; delay: 300; repeat: true"
              >
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm">Home</Link></li>
                  <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm">About Us</Link></li>
                  <li><Link to="/services" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm">Services</Link></li>
                  <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm">Contact</Link></li>
                </ul>
              </div>

              {/* Customer Support */}
              <div 
                 uk-scrollspy="cls: uk-animation-slide-right-medium; delay: 400; repeat: true"
              >
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><Link to="/help" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm">Help Center</Link></li>
                  <li><Link to="/faq" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm">FAQ</Link></li>
                  <li><Link to="/privacy" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm">Terms of Service</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div
                 uk-scrollspy="cls: uk-animation-slide-right-medium; delay: 500; repeat: true"
              >
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>📧 support@foamup.com</p>
                  <p>📞 +1 (555) 123-4567</p>
                  <p>📍 123 Car Care Ave, City</p>
                </div>
              </div>

            </div>

            {/* Bottom Copyright Bar */}
            <div className="border-t border-slate-700 mt-8 pt-6 text-center">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} FoamUP. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div> {/* This closes the main div */}
    </>
  );
};

export default Customer_dashboard;