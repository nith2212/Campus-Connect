// src/api/admin.js
import axios from './axiosConfig'; // Ensure this points to your configured Axios instance
import { getToken } from '../api/auth'; // Assuming you have a utility to get the JWT token

const API_BASE_URL = 'http://localhost:8085/api/admin'; // Matches your backend's port and base path

const adminApi = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor to add the Authorization header
adminApi.interceptors.request.use(
    (config) => {
        const token = getToken(); // Get your JWT token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getAllUsers = async () => {
    try {
        const response = await adminApi.get('/users');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await adminApi.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserRole = async (userId, newRole) => {
    try {
        // Ensure newRole is a valid string, e.g., 'STUDENT', 'FACULTY', 'ADMIN'
        const response = await adminApi.put(`/users/${userId}/role`, { role: newRole });
        return response.data;
    } catch (error) {
        throw error;
    }
};