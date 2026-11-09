import axios from 'axios';

// Xác định baseURL linh hoạt giữa môi trường Local và Production (Render)
const getBaseURL = () => {
  // Nếu đang chạy trên môi trường production/render hoặc bạn muốn dùng chung domain
  if (import.meta.env && import.meta.env.PROD) {
    return '/api';
  }
  // Mặc định cho môi trường phát triển local (ASP.NET Backend đang chạy port 8080)
  return 'http://localhost:8080/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
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