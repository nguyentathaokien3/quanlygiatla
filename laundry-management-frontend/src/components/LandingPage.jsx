import React, { useState, useEffect } from 'react';
import API from '../api';

function LandingPage({ onRequireLogin }) {
  const [dichVus, setDichVus] = useState([]);

  useEffect(() => {
    API.get('/DichVus')
      .then((res) => setDichVus(res.data))
      .catch((err) => console.error('Lỗi tải danh sách dịch vụ:', err));
  }, []);

  return (
    <div style={styles.landingContainer}>
      {/* 1. Header / Navbar */}
      <header style={styles.navbar}>
        <div style={styles.logoGroup}>
          <span style={{ fontSize: '28px' }}>🧺</span>
          <div>
            <h3 style={{ margin: 0, color: '#1e3a8a' }}>MULTI LAUNDRY</h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Giặt Khô Là Hơi Chuyên Nghiệp</span>
          </div>
        </div>
        <nav style={styles.navLinks}>
          <a href="#services" style={styles.navLink}>Dịch Vụ</a>
          <a href="#whyus" style={styles.navLink}>Ưu Điểm</a>
          <a href="#combos" style={styles.navLink}>Gói Combo</a>
          <a href="#pricing" style={styles.navLink}>Bảng Giá</a>
        </nav>
        <button style={styles.loginNavBtn} onClick={onRequireLogin}>🔑 Đăng Nhập / Đặt Đơn</button>
      </header>

      {/* 2. Hero Banner */}
      <section style={styles.heroSection}>
        <div style={styles.heroText}>
          <span style={styles.heroTag}>Dịch Vụ Giặt Ủi Hàng Đầu</span>
          <h1 style={styles.heroTitle}>Sạch Hơn, Thơm Hơn & An Toàn Cho Sức Khỏe</h1>
          <p style={styles.heroDesc}>
            Chuyên dịch vụ giặt sấy lấy ngay, giặt khô là hơi cao cấp cho vest, áo cưới, rèm cửa, sofa. Giao nhận tận nơi tiện lợi.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={styles.primaryBtn} onClick={onRequireLogin}>🛒 Đặt Lịch Giặt Ngay</button>
            <a href="tel:0966817875" style={styles.secondaryBtn}>📞 Hotline: 0966 817 875</a>
          </div>
        </div>
      </section>

      {/* 3. Các Dịch Vụ Cung Cấp */}
      <section id="services" style={styles.section}>
        <h2 style={styles.sectionTitle}>Dịch Vụ Giặt Ủi Nổi Bật</h2>
        <p style={styles.sectionSub}>Đáp ứng trọn gói nhu cầu từ cá nhân, gia đình đến khách sạn & spa</p>
        
        <div style={styles.servicesGrid}>
          {dichVus.length > 0 ? (
            dichVus.map((dv) => (
              <div key={dv.id} style={styles.serviceCard}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>{dv.tenDichVu}</h4>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>
                  {dv.donGia.toLocaleString()} đ <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>/ {dv.donViTinh}</span>
                </p>
                <button style={styles.cardBtn} onClick={onRequireLogin}>Đặt Dịch Vụ Này</button>
              </div>
            ))
          ) : (
            <p style={{ color: '#64748b' }}>Đang tải danh sách dịch vụ...</p>
          )}
        </div>
      </section>

      {/* 4. Tại sao chọn chúng tôi */}
      <section id="whyus" style={{ ...styles.section, background: '#f8fafc' }}>
        <h2 style={styles.sectionTitle}>Tại Sao Chọn Multi Laundry?</h2>
        <div style={styles.whyGrid}>
          <div style={styles.whyItem}>
            <span style={{ fontSize: '30px' }}>🧪</span>
            <h4>Nước Giặt Nhập Khẩu</h4>
            <p style={{ fontSize: '13px', color: '#64748b' }}>100% sử dụng dung môi giặt là Thái Lan & Hàn Quốc an toàn cho da.</p>
          </div>
          <div style={styles.whyItem}>
            <span style={{ fontSize: '30px' }}>🇯🇵</span>
            <h4>Công Nghệ Nhật Bản</h4>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Máy giặt sấy hiện đại giữ form dáng quần áo tối đa.</p>
          </div>
          <div style={styles.whyItem}>
            <span style={{ fontSize: '30px' }}>🚚</span>
            <h4>Giao Nhận Tận Nơi</h4>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Thu gom tận nhà và giao trả nhanh chóng đúng hẹn.</p>
          </div>
        </div>
      </section>

      {/* 5. Gói Combo Tiết Kiệm */}
      <section id="combos" style={styles.section}>
        <h2 style={styles.sectionTitle}>Gói Combo Theo Tháng</h2>
        <div style={styles.whyGrid}>
          <div style={styles.comboCard}>
            <h3>Gói Tiêu Chuẩn</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>300.000 đ/tháng</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>50 bộ quần áo + 1 bộ ga gối / tháng</p>
            <button style={styles.primaryBtn} onClick={onRequireLogin}>Đặt Hàng Ngay</button>
          </div>
          <div style={{ ...styles.comboCard, border: '2px solid #2563eb' }}>
            <span style={styles.badgePop}>Khuyên Dùng</span>
            <h3>Gói Doanh Nghiệp</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>400.000 đ/tháng</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>60 bộ quần áo + 2 bộ ga gối / tháng</p>
            <button style={styles.primaryBtn} onClick={onRequireLogin}>Đặt Hàng Ngay</button>
          </div>
          <div style={styles.comboCard}>
            <h3>Gói Cao Cấp</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>500.000 đ/tháng</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>80 bộ quần áo + giặt hấp 2 áo vest</p>
            <button style={styles.primaryBtn} onClick={onRequireLogin}>Đặt Hàng Ngay</button>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer style={styles.footer}>
        <p>© 2026 giatkholahoi.com - Hệ Thống Quản Lý Tiệm Giặt Ủi Chuyên Nghiệp</p>
      </footer>
    </div>
  );
}

const styles = {
  landingContainer: { fontFamily: 'Segoe UI, sans-serif', color: '#1e293b', background: '#fff' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLinks: { display: 'flex', gap: '25px' },
  navLink: { textDecoration: 'none', color: '#475569', fontWeight: '600', fontSize: '14px' },
  loginNavBtn: { padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  heroSection: { background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '80px 40px', textAlign: 'center' },
  heroText: { maxWidth: '700px', margin: '0 auto' },
  heroTag: { background: '#bfdbfe', color: '#1e40af', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  heroTitle: { fontSize: '36px', margin: '20px 0 15px 0', color: '#1e3a8a' },
  heroDesc: { fontSize: '16px', color: '#475569', marginBottom: '30px' },
  primaryBtn: { padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  secondaryBtn: { padding: '12px 24px', background: '#fff', color: '#2563eb', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', border: '1px solid #bfdbfe', display: 'inline-block' },
  section: { padding: '60px 40px', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' },
  sectionTitle: { fontSize: '26px', color: '#0f172a', marginBottom: '10px' },
  sectionSub: { color: '#64748b', fontSize: '14px', marginBottom: '40px' },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
  serviceCard: { background: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  cardBtn: { marginTop: '10px', padding: '8px 16px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginTop: '20px' },
  whyItem: { padding: '20px', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' },
  comboCard: { position: 'relative', background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  badgePop: { position: 'absolute', top: '-12px', right: '20px', background: '#2563eb', color: '#fff', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' },
  footer: { background: '#0f172a', color: '#94a3b8', padding: '25px', textAlign: 'center', fontSize: '13px' }
};

export default LandingPage;