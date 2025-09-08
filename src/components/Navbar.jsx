// import React, { useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Adjust path as needed

// import { baseURL } from '../utils/environments';

// const Navbar = () => {
//   const { user, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();   
//   useEffect(() => {
//     if (window.UIkit) {
//       window.UIkit.update();
//     }    
//   }, []); 

//   const handleLogout = () => {
//     logout(); // This should clear user data and redirect
//     // You might also want to clear localStorage
//     navigate("/Login")
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   };

//   const closeOffcanvas = () => {
//     if (window.UIkit && window.UIkit.offcanvas) {
//       window.UIkit.offcanvas('#offcanvas-nav').hide();
//     }
//   };

//   let navLinks;
//   if (
//     isAuthenticated &&
//     user?.account_type === "car_owner" &&
//     user?.role === "car_owner"
//   ) {

//     navLinks = (
//       <>
//                     <li>
//                       <Link 
//                         to="/Customer_dashboard" 
//                         style={{ 
//                           color: '#e2e8f0', 
//                           fontWeight: '600',
//                           padding: '10px 16px',
//                           borderRadius: '10px',
//                           transition: 'all 0.3s ease',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
//                           e.currentTarget.style.color = '#60a5fa';
//                           e.currentTarget.style.transform = 'translateY(-2px)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = 'transparent';
//                           e.currentTarget.style.color = '#e2e8f0';
//                           e.currentTarget.style.transform = 'translateY(0)';
//                         }}
//                       >
//                         <span data-uk-icon="icon: home"></span>
//                         Home
//                       </Link>
//                     </li>
 
//                     <li>
//                       <Link 
//                         to="/MapView" 
//                         style={{ 
//                           color: '#e2e8f0', 
//                           fontWeight: '600',
//                           padding: '10px 16px',
//                           borderRadius: '10px',
//                           transition: 'all 0.3s ease',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.1)';
//                           e.currentTarget.style.color = '#ec4899';
//                           e.currentTarget.style.transform = 'translateY(-2px)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = 'transparent';
//                           e.currentTarget.style.color = '#e2e8f0';
//                           e.currentTarget.style.transform = 'translateY(0)';
//                         }}
//                       >
//                         <span data-uk-icon="icon: heart"></span>
//                         Maps
//                       </Link>
//                     </li>

//                     <li>
//                       <Link 
//                         to="/Booking_display" 
//                         style={{ 
//                           color: '#e2e8f0', 
//                           fontWeight: '600',
//                           padding: '10px 16px',
//                           borderRadius: '10px',
//                           transition: 'all 0.3s ease',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
//                           e.currentTarget.style.color = '#10b981';
//                           e.currentTarget.style.transform = 'translateY(-2px)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = 'transparent';
//                           e.currentTarget.style.color = '#e2e8f0';
//                           e.currentTarget.style.transform = 'translateY(0)';
//                         }}
//                       >
//                         <span data-uk-icon="icon: calendar"></span>
//                         Bookings
//                       </Link>
//                     </li>

//                     <li> 
//                       <Link 
//                         to={`/Profile/${user.id}`} 
//                         style={{ 
//                           color: '#e2e8f0',  
//                           fontWeight: '600',
//                           padding: '10px 16px',
//                           borderRadius: '10px',
//                           transition: 'all 0.3s ease',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
//                           e.currentTarget.style.color = '#f59e0b';
//                           e.currentTarget.style.transform = 'translateY(-2px)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = 'transparent';
//                           e.currentTarget.style.color = '#e2e8f0';
//                           e.currentTarget.style.transform = 'translateY(0)';
//                         }}
//                       >
//                         <span data-uk-icon="icon: user"></span>
//                         Profile
//                       </Link>
//                     </li>
                    
