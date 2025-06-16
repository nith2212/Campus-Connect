// src/api/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    // You can add global configurations here if needed
});

export default instance;