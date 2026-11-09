import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
    setRole('user');
    setShowLoginModal(false);
  };

  // 1. Nếu CHƯA đăng nhập và chưa bấm chọn Đăng Nhập -> Hiện Landing Page công khai
  if (!token && !showLoginModal) {
    return <LandingPage onRequireLogin={() => setShowLoginModal(true)} />;
  }

  // 2. Nếu CHƯA đăng nhập nhưng bấm nút "Đặt Hàng / Đăng Nhập" -> Hiện Form Login
  if (!token && showLoginModal) {
    return <Login setToken={setToken} setRole={setRole} onCancel={() => setShowLoginModal(false)} />;
  }

  // 3. ĐÃ ĐĂNG NHẬP -> Phân quyền Admin vs User
  if (role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <UserDashboard onLogout={handleLogout} />;
}

export default App;