//                     <li>
//                       <button 
//                         onClick={handleLogout}
//                         style={{ 
//                           background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
//                           border: 'none', 
//                           color: 'white', 
//                           fontWeight: '600',
//                           cursor: 'pointer',
//                           fontSize: 'inherit',
//                           fontFamily: 'inherit',
//                           padding: '10px 18px',
//                           borderRadius: '10px',
//                           transition: 'all 0.3s ease',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px',
//                           boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.transform = 'translateY(-2px)';
//                           e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.transform = 'translateY(0)';
//                           e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
//                         }}
//                       >
//                         <span data-uk-icon="icon: sign-out"></span>
//                         Logout
//                       </button>
//                     </li>
//                   </>
//     )

//   } else if(isAuthenticated && user.account_type === 'car_wash' && user.role === 'business_owner')
// {
//    navLinks = (
//     <>
//                     <li>
//                       <Link 
//                         to={`/CarwashDashboard/${user.id}`} 
//                         style={{ 
//                           color: '#e2e8f0', 
//                           fontWeight: '600',
//                           padding: '10px 16px',
//                           borderRadius: '10px',
//                           transition: 'all 0.3s ease',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
//                           e.currentTarget.style.color = '#60a5fa';
//                           e.currentTarget.style.transform = 'translateY(-2px)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = 'transparent';
//                           e.currentTarget.style.color = '#e2e8f0';
//                           e.currentTarget.style.transform = 'translateY(0)';
//                         }}
//                       >
//                         <span data-uk-icon="icon: home"></span>
//                         Home
//                       </Link>
//                     </li>

//                     <li> 
//                       <Link 
//                         to={`/Profile/${user.id}`} 
//                         style={{ 
//                           color: '#e2e8f0',  
//                           fontWeight: '600',
//                           padding: '10px 16px',
//                           borderRadius: '10px',
//                           transition: 'all 0.3s ease',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
//                           e.currentTarget.style.color = '#f59e0b';
//                           e.currentTarget.style.transform = 'translateY(-2px)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = 'transparent';
//                           e.currentTarget.style.color = '#e2e8f0';
//                           e.currentTarget.style.transform = 'translateY(0)';
//                         }}
//                       >
//                         <span data-uk-icon="icon: user"></span>
//                         Profile
//                       </Link>
//                     </li>
                    
//                     <li>
//                       <button 
//                         onClick={handleLogout}
//                         style={{ 
//                           background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
//                           border: 'none', 
//                           color: 'white', 
//                           fontWeight: '600',
//                           cursor: 'pointer',
//                           fontSize: 'inherit',
//                           fontFamily: 'inherit',
//                           padding: '10px 18px',
//                           borderRadius: '10px',
//                           transition: 'all 0.3s ease',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px',
//                           boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.transform = 'translateY(-2px)';
//                           e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.transform = 'translateY(0)';
//                           e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
//                         }}
//                       >
//                         <span data-uk-icon="icon: sign-out"></span>
//                         Logout
//                       </button>
//                     </li>
//                   </>
//    )
// } else {
//      navLinks = (
//       <>
//                       <li>
//                         <Link 
//                           to='/' 
//                           style={{ 
//                             color: '#e2e8f0', 
//                             fontWeight: '600',
//                             padding: '10px 16px',
//                             borderRadius: '10px',
//                             transition: 'all 0.3s ease',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '6px'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
//                             e.currentTarget.style.color = '#60a5fa';
//                             e.currentTarget.style.transform = 'translateY(-2px)';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.backgroundColor = 'transparent';
//                             e.currentTarget.style.color = '#e2e8f0';
//                             e.currentTarget.style.transform = 'translateY(0)';
//                           }}
//                         >
//                           <span data-uk-icon="icon: home"></span>
//                           Home
//                         </Link>
//                       </li>
  
