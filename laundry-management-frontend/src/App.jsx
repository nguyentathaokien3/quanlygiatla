import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Tự động đồng bộ state khi token hoặc role thay đổi trong localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token') || '');
      setRole(localStorage.getItem('role') || 'user');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
    setRole('user');
    setShowLoginModal(false);
  };

  // 1. Nếu CHƯA đăng nhập và chưa mở Modal Đăng nhập -> Hiển thị Landing Page công khai
  if (!token && !showLoginModal) {
    return <LandingPage onRequireLogin={() => setShowLoginModal(true)} />;
  }

  // 2. Nếu CHƯA đăng nhập nhưng mở Modal Đăng nhập -> Hiển thị Form Đăng Nhập
  if (!token && showLoginModal) {
    return (
      <Login 
        setToken={(t) => {
          localStorage.setItem('token', t);
          setToken(t);
        }} 
        setRole={(r) => {
          localStorage.setItem('role', r);
          setRole(r);
        }} 
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setShowLoginModal(false)} 
      />
    );
  }

  // 3. ĐÃ ĐĂNG NHẬP -> Phân quyền hiển thị trang Admin hoặc User
  if (role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <UserDashboard onLogout={handleLogout} />;
}

export default App;