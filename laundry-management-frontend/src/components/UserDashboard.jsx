import React, { useState, useEffect } from 'react';
import API from '../api';

function UserDashboard({ onLogout }) {
  const [dichVus, setDichVus] = useState([]);
  const [activeTab, setActiveTab] = useState('dichvu');
  const [selectedDichVu, setSelectedDichVu] = useState('');
  const [soLuong, setSoLuong] = useState(1);
  const [phuongThucTT, setPhuongThucTT] = useState('Tiền mặt khi nhận đồ (COD)');
  const [ghiChu, setGhiChu] = useState('');
  const [donHangCuaToi, setDonHangCuaToi] = useState([]);

  const currentUsername = localStorage.getItem('username') || 'Khách';
  const [hoTen, setHoTen] = useState(localStorage.getItem(`user_hoten_${currentUsername}`) || currentUsername);
  const [soDienThoai, setSoDienThoai] = useState(localStorage.getItem(`user_sdt_${currentUsername}`) || '');
  const [diaChi, setDiaChi] = useState(localStorage.getItem(`user_diachi_${currentUsername}`) || '');

  useEffect(() => {
    fetchDichVus();
    loadMyOrders();

    const interval = setInterval(() => {
      fetchDichVus(); 
      loadMyOrders();
    }, 2000);

    const handleStorageChange = () => {
      loadMyOrders();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUsername]);

  const fetchDichVus = async () => {
    try {
      const res = await API.get('/DichVus');
      setDichVus(res.data);
      
      if (res.data.length > 0) {
        setSelectedDichVu(prev => {
          const exists = res.data.some(d => d.id == prev);
          return (prev && exists) ? prev : res.data[0].id;
        });
      }
    } catch (error) {
      console.error('Lỗi tải dịch vụ:', error);
    }
  };

  const loadMyOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('admin_donhangs') || '[]');
    const myOrders = allOrders.filter(
      dh => dh.tenKhach && dh.tenKhach.trim().toLowerCase() === currentUsername.trim().toLowerCase()
    );
    setDonHangCuaToi(myOrders);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem(`user_hoten_${currentUsername}`, hoTen);
    localStorage.setItem(`user_sdt_${currentUsername}`, soDienThoai);
    localStorage.setItem(`user_diachi_${currentUsername}`, diaChi);

    const danhSachKhachCu = JSON.parse(localStorage.getItem('admin_khachhangs') || '[]');
    const index = danhSachKhachCu.findIndex(
      k => (k.tenKH && k.tenKH.trim().toLowerCase() === currentUsername.trim().toLowerCase()) ||
           (k.hoTen && k.hoTen.trim().toLowerCase() === currentUsername.trim().toLowerCase())
    );

    const thongTinMoi = {
      id: index !== -1 ? danhSachKhachCu[index].id : Date.now(),
      tenKH: currentUsername,
      hoTen: hoTen,
      soDienThoai: soDienThoai,
      diaChi: diaChi
    };

    if (index !== -1) {
      danhSachKhachCu[index] = thongTinMoi;
    } else {
      danhSachKhachCu.push(thongTinMoi);
    }

    localStorage.setItem('admin_khachhangs', JSON.stringify(danhSachKhachCu));
    alert('✨ Cập nhật thông tin giao nhận thành công!');
  };

  const handleDatDon = (e) => {
    e.preventDefault();
    if (!soDienThoai || !diaChi) {
      alert('⚠️ Vui lòng vào mục "Thông Tin Giao Hàng" để cập nhật số điện thoại và địa chỉ trước khi đặt đơn!');
      setActiveTab('thongtin');
      return;
    }

    const dvChiTiet = dichVus.find(d => d.id == selectedDichVu);
    
    const donMoi = {
      id: Date.now(),
      tenKhach: currentUsername,
      hoTenNhan: hoTen,
      soDienThoai: soDienThoai,
      diaChiNhan: diaChi,
      tenDichVu: dvChiTiet ? dvChiTiet.tenDichVu : 'Giặt sấy',
      soLuong: soLuong + ' ' + (dvChiTiet?.donViTinh || 'kg'),
      tongTien: dvChiTiet ? dvChiTiet.donGia * soLuong : 0,
      phuongThucTT: phuongThucTT,
      trangThaiTT: phuongThucTT.includes('Tiền mặt') ? 'Chưa thanh toán ⏳' : 'Đã chuyển khoản ✅',
      ghiChu: ghiChu,
      trangThai: 'Đang xử lý ⏳',
      ngayDat: new Date().toLocaleString()
    };

    const danhSachCu = JSON.parse(localStorage.getItem('admin_donhangs') || '[]');
    localStorage.setItem('admin_donhangs', JSON.stringify([donMoi, ...danhSachCu]));

    loadMyOrders();
    alert('🎉 Đặt đơn giặt thành công! Shipper sẽ liên hệ nhận đồ tận nơi.');
    setGhiChu('');
    setSoLuong(1);
    setActiveTab('lichsu');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={styles.avatarLogo}>🧺</div>
          <div>
            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>LaundryPro Hub</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              Xin chào, <b style={{ color: '#0284c7' }}>{hoTen}</b>! Dịch vụ giặt ủi cao cấp tận nhà.
            </p>
          </div>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn}>🚪 Đăng Xuất</button>
      </header>

      {/* Tabs Menu */}
      <div style={styles.navTabs}>
        <button style={{ ...styles.tabBtn, ...(activeTab === 'dichvu' ? styles.activeTab : {}) }} onClick={() => setActiveTab('dichvu')}>📋 Bảng Giá & Dịch Vụ</button>
        <button style={{ ...styles.tabBtn, ...(activeTab === 'datdon' ? styles.activeTab : {}) }} onClick={() => setActiveTab('datdon')}>🛒 Đặt Lịch Giặt</button>
        <button style={{ ...styles.tabBtn, ...(activeTab === 'lichsu' ? styles.activeTab : {}) }} onClick={() => setActiveTab('lichsu')}>📦 Đơn Của Tôi <span style={styles.badgeCount}>{donHangCuaToi.length}</span></button>
        <button style={{ ...styles.tabBtn, ...(activeTab === 'thongtin' ? styles.activeTab : {}) }} onClick={() => setActiveTab('thongtin')}>📍 Thông Tin Giao Hàng</button>
      </div>

      <main style={styles.mainBox}>
        {activeTab === 'dichvu' && (
          <div>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ color: '#1e293b', margin: '0 0 8px 0', fontSize: '20px' }}>🏷️ Danh Sách Dịch Vụ Giặt Ủi</h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Lựa chọn dịch vụ phù hợp nhất với trang phục và vật dụng của bạn.</p>
            </div>
            <div style={styles.grid}>
              {dichVus.map(dv => {
                const imageUrl = dv.hinhAnh 
                  ? (dv.hinhAnh.startsWith('http') ? dv.hinhAnh : `http://localhost:5034${dv.hinhAnh}`) 
                  : null;

                return (
                  <div key={dv.id} style={styles.card}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={dv.tenDichVu} style={styles.cardImg} />
                    ) : (
                      <div style={styles.noImgBox}>📸 Chưa có ảnh minh họa</div>
                    )}
                    <h3 style={{ margin: '15px 0 8px 0', color: '#0f172a', fontSize: '18px', fontWeight: '700' }}>{dv.tenDichVu}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', minHeight: '45px', margin: '0 0 15px 0', lineHeight: '1.5' }}>
                      {dv.moTa || 'Giặt sạch tinh tươm, bảo vệ từng sợi vải tối đa.'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: '#16a34a' }}>
                        {dv.donGia.toLocaleString()} đ <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>/ {dv.donViTinh}</span>
                      </span>
                    </div>
                    <button style={styles.primaryBtn} onClick={() => { setSelectedDichVu(dv.id); setActiveTab('datdon'); }}>Đặt Dịch Vụ Này ✨</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'datdon' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#1e293b', marginTop: 0, fontSize: '20px' }}>🛒 Tạo Đơn Giặt Ủi Nhanh Chóng</h2>
            <form onSubmit={handleDatDon} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Chọn Dịch Vụ</label>
                <select value={selectedDichVu} onChange={e => setSelectedDichVu(e.target.value)} style={styles.input}>
                  {dichVus.map(dv => (
                    <option key={dv.id} value={dv.id}>
                      {dv.tenDichVu} ({dv.donGia.toLocaleString()} đ/{dv.donViTinh})
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Số Lượng ({dichVus.find(d => d.id == selectedDichVu)?.donViTinh || 'kg/cái'})</label>
                <input type="number" min="1" value={soLuong} onChange={e => setSoLuong(e.target.value)} required style={styles.input} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phương Thức Thanh Toán</label>
                <select value={phuongThucTT} onChange={e => setPhuongThucTT(e.target.value)} style={styles.input}>
                  <option value="Tiền mặt khi nhận đồ (COD)">💵 Tiền mặt khi nhận đồ (COD)</option>
                  <option value="Chuyển khoản ngân hàng (QR Code)">🏦 Chuyển khoản ngân hàng (QR Code)</option>
                  <option value="Ví MoMo / ZaloPay">📱 Ví MoMo / ZaloPay</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Ghi Chú Cho Tiệm</label>
                <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)} placeholder="Ví dụ: Giặt riêng đồ trắng, gọi trước khi đến..." style={{ ...styles.input, height: '90px', resize: 'vertical' }} />
              </div>

              <button type="submit" style={styles.successBtn}>🚀 Xác Nhận Đặt Đơn Ngay</button>
            </form>
          </div>
        )}

        {activeTab === 'lichsu' && (
          <div>
            <h2 style={{ color: '#1e293b', marginTop: 0, fontSize: '20px' }}>📦 Lịch Sử Đơn Hàng Của Bạn</h2>
            {donHangCuaToi.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                <p style={{ fontSize: '40px', margin: '0 0 10px 0' }}>📭</p>
                <p style={{ fontSize: '15px' }}>Bạn chưa có đơn hàng nào được tạo.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th style={styles.th}>Mã Đơn</th>
                      <th style={styles.th}>Dịch Vụ</th>
                      <th style={styles.th}>Tổng Tiền</th>
                      <th style={styles.th}>Thanh Toán</th>
                      <th style={styles.th}>Trạng Thái Đơn</th>
                      <th style={styles.th}>Ngày Đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donHangCuaToi.map(dh => (
                      <tr key={dh.id} style={styles.trRow}>
                        <td style={styles.td}><b>#{dh.id.toString().slice(-4)}</b></td>
                        <td style={styles.td}>{dh.tenDichVu} <br/><span style={{ fontSize: '12px', color: '#64748b' }}>SL: {dh.soLuong}</span></td>
                        <td style={styles.td}><span style={{ color: '#16a34a', fontWeight: '700' }}>{dh.tongTien.toLocaleString()} đ</span></td>
                        <td style={styles.td}>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{dh.phuongThucTT}</div>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: dh.trangThaiTT?.includes('Đã') ? '#16a34a' : '#d97706' }}>
                            {dh.trangThaiTT || 'Chưa thanh toán'}
                          </span>
                        </td>
                        <td style={styles.td}><span style={styles.badgeStatus}>{dh.trangThai}</span></td>
                        <td style={styles.td}>
                          <span style={styles.badgeStatus}>{dh.trangThai}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'thongtin' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#1e293b', marginTop: 0, fontSize: '20px' }}>📍 Thông Tin Giao Nhận Tận Nơi</h2>
            <form onSubmit={handleSaveProfile} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Họ và Tên Người Nhận</label>
                <input type="text" value={hoTen} onChange={e => setHoTen(e.target.value)} required style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Số Điện Thoại Liên Hệ</label>
                <input type="text" placeholder="Ví dụ: 0966817875" value={soDienThoai} onChange={e => setSoDienThoai(e.target.value)} required style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Địa Chỉ Giao Nhận Cụ Thể</label>
                <textarea placeholder="Số nhà, tên đường, phường/quận..." value={diaChi} onChange={e => setDiaChi(e.target.value)} required style={{ ...styles.input, height: '90px', resize: 'vertical' }} />
              </div>
              <button type="submit" style={styles.successBtn}>💾 Lưu Thông Tin Giao Hàng</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { padding: '40px 20px', fontFamily: 'Inter, Segoe UI, sans-serif', maxWidth: '1200px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '25px 30px', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #f1f5f9' },
  avatarLogo: { fontSize: '32px', background: '#e0f2fe', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px' },
  logoutBtn: { padding: '10px 20px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', transition: '0.2s' },
  navTabs: { display: 'flex', gap: '12px', marginBottom: '25px', flexWrap: 'wrap' },
  tabBtn: { padding: '12px 22px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#475569', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', transition: '0.2s' },
  activeTab: { background: '#0284c7', color: '#fff', borderColor: '#0284c7', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' },
  badgeCount: { background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', marginLeft: '6px' },
  mainBox: { background: '#fff', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px', marginTop: '15px' },
  card: { background: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardImg: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' },
  noImgBox: { width: '100%', height: '160px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', marginBottom: '12px', color: '#94a3b8', fontSize: '13px', border: '1px dashed #cbd5e1' },
  primaryBtn: { padding: '12px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', width: '100%', fontSize: '14px', boxShadow: '0 4px 10px rgba(2, 132, 199, 0.2)' },
  successBtn: { padding: '14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', width: '100%', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#f8fafc', transition: 'border-color 0.2s' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', marginTop: '10px' },
  trHead: { background: '#f8fafc', textAlign: 'left' },
  th: { padding: '14px', fontSize: '13px', color: '#475569', fontWeight: '700', borderBottom: '2px solid #e2e8f0' },
  td: { padding: '14px', fontSize: '14px', color: '#1e293b', background: '#fff', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' },
  badgeStatus: { background: '#fef3c7', color: '#d97706', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #fde68a', display: 'inline-block' }
};

export default UserDashboard;