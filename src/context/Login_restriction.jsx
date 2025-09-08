// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login_restriction = ({allowedTypes, children}) => {
    const accountType = localStorage.getItem('accountType')

    if (!allowedTypes.includes(accountType)){

        return(
            <div>
                
                Unauthorized Access

            </div>
        )
        

    }

    return children
}

export default Login_restriction

