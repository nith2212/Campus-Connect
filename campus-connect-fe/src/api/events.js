// src/api/events.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api/events'; // Match your event module's port

// Helper to get authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

// Function to handle API errors consistently
const handleApiError = (error) => {
    if (error.response) {
        console.error("API Error - Data:", error.response.data);
        console.error("API Error - Status:", error.response.status);
        if (error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(`Server responded with status ${error.response.status}`);
    } else if (error.request) {
        console.error("API Error - No response received:", error.request);
        throw new Error("No response from server. Please check your network connection.");
    } else {
        console.error("API Error - Request setup:", error.message);
        throw new Error(`Error setting up the request: ${error.message}`);
    }
};

/**
 * Fetches all events from the backend.
 * Accessible by FACULTY, STUDENT, ADMIN.
 */
export const getAllEvents = async () => {
    try {
        const response = await axios.get(API_BASE_URL, getAuthHeaders());
        return response.data; // List of EventResponse DTOs
    } catch (error) {
        handleApiError(error);
    }
};

/**
 * Creates a new event.
 * Accessible only by FACULTY.
 * @param {object} eventData - { title, description, date (string 'YYYY-MM-DD') }
 */
export const createEvent = async (eventData) => {
    try {
        const response = await axios.post(API_BASE_URL, eventData, getAuthHeaders());
        return response.data; // Should return "Event created successfully"
    } catch (error) {
        handleApiError(error);
    }
};