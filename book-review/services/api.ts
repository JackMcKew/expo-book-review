// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
