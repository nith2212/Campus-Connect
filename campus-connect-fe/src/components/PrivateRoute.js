// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication...</div>; // Or a spinner component
    }

    if (!isAuthenticated) {
        // Not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Authenticated but does not have the required role
        return <Navigate to="/unauthorized" replace />; // Create an Unauthorized component
    }

    return <Outlet />; // Render the child routes
};

export default PrivateRoute;