//                       <li>
//                         <button 
//                           onClick={handleLogout}
//                           style={{ 
//                             background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
//                             border: 'none', 
//                             color: 'white', 
//                             fontWeight: '600',
//                             cursor: 'pointer',
//                             fontSize: 'inherit',
//                             fontFamily: 'inherit',
//                             padding: '10px 18px',
//                             borderRadius: '10px',
//                             transition: 'all 0.3s ease',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '6px',
//                             boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.transform = 'translateY(-2px)';
//                             e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.transform = 'translateY(0)';
//                             e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
//                           }}
//                         >
//                           <span data-uk-icon="icon: sign-out"></span>
//                           Login
//                         </button>
//                       </li>
//                     </>
//      )
// }

//   return (
//     <>
//       <nav
//         className="uk-navbar-container"
//         style={{ 
//           backgroundColor: '#1e293b', 
//           padding: '15px 0',
//           borderBottom: '1px solid #334155',
//           boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
//         }}
//       >
//         <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
//           <div className="uk-navbar" uk-navbar="true">
//             <div className="uk-navbar-left">
//               <Link to="/" className="uk-navbar-item" style={{ paddingLeft: '0' }}>
//                 <h1
//                   style={{
//                     fontWeight: '800',
//                     fontSize: '1.8rem',
//                     margin: '0',
//                     fontFamily: 'Arial, sans-serif',
//                     letterSpacing: '-0.5px',
//                     background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent',
//                     backgroundClip: 'text',
//                     textShadow: '0 0 30px rgba(96, 165, 250, 0.5)'
//                   }}
//                 >
//                   <span>Foam</span>
//                   <span style={{ color: '#10b981' }}>UP</span>
//                 </h1>
//               </Link> 
//             </div>

//             {/* Mobile Toggle Button */}
//             <div className="uk-navbar-right uk-hidden@s">
//               <a 
//                 className="uk-navbar-toggle" 
//                 uk-navbar-toggle-icon="true"
//                 href="#offcanvas-nav" 
//                 uk-toggle="target: #offcanvas-nav"
//                 aria-label="Open navigation menu"
//                 style={{ 
//                   display: 'flex', 
//                   alignItems: 'center', 
//                   justifyContent: 'center',
//                   width: '45px',
//                   height: '45px',
//                   borderRadius: '12px',
//                   backgroundColor: 'rgba(59, 130, 246, 0.1)',
//                   border: '1px solid rgba(59, 130, 246, 0.2)',
//                   color: '#60a5fa',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
//                   e.currentTarget.style.transform = 'scale(1.05)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
//                   e.currentTarget.style.transform = 'scale(1)';
//                 }}
//               >
//                 <span></span>
//               </a>
//             </div>
          
//             {/* Desktop Navigation */}
//             <div className="uk-navbar-right uk-visible@s">
//               <ul className="uk-navbar-nav" style={{ gap: '8px' }}>
//                   {navLinks}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </nav>
    
//       {/* Mobile Off-canvas Navigation */}
//       <div id="offcanvas-nav" uk-offcanvas="overlay: true; mode: slide">
//         <div 
//           className="uk-offcanvas-bar" 
//           style={{ 
//             backgroundColor: '#1e293b',
//             borderRight: '1px solid #334155'
//           }}
//         >
//           <button 
//             className="uk-offcanvas-close" 
//             type="button" 
//             uk-close="true" 
//             aria-label="Close navigation menu"
//             style={{ 
//               color: '#e2e8f0',
//               fontSize: '1.5rem'
//             }}
//           ></button>

//           <div style={{ marginTop: '40px' }}>
//             {/* Brand in mobile menu */}
//             <div style={{ marginBottom: '30px', paddingLeft: '20px' }}>
//               <h2
//                 style={{
//                   fontWeight: '800',
//                   fontSize: '1.5rem',
//                   margin: '0',
//                   fontFamily: 'Arial, sans-serif',
//                   letterSpacing: '-0.5px',
//                   background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent',
//                   backgroundClip: 'text'
//                 }}
//               >
//                 <span>Foam</span>
//                 <span style={{ color: '#10b981' }}>UP</span>
//               </h2>
//             </div>

