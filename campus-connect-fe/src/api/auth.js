// src/api/auth.js
import axios from 'axios'; // We'll use Axios for HTTP requests

const API_BASE_URL = 'http://localhost:8081/api/auth'; // Replace with your Spring Boot backend URL

// Function to handle API errors consistently
const handleApiError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("API Error - Data:", error.response.data);
        console.error("API Error - Status:", error.response.status);
        console.error("API Error - Headers:", error.response.headers);
        if (error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(`Server responded with status ${error.response.status}`);
    } else if (error.request) {
        // The request was made but no response was received
        console.error("API Error - No response received:", error.request);
        throw new Error("No response from server. Please check your network connection.");
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error("API Error - Request setup:", error.message);
        throw new Error(`Error setting up the request: ${error.message}`);
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        return response.data; // This should contain { token: "your.jwt.token" }
    } catch (error) {
        handleApiError(error);
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response.data; // This should also contain { token: "your.jwt.token" }
    } catch (error) {
        handleApiError(error);
    }
};

export const getToken = () => {
    return localStorage.getItem('jwtToken'); // Or however you store your token
};

export const getRole = () => {
    // You'll need to decode the token to get the role or store it separately
    // For simplicity, let's assume it's stored in localStorage as 'userRole'
    return localStorage.getItem('userRole');
};

// Example of how you might set it after login:
export const setAuthData = (token, role) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userRole', role);
};

export const clearAuthData = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
};