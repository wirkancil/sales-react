import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    console.log("ProtectedRoute: user is", user);

    if (!user) {
        console.log("ProtectedRoute: Redirecting to login");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
