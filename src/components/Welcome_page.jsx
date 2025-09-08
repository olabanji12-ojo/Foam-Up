import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <>
      {/* Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Story+Script&family=Archivo+Black:wght@400&family=Fredoka:wght@300;400;500;600&display=swap');
          .font-story { font-family: 'Story Script', cursive; }
          .font-archivo { font-family: 'Archivo Black', sans-serif; }
          .font-fredoka { font-family: 'Fredoka', sans-serif; }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
                Your Car Deserves a <span className="text-blue-600">Spotless Shine</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 font-fredoka">
                Book premium car wash services instantly or grow your business by connecting with customers who need your expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/signup?type=owner"
                  className="px-8 py-4 rounded-2xl font-fredoka font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  Find a Wash Now
                </Link>
                <Link
                  to="/signup?type=provider"
                  className="px-8 py-4 rounded-2xl font-fredoka font-semibold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md transition-all duration-300 text-center"
                >
                  List Your Business
                </Link>
              </div>
            </div>

            {/* Right Content - Illustration */}
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-lg">
                <div className="aspect-square bg-white rounded-2xl flex items-center justify-center p-6 shadow-inner">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-fredoka text-xl font-semibold text-slate-800 mb-2">Foam UP</h3>
                    <p className="text-slate-600 font-fredoka">Premium Car Care Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-6">
            <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-center text-slate-800 mb-16">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center p-6 bg-slate-50 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-fredoka font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-fredoka text-xl font-semibold text-slate-800 mb-4">Choose Your Service</h3>
                <p className="text-slate-600 font-fredoka">Select from various premium car wash packages tailored to your needs.</p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center p-6 bg-slate-50 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-fredoka font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-fredoka text-xl font-semibold text-slate-800 mb-4">Book & Pay Online</h3>
                <p className="text-slate-600 font-fredoka">Securely book your slot and make payment through our safe platform.</p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center p-6 bg-slate-50 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-fredoka font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-fredoka text-xl font-semibold text-slate-800 mb-4">Enjoy a Clean Car</h3>
                <p className="text-slate-600 font-fredoka">Relax while professionals make your car spotless at your chosen time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-blue-100 text-xl mb-10  mx-auto text-center font-fredoka">
  Join thousands of satisfied car owners and business providers using Foam UP.
</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup?type=owner"
                className="px-8 py-4 rounded-2xl font-fredoka font-semibold text-blue-600 bg-white hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign Up as Customer
              </Link>
              <Link
                to="/signup?type=provider"
                className="px-8 py-4 rounded-2xl font-fredoka font-semibold text-white bg-blue-800 hover:bg-blue-900 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Register Your Business
              </Link>
            </div>
          </div>
        </section>
        
      </div>
    </>
  );
};

export default WelcomePage;