//             <ul className="uk-nav uk-nav-default">
//               {isAuthenticated ? (
//                 // Mobile menu for logged in users
//                 <>
//                   <li>
//                     <Link 
//                       to="/Customer_dashboard" 
//                       onClick={closeOffcanvas}
//                       style={{ 
//                         fontSize: '18px', 
//                         padding: '15px 20px',
//                         color: '#e2e8f0',
//                         borderRadius: '8px',
//                         margin: '0 10px',
//                         transition: 'all 0.3s ease',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
//                         e.currentTarget.style.color = '#60a5fa';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#e2e8f0';
//                       }}
//                     >
//                       <span data-uk-icon="icon: home"></span>
//                       Home
//                     </Link>
//                   </li>

//                   <li>
//                     <Link 
//                       to="/favourites" 
//                       onClick={closeOffcanvas}
//                       style={{ 
//                         fontSize: '18px', 
//                         padding: '15px 20px',
//                         color: '#e2e8f0',
//                         borderRadius: '8px',
//                         margin: '0 10px',
//                         transition: 'all 0.3s ease',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.1)';
//                         e.currentTarget.style.color = '#ec4899';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#e2e8f0';
//                       }}
//                     >
//                       <span data-uk-icon="icon: heart"></span>
//                       Favourites
//                     </Link>
//                   </li>

//                   <li>
//                     <Link 
//                       to="/bookings" 
//                       onClick={closeOffcanvas}
//                       style={{ 
//                         fontSize: '18px', 
//                         padding: '15px 20px',
//                         color: '#e2e8f0',
//                         borderRadius: '8px',
//                         margin: '0 10px',
//                         transition: 'all 0.3s ease',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
//                         e.currentTarget.style.color = '#10b981';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#e2e8f0';
//                       }}
//                     >
//                       <span data-uk-icon="icon: calendar"></span>
//                       Bookings
//                     </Link>
//                   </li>

//                   <li>
//                     <Link 
//                       to="/profile" 
//                       onClick={closeOffcanvas}
//                       style={{ 
//                         fontSize: '18px', 
//                         padding: '15px 20px',
//                         color: '#e2e8f0',
//                         borderRadius: '8px',
//                         margin: '0 10px',
//                         transition: 'all 0.3s ease',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
//                         e.currentTarget.style.color = '#f59e0b';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#e2e8f0';
//                       }}
//                     >
//                       <span data-uk-icon="icon: user"></span>
//                       Profile
//                     </Link>
//                   </li>

//                   <li style={{ marginTop: '20px' }}>
//                     <button 
//                       onClick={() => {
//                         handleLogout();
//                         closeOffcanvas();
//                       }}
//                       style={{ 
//                         background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
//                         border: 'none', 
//                         fontSize: '18px', 
//                         padding: '15px 20px',
//                         cursor: 'pointer',
//                         textAlign: 'left',
//                         width: 'calc(100% - 20px)',
//                         margin: '0 10px',
//                         borderRadius: '8px',
//                         color: 'white',
//                         fontWeight: '600',
//                         transition: 'all 0.3s ease',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.transform = 'translateX(5px)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.transform = 'translateX(0)';
//                       }}
//                     >
//                       <span data-uk-icon="icon: sign-out"></span>
//                       Logout
//                     </button>
//                   </li>
//                 </>
//               ) : (
//                 // Mobile menu for guests
//                 <>
//                   <li>
//                     <Link 
//                       to="/" 
//                       onClick={closeOffcanvas}
//                       style={{ 
//                         fontSize: '18px', 
//                         padding: '15px 20px',
//                         color: '#e2e8f0',
//                         borderRadius: '8px',
//                         margin: '0 10px',
//                         transition: 'all 0.3s ease',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
//                         e.currentTarget.style.color = '#60a5fa';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#e2e8f0';
//                       }}
//                     >
//                       <span data-uk-icon="icon: home"></span>
//                       Home
//                     </Link>
//                   </li>
//                   <li>
//                     <Link 
//                       to="/Login" 
//                       onClick={closeOffcanvas}
//                       style={{ 
//                         fontSize: '18px', 
//                         padding: '15px 20px',
//                         color: '#e2e8f0',
//                         borderRadius: '8px',
//                         margin: '0 10px',
//                         transition: 'all 0.3s ease',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
//                         e.currentTarget.style.color = '#10b981';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#e2e8f0';
//                       }}
//                     >
//                       <span data-uk-icon="icon: sign-in"></span>
//                       Sign In
//                     </Link>
//                   </li>
//                   <li>
//                     <Link 
//                       to="/signup" 
//                       onClick={closeOffcanvas}
//                       style={{ 
//                         fontSize: '18px', 
//                         padding: '15px 20px',
//                         background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
//                         color: 'white',
//                         borderRadius: '8px',
//                         margin: '0 10px',
//                         transition: 'all 0.3s ease',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         fontWeight: '600',
//                         textDecoration: 'none',
//                         boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.transform = 'translateX(5px)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.transform = 'translateX(0)';
//                       }}
//                     >
//                       <span data-uk-icon="icon: user"></span>
//                       Sign Up
//                     </Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };


