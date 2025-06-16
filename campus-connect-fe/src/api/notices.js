// src/api/notices.js
import axios from './axiosConfig';
import { getToken } from '../api/auth';

const API_BASE_URL = 'http://localhost:8083/api/notices';

const noticesApi = axios.create({
    baseURL: API_BASE_URL,
});

noticesApi.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getNoticesByDepartmentAndYear = async (department, year) => {
    try {
        const response = await noticesApi.get('', {
            params: { department, year },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching notices:', error);
        throw error;
    }
};

export const postNotice = async (noticeData) => {
    try {
        const response = await noticesApi.post('', noticeData);
        return response.data;
    } catch (error) {
        console.error('Error posting notice:', error);
        throw error;
    }
};

// Removed deleteNotice and updateNotice exports:
// export const deleteNotice = async (id) => { /* ... */ };
// export const updateNotice = async (id, noticeData) => { /* ... */ };