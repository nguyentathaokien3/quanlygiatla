import React, { useState } from 'react';
import API from '../api';

function Login({ setToken, setRole, onCancel }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/Auth/register' : '/Auth/login';
    
    try {
      const response = await API.post(endpoint, { username, password });
      if (isRegistering) {
        alert('🎉 Đăng ký thành công! Hãy đăng nhập ngay.');
        setIsRegistering(false);
        setPassword(''); // Xóa mật khẩu sau khi đăng ký thành công cho an toàn
      } else {
        const jwtToken = response.data.Token || response.data.token || (typeof response.data === 'string' ? response.data : null);
        if (jwtToken) {
          localStorage.setItem('token', jwtToken);
          localStorage.setItem('username', response.data.Username || username);
          
          const userRole = username.toLowerCase() === 'admin' ? 'admin' : 'user';
          localStorage.setItem('role', userRole);
          
          setRole(userRole);
          setToken(jwtToken);
        } else {
          alert('Đăng nhập thành công nhưng không tìm thấy Token!');
        }
      }
    } catch (error) {
      console.error('Chi tiết lỗi từ Server:', error.response);
      const data = error.response?.data;
      
      // 🌟 Xử lý hiển thị chi tiết lỗi trả về từ ASP.NET Core API
      if (data) {
        if (typeof data === 'string') {
          alert(data);
        } else if (data.message) {
          alert(data.message);
        } else if (typeof data === 'object') {
          // Lấy danh sách các lỗi validation từ .NET (ví dụ: Password quá ngắn, thiếu ký tự đặc biệt...)
          const errorMessages = Object.values(data)
            .flat()
            .join('\n');
          alert(errorMessages || 'Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.');
        } else {
          alert('Thất bại! Vui lòng kiểm tra lại.');
        }
      } else {
        alert('Không thể kết nối đến Server. Vui lòng kiểm tra lại backend!');
      }
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {onCancel && <button style={styles.closeBtn} onClick={onCancel}>✕</button>}
        <div style={styles.header}>
          <span style={{ fontSize: '40px' }}>🧺</span>
          <h2 style={styles.title}>{isRegistering ? 'Tạo Tài Khoản Khách Hàng' : 'Đăng Nhập Giặt Ủi'}</h2>
          <p style={styles.subtitle}>Đăng nhập để đặt lịch giặt và theo dõi đơn hàng</p>
        </div>
        
        <form onSubmit={handleAuth} style={styles.form}>
          <div>
            <label style={styles.label}>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập (vd: admin hoặc kien)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            {isRegistering && (
              <span style={styles.hint}>
                💡 Mật khẩu nên có chữ hoa, chữ thường, số và ký tự đặc biệt (VD: Abc@123)
              </span>
            )}
          </div>
          <button type="submit" style={styles.button}>
            {isRegistering ? 'Đăng Ký Ngay' : 'Đăng Nhập'}
          </button>
        </form>

        <p style={styles.switchText}>
          {isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'} {' '}
          <span onClick={() => setIsRegistering(!isRegistering)} style={styles.link}>
            {isRegistering ? 'Đăng nhập' : 'Đăng ký mới'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'rgba(15, 23, 42, 0.6)', fontFamily: 'Segoe UI, sans-serif' },
  card: { position: 'relative', background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '380px' },
  closeBtn: { position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer', color: '#64748b' },
  header: { textAlign: 'center', marginBottom: '25px' },
  title: { margin: '10px 0 5px 0', color: '#0f172a', fontSize: '22px' },
  subtitle: { color: '#64748b', fontSize: '13px', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '5px' },
  input: { padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  hint: { fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block', lineHeight: '1.3' },
  button: { padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '10px' },
  switchText: { marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' },
  link: { color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;