import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Customer_dashboard from './components/Customer_dashboard';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Car_formPage from './components/Car_formPage';
import My_Cars from './components/My_Cars';
import Profile from './components/Profile';  
import ErrorBoundary from './context/ErrorBoundary';
import Profile_Edit from './components/Profile_Edit';
import Booking from './components/Booking';
import Booking_display from './components/Booking_display';

import MapView from './MapView/MapView';
 
import CarWashFinderMap from './components/CarWashFinderMap';
import Welcome_page from './components/Welcome_page';
import CarwashDashboard from './CarWash/CarwashDashboard';
import PostOnboarding from './CarWash/PostOnboarding';
import AuthCallback from './components/google_redirect';
import CallbackPage from './components/CallbackPage';




const App = () => {
  return (

    <>
    {/* <Sidebar/>  */}
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Welcome_page />} /> 
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/Car_formPage" element={<Car_formPage />} />
        <Route path="/Car_formPage/:id" element={<Car_formPage />} />
        <Route path="/My_Cars" element={<My_Cars />} />

        <Route path="/Profile_Edit/:id" element={<Profile_Edit />} />
        <Route path="/Booking" element={<Booking />} /> 
        <Route path="/Booking_display" element={<Booking_display />} /> 
        <Route path="/MapView" element={<MapView />} /> 
        
        <Route path="/CarWashFinderMap" element={<CarWashFinderMap />} /> 
        <Route path="/CarwashDashboard/:id" element={<CarwashDashboard />} /> 
        <Route path="/CallbackPage" element={<CallbackPage />} />


        <Route path="/PostOnboarding/:id" element={<PostOnboarding />} /> 

        <Route path="/api/callback" element={<AuthCallback />} />

        <Route path="/Profile/:id" element={
  
          <ErrorBoundary> 
          <Profile />
          </ErrorBoundary>

          } />
       
        <Route path="/Customer_dashboard" element={
          <PrivateRoute>
          <Customer_dashboard/>  
          </PrivateRoute>} 
          />

      </Routes>

    </>
  )
};


export default App;
