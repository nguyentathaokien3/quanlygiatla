import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5034/api',
});

// Tự động đính kèm Token vào mọi request nếu có
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;