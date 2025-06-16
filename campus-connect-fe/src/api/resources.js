// src/api/resources.js
import axios from './axiosConfig'; // Ensure this points to your configured Axios instance
import { getToken } from '../api/auth'; // Assuming you have a utility to get the JWT token

const API_BASE_URL = 'http://localhost:8084/api/resources'; // Matches your backend's port and base path

const resourcesApi = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor to add the Authorization header
resourcesApi.interceptors.request.use(
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

export const getResourcesBySubject = async (subject) => {
    try {
        const response = await resourcesApi.get('', {
            params: { subject },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadResource = async (resourceData) => {
    try {
        const response = await resourcesApi.post('', resourceData);
        return response.data;
    } catch (error) {
        throw error;
    }
};