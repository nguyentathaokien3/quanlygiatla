import React, { useState, useEffect } from 'react';
import API from '../api';

function AdminDashboard({ onLogout }) {
  const [dichVus, setDichVus] = useState([]);
  const [khachHangs, setKhachHangs] = useState([]);
  const [donHangs, setDonHangs] = useState([]);
  const [activeTab, setActiveTab] = useState('donhang');

  const [tenDichVu, setTenDichVu] = useState('');
  const [donGia, setDonGia] = useState('');
  const [donViTinh, setDonViTinh] = useState('');
  const [moTa, setMoTa] = useState('');
  const [hinhAnh, setHinhAnh] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => { fetchData(); }, 2000);
    const handleStorageChange = () => { fetchData(); };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchData = async () => {
    try {
      const resDV = await API.get('/DichVus');
      setDichVus(resDV.data);

      const savedKhachHangs = JSON.parse(localStorage.getItem('admin_khachhangs') || '[]');
      if (savedKhachHangs.length > 0) {
        setKhachHangs(savedKhachHangs);
      } else {
        const resKH = await API.get('/KhachHangs').catch(() => ({ data: [] }));
        setKhachHangs(resKH.data);
      }
      
      const savedDonHangs = JSON.parse(localStorage.getItem('admin_donhangs') || '[]');
      setDonHangs(savedDonHangs);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    }
  };

  const handleSaveDichVu = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('tenDichVu', tenDichVu);
      formData.append('donGia', Number(donGia));
      formData.append('donViTinh', donViTinh);
      formData.append('moTa', moTa || '');
      formData.append('hinhAnh', hinhAnh || '');

      if (editingId) {
        formData.append('id', editingId);
        await API.put(`/DichVus/${editingId}`, formData);
        alert('✨ Cập nhật dịch vụ thành công!');
        setEditingId(null);
      } else {
        await API.post('/DichVus', formData);
        alert('🎉 Thêm dịch vụ mới thành công!');
      }

      setTenDichVu('');
      setDonGia('');
      setDonViTinh('');
      setMoTa('');
      setHinhAnh('');
      fetchData();
    } catch (error) {
      console.error('Lỗi lưu dịch vụ:', error);
      alert('Thất bại! Vui lòng kiểm tra lại dữ liệu.');
    }
  };

  const handleEditDichVu = (dv) => {
    setEditingId(dv.id);
    setTenDichVu(dv.tenDichVu);
    setDonGia(dv.donGia);
    setDonViTinh(dv.donViTinh || '');
    setMoTa(dv.moTa || '');
    setHinhAnh(dv.hinhAnh || '');
  };

  const handleDeleteDichVu = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) {
      try {
        await API.delete(`/DichVus/${id}`);
        alert('Đã xóa thành công!');
        fetchData();
      } catch (error) {
        alert('Xóa thất bại! Dịch vụ này có thể đang được sử dụng.');
      }
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updatedDonHangs = donHangs.map(dh => dh.id === id ? { ...dh, trangThai: newStatus } : dh);
    setDonHangs(updatedDonHangs);
    localStorage.setItem('admin_donhangs', JSON.stringify(updatedDonHangs));
    alert('Đã cập nhật trạng thái đơn hàng!');
  };

  const handleUpdatePaymentStatus = (id, newPaymentStatus) => {
    const updatedDonHangs = donHangs.map(dh => dh.id === id ? { ...dh, trangThaiTT: newPaymentStatus } : dh);
    setDonHangs(updatedDonHangs);
    localStorage.setItem('admin_donhangs', JSON.stringify(updatedDonHangs));
    alert('✅ Đã cập nhật trạng thái thanh toán!');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '800', margin: '0 0 5px 0' }}>🛡️ Admin Panel</h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Hệ thống quản lý giặt ủi</span>
        </div>
        <button style={{ ...styles.sideBtn, ...(activeTab === 'donhang' ? styles.activeSideBtn : {}) }} onClick={() => setActiveTab('donhang')}>📦 Duyệt Đơn Hàng</button>
        <button style={{ ...styles.sideBtn, ...(activeTab === 'dichvu' ? styles.activeSideBtn : {}) }} onClick={() => setActiveTab('dichvu')}>⚙️ Quản Lý Dịch Vụ</button>
        <button style={{ ...styles.sideBtn, ...(activeTab === 'khachhang' ? styles.activeSideBtn : {}) }} onClick={() => setActiveTab('khachhang')}>👥 Quản Lý Khách Hàng</button>
        <button style={{ ...styles.sideBtn, ...(activeTab === 'thongke' ? styles.activeSideBtn : {}) }} onClick={() => setActiveTab('thongke')}>📊 Thống Kê Hệ Thống</button>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={onLogout} style={styles.logoutSideBtn}>🚪 Đăng Xuất</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>Bảng Điều Khiển Quản Trị Viên</h2>
          <span style={styles.badge}>👑 Administrator</span>
        </header>

        {activeTab === 'donhang' && (
          <div style={styles.cardSection}>
            <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', marginBottom: '20px' }}>📦 Danh Sách Đơn Hàng Của Khách ({donHangs.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th style={styles.th}>Mã Đơn</th>
                    <th style={styles.th}>Khách Hàng</th>
                    <th style={styles.th}>Dịch Vụ & Số Lượng</th>
                    <th style={styles.th}>Tổng Tiền</th>
                    <th style={styles.th}>Xác Nhận Thanh Toán</th>
                    <th style={styles.th}>Địa Chỉ Nhận</th>
                    <th style={styles.th}>Trạng Thái Đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {donHangs.map(dh => (
                    <tr key={dh.id} style={styles.trRow}>
                      <td style={styles.td}><b>#{dh.id.toString().slice(-4)}</b></td>
                      <td style={styles.td}><b>{dh.hoTenNhan || dh.tenKhach || 'Khách lẻ'}</b><br/><span style={{ fontSize: '12px', color: '#64748b' }}>📞 {dh.soDienThoai}</span></td>
                      <td style={styles.td}>{dh.tenDichVu} <br/><span style={{ fontSize: '12px', color: '#64748b' }}>SL: {dh.soLuong}</span></td>
                      <td style={styles.td}><span style={{ color: '#16a34a', fontWeight: '800' }}>{dh.tongTien.toLocaleString()} đ</span></td>
                      <td style={styles.td}>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{dh.phuongThucTT || 'Tiền mặt'}</div>
                        <select 
                          value={dh.trangThaiTT || 'Chưa thanh toán ⏳'} 
                          onChange={(e) => handleUpdatePaymentStatus(dh.id, e.target.value)}
                          style={{
                            ...styles.selectStatus,
                            color: dh.trangThaiTT?.includes('Đã') ? '#16a34a' : '#d97706',
                            fontWeight: '700'
                          }}
                        >
                          <option value="Chưa thanh toán ⏳">Chưa thanh toán ⏳</option>
                          <option value="Đã thanh toán ✅">Đã thanh toán ✅</option>
                        </select>
                      </td>
                      <td style={styles.td}>{dh.diaChiNhan || 'Chưa có địa chỉ'}</td>
                      <td style={styles.td}>
                        <select 
                          value={dh.trangThai} 
                          onChange={(e) => handleUpdateStatus(dh.id, e.target.value)}
                          style={styles.selectStatus}
                        >
                          <option value="Đang xử lý ⏳">Đang xử lý ⏳</option>
                          <option value="Đang giặt 🌀">Đang giặt 🌀</option>
                          <option value="Đang giao 🚚">Đang giao 🚚</option>
                          <option value="Hoàn thành ✅">Hoàn thành ✅</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'dichvu' && (
          <div>
            <div style={styles.cardSection}>
              <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', marginBottom: '20px' }}>
                {editingId ? '✏️ Cập Nhật Thông Tin Dịch Vụ' : '➕ Thêm Dịch Vụ Mới'}
              </h3>
              <form onSubmit={handleSaveDichVu} style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Tên Dịch Vụ</label>
                  <input type="text" placeholder="Nhập tên dịch vụ..." value={tenDichVu} onChange={e => setTenDichVu(e.target.value)} required style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Đơn Giá (VNĐ)</label>
                  <input type="number" placeholder="Nhập đơn giá..." value={donGia} onChange={e => setDonGia(e.target.value)} required style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Đơn Vị Tính</label>
                  <input type="text" placeholder="Kg, Bộ, Cái..." value={donViTinh} onChange={e => setDonViTinh(e.target.value)} required style={styles.input} />
                </div>

                <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Tải Hình Ảnh Minh Họa Từ Máy Tính</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        alert('Đang tải ảnh lên server, vui lòng đợi...');
                        const res = await API.post('/Upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                        setHinhAnh(res.data.url);
                        alert('✨ Tải ảnh lên thành công!');
                      } catch (error) {
                        alert('❌ Tải ảnh thất bại!');
                      }
                    }} 
                    style={{ ...styles.input, padding: '8px' }} 
                  />

                  {hinhAnh && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontSize: '12px', color: '#16a34a', margin: '0 0 5px 0', fontWeight: '700' }}>✅ Xem trước ảnh:</p>
                      <img src={hinhAnh?.startsWith('http') ? hinhAnh : `http://localhost:5034${hinhAnh}`} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                    </div>
                  )}
                </div>

                <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Mô Tả / Loại Quần Áo Phù Hợp</label>
                  <textarea placeholder="Mô tả chi tiết dịch vụ..." value={moTa} onChange={e => setMoTa(e.target.value)} style={{ ...styles.input, height: '80px', resize: 'vertical' }} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button type="submit" style={styles.successBtn}>{editingId ? '💾 Lưu Thay Đổi' : '➕ Thêm Dịch Vụ'}</button>
                  {editingId && (
                    <button type="button" style={styles.cancelBtn} onClick={() => { setEditingId(null); setTenDichVu(''); setDonGia(''); setDonViTinh(''); setMoTa(''); setHinhAnh(''); }}>Hủy Bỏ</button>
                  )}
                </div>
              </form>
            </div>

            <div style={styles.cardSection}>
              <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', marginBottom: '20px' }}>📋 Danh Sách Dịch Vụ Hiện Có ({dichVus.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th style={styles.th}>Ảnh</th>
                      <th style={styles.th}>Tên Dịch Vụ</th>
                      <th style={styles.th}>Đơn Giá</th>
                      <th style={styles.th}>Đơn Vị</th>
                      <th style={styles.th}>Mô Tả</th>
                      <th style={styles.th}>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dichVus.map(dv => (
                      <tr key={dv.id} style={styles.trRow}>
                        <td style={styles.td}>
                          {dv.hinhAnh ? (
                            <img src={dv.hinhAnh?.startsWith('http') ? dv.hinhAnh : `http://localhost:5034${dv.hinhAnh}`} alt="Minh họa" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                          ) : (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Không có</span>
                          )}
                        </td>
                        <td style={styles.td}><b>{dv.tenDichVu}</b></td>
                        <td style={styles.td}><span style={{ color: '#16a34a', fontWeight: '700' }}>{dv.donGia.toLocaleString()} đ</span></td>
                        <td style={styles.td}>{dv.donViTinh}</td>
                        <td style={styles.td}>{dv.moTa || '—'}</td>
                        <td style={styles.td}>
                          <button onClick={() => handleEditDichVu(dv)} style={styles.editBtn}>Sửa</button>
                          <button onClick={() => handleDeleteDichVu(dv.id)} style={styles.deleteBtn}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'khachhang' && (
          <div style={styles.cardSection}>
            <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', marginBottom: '20px' }}>👥 Danh Sách Khách Hàng ({khachHangs.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Họ Tên / Tài Khoản</th>
                    <th style={styles.th}>Số Điện Thoại</th>
                    <th style={styles.th}>Địa Chỉ</th>
                  </tr>
                </thead>
                <tbody>
                  {khachHangs.map(kh => (
                    <tr key={kh.id} style={styles.trRow}>
                      <td style={styles.td}>{kh.id}</td>
                      <td style={styles.td}><b>{kh.hoTen || kh.tenKH}</b></td>
                      <td style={styles.td}>{kh.soDienThoai || 'Chưa cập nhật'}</td>
                      <td style={styles.td}>{kh.diaChi || 'Chưa cập nhật'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'thongke' && (
          <div style={styles.cardSection}>
            <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', marginBottom: '20px' }}>📊 Thống Kê Tổng Quan Hệ Thống</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>Tổng Dịch Vụ</h4>
                <p style={styles.statNum}>{dichVus.length}</p>
              </div>
              <div style={styles.statCard}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>Tổng Khách Hàng</h4>
                <p style={styles.statNum}>{khachHangs.length}</p>
              </div>
              <div style={styles.statCard}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>Trạng Thái Server</h4>
                <p style={{ color: '#16a34a', fontWeight: '800', fontSize: '16px', margin: '10px 0 0 0' }}>🟢 Online (Port 5034)</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: 'Inter, Segoe UI, sans-serif', background: '#f8fafc' },
  sidebar: { width: '280px', background: '#0f172a', color: '#fff', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box', boxShadow: '4px 0 20px rgba(0,0,0,0.05)' },
  sideBtn: { padding: '14px 18px', background: 'transparent', color: '#94a3b8', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: '0.2s' },
  activeSideBtn: { background: '#0284c7', color: '#fff', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' },
  logoutSideBtn: { padding: '12px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', width: '100%', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '22px 30px', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #f1f5f9' },
  badge: { background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  cardSection: { background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #f1f5f9' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', background: '#f8fafc' },
  successBtn: { padding: '12px 24px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)' },
  cancelBtn: { padding: '12px 24px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', marginTop: '10px' },
  trHead: { background: '#f8fafc', textAlign: 'left' },
  th: { padding: '14px', fontSize: '13px', color: '#475569', fontWeight: '700', borderBottom: '2px solid #e2e8f0' },
  td: { padding: '14px', fontSize: '14px', color: '#1e293b', background: '#fff', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' },
  editBtn: { padding: '6px 14px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '6px', fontWeight: '700', fontSize: '13px' },
  deleteBtn: { padding: '6px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
  selectStatus: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', cursor: 'pointer', fontWeight: '600', background: '#fff' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '15px' },
  statCard: { background: '#f8fafc', padding: '25px', borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  statNum: { fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '5px 0 0 0' }
};

export default AdminDashboard;