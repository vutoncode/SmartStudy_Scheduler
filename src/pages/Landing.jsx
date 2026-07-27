import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '1.5rem 5%', backgroundColor: 'white', position: 'relative', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="Smart Study Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>Smart Study</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" style={{ 
            padding: '0.5rem 1.25rem', color: '#64748b', textDecoration: 'none', fontWeight: '500',
            border: '1px solid #cbd5e1', borderRadius: '6px'
          }}>Đăng nhập</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', textDecoration: 'none' }}>
            Bắt đầu ngay
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        flex: 1, display: 'flex', alignItems: 'center', padding: '0 5%', position: 'relative', overflow: 'hidden'
      }}>
        {/* Background decorative curved shape (left subtle) */}
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%', width: '100%', height: '150%',
          backgroundColor: '#f8fafc', borderRadius: '50% 0 0 50%', zIndex: 0,
          transform: 'rotate(-10deg)'
        }}></div>

        <div style={{ display: 'flex', width: '100%', position: 'relative', zIndex: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Left Text Content */}
          <div style={{ flex: '1 1 500px', paddingRight: '2rem', marginBottom: '3rem' }}>
            <h1 style={{ 
              fontSize: '4rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.1', marginBottom: '1.5rem'
            }}>
              Học tập hiệu quả hơn<br />với Smart Study
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '2.5rem', maxWidth: '500px' }}>
              Khám phá sức mạnh của việc lên lịch thông minh và quản lý nhiệm vụ hiệu quả. Đạt kết quả cao hơn mỗi ngày!
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
                Bắt đầu ngay
              </Link>
              <Link to="/about" style={{ 
                padding: '0.75rem 2rem', fontSize: '1.1rem', color: '#1e293b', textDecoration: 'none',
                border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: 'white'
              }}>
                Tìm hiểu thêm
              </Link>
            </div>
          </div>

          {/* Right Visual Content (CSS layout simulating images) */}
          <div style={{ flex: '1 1 500px', position: 'relative', height: '600px', display: 'flex', justifyContent: 'center' }}>
            
            {/* Top right circular block */}
            <div style={{
              position: 'absolute', top: '20px', right: '0', width: '350px', height: '350px',
              borderRadius: '50%', backgroundColor: '#e0e7ff', overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
               <div style={{ fontSize: '4rem' }}>📚</div>
            </div>

            {/* Bottom left rounded block */}
            <div style={{
              position: 'absolute', bottom: '20px', left: '10%', width: '320px', height: '400px',
              borderRadius: '24px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', padding: '1.5rem'
            }}>
              <div style={{ width: '100%', height: '60%', backgroundColor: '#cbd5e1', borderRadius: '12px', marginBottom: '1rem' }}></div>
              <div style={{ width: '80%', height: '20px', backgroundColor: '#94a3b8', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
              <div style={{ width: '60%', height: '20px', backgroundColor: '#94a3b8', borderRadius: '4px' }}></div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Landing;
