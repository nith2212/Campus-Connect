// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode library
import { loginUser, registerUser } from '../api/auth'; // We will create this file next

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Updated to also store 'name'
    const [user, setUser] = useState(null); // Stores { name, email, role, userId }
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to decode and set user details from JWT
    const decodeToken = useCallback((jwtToken) => {
        try {
            const decoded = jwtDecode(jwtToken);
            // --- IMPORTANT: ASSUMES YOUR SPRING BOOT JWT INCLUDES A 'name' CLAIM ---
            // If your backend JWT does NOT include 'name', this will be undefined.
            // You might need to adjust your Spring Boot security configuration (e.g., JwtService)
            // to add the user's name to the claims when generating the token.
            // Example payload: { email: "...", role: "...", userId: "...", name: "John Doe" }
            if (decoded && decoded.email && decoded.role && decoded.userId) {
                setUser({
                    name: decoded.name || decoded.email.split('@')[0], // Fallback to part of email if name isn't present
                    email: decoded.email,
                    role: decoded.role,
                    userId: decoded.userId
                });
            } else {
                console.error("JWT token missing expected claims (email, role, userId, name):", decoded);
                setUser(null);
            }
        } catch (err) {
            console.error("Failed to decode JWT token:", err);
            setUser(null);
            setToken(null);
            localStorage.removeItem('jwtToken');
        }
    }, []);

    // Effect to initialize auth state from localStorage
    useEffect(() => {
        if (token) {
            decodeToken(token);
        }
        setLoading(false);
    }, [token, decodeToken]);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginUser(credentials);
            if (response.token) {
                localStorage.setItem('jwtToken', response.token);
                setToken(response.token);
                decodeToken(response.token);
                return true; // Indicate success
            }
            return false; // Indicate failure
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Login failed");
            setLoading(false);
            return false; // Indicate failure
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await registerUser(userData);
            if (response.token) {
                localStorage.setItem('jwtToken', response.token);
                setToken(response.token);
                decodeToken(response.token);
                return true; // Indicate success
            }
            return false; // Indicate failure
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "Registration failed");
            setLoading(false);
            return false; // Indicate failure
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('jwtToken');
    };

    const isAuthenticated = !!token && !!user;
    const isAdmin = isAuthenticated && user?.role === 'ADMIN';
    const isFaculty = isAuthenticated && user?.role === 'FACULTY';
    const isStudent = isAuthenticated && user?.role === 'STUDENT';

    const value = {
        user,
        token,
        isAuthenticated,
        isAdmin,
        isFaculty,
        isStudent,
        loading,
        error,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div>Loading authentication...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};