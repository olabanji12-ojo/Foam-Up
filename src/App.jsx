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



const App = () => {
  return (

    <>
    {/* <Sidebar/>  */}
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Signup />} /> 
        <Route path="/Login" element={<Login />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/Car_formPage" element={<Car_formPage />} />
        <Route path="/Car_formPage/:id" element={<Car_formPage />} />
        <Route path="/My_Cars" element={<My_Cars />} />

        <Route path="/Profile_Edit/:id" element={<Profile_Edit />} />

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