// export default Navbar; 



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/Login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // === NAV LINKS ===
  let navLinks;
  if (isAuthenticated && user?.account_type === "car_owner" && user?.role === "car_owner") {
    navLinks = (
      <>
        <li>
          <Link 
            to="/Customer_dashboard" 
            className="group relative px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-slate-50"
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </li>
        <li>
          <Link 
            to="/MapView" 
            className="group relative px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-slate-50"
          >
            <span className="relative z-10">Find Services</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </li>
        <li>
          <Link 
            to="/Booking_display" 
            className="group relative px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-slate-50"
          >
            <span className="relative z-10">My Bookings</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </li>
        <li>
          <Link 
            to={`/Profile/${user.id}`} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-slate-50"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl font-medium text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
          >
            Sign Out
          </button>
        </li>
      </>
    );
  } else if (isAuthenticated && user.account_type === "car_wash" && user.role === "business_owner") {
    navLinks = (
      <>
        <li>
          <Link 
            to={`/CarwashDashboard/${user.id}`} 
            className="group relative px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-slate-50"
          >
            <span className="relative z-10">Dashboard</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </li>
        <li>
          <Link 
            to={`/Profile/${user.id}`} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-slate-50"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.business_name?.charAt(0) || user?.name?.charAt(0) || 'B'}
            </div>
            <span>Business Profile</span>
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl font-medium text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
          >
            Sign Out
          </button>
        </li>
      </>
    );
  } else {
    navLinks = (
      <>
        <li>
          <Link
            to="/"
            className="px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-slate-50"
          >
            Home
          </Link>
        </li>
        <li className="py-4">
          <Link
            to="/Login"
            className="px-6 py-2.5 rounded-xl font-medium text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
          >
            Sign In
          </Link>
        </li>
        <li>
          <Link
            to="/Signup"
           className="px-6 py-2.5 rounded-xl font-medium text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
          >
            Get Started
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      {/* Google Fonts Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Story+Script&family=Archivo+Black:wght@400&display=swap');
          .font-story { font-family: 'Story Script', cursive; }
          .font-archivo { font-family: 'Archivo Black', sans-serif; }
        `}
      </style>
      
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 fixed w-full z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <span className="font-story text-3xl text-slate-800 leading-none">Foam</span>
                <span className="font-archivo text-sm text-blue-600 ml-1">UP</span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center w-96 max-w-md">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search car wash services..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl text-slate-700 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <ul className="flex items-center gap-1">{navLinks}</ul>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-slate-200">
              {/* Mobile Search */}
              <div className="mt-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search car wash services..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl text-slate-700 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
                  />
                </div>
              </div>
              
              {/* Mobile Navigation */}
              <ul className="flex flex-col gap-2">{navLinks}</ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;