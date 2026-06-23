import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { validateEmail, validatePassword, validateNotEmpty } from '../utils/validators';

export const LoginPage = () => {
  const { login, register, isAuthenticated, error, loading, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [isLogin, clearError]);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const errors = {};

    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;

    if (!isLogin) {
      const nameErr = validateNotEmpty(name, 'Họ và tên');
      if (nameErr) errors.name = nameErr;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (isLogin) {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 p-3" 
      style={{ backgroundColor: '#eef2f6' }}
    >
      <div 
        className="card shadow-lg border-0 w-100 animate-fadeIn" 
        style={{ maxWidth: '420px', borderRadius: '12px', overflow: 'hidden' }}
      >
        {/* Banner with Bear Logo */}
        <div className="bg-primary text-white text-center p-4 d-flex flex-column align-items-center gap-2">
          <img 
            src="/logo.jpg" 
            alt="Bear Logo" 
            className="rounded-circle bg-white p-1 border border-light-subtle"
            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
          />
          <h4 className="font-weight-bold mb-0" style={{ fontSize: '18px' }}>
            {isLogin ? 'Smart Study Scheduler' : 'Đăng Ký Tài Khoản'}
          </h4>
          <small className="opacity-75" style={{ fontSize: '11px' }}>
            {isLogin 
              ? 'Đăng nhập để quản lý lịch trình học tập của bạn' 
              : 'Đăng ký để lên lịch và theo dõi tiến độ tự học'}
          </small>
        </div>

        {/* Form Body */}
        <div className="card-body p-4 text-secondary">
          {error && (
            <div className="alert alert-danger p-2.5 d-flex gap-2 align-items-center" style={{ fontSize: '12px', borderRadius: '8px' }}>
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {/* Name */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="authName" className="form-label font-weight-semibold text-dark text-xs mb-1">Họ và tên</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><User size={14} /></span>
                  <input
                    id="authName"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                    required
                  />
                </div>
                {validationErrors.name && (
                  <div className="invalid-feedback d-block">{validationErrors.name}</div>
                )}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label htmlFor="authEmail" className="form-label font-weight-semibold text-dark text-xs mb-1">Địa chỉ Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><Mail size={14} /></span>
                <input
                  id="authEmail"
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                  required
                />
              </div>
              {validationErrors.email && (
                <div className="invalid-feedback d-block">{validationErrors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="authPassword" className="form-label font-weight-semibold text-dark text-xs mb-1">Mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><Lock size={14} /></span>
                <input
                  id="authPassword"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                  required
                />
              </div>
              {validationErrors.password && (
                <div className="invalid-feedback d-block">{validationErrors.password}</div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={ArrowRight}
              className="w-100 py-2.5 font-weight-bold mt-2"
              style={{ borderRadius: '8px' }}
            >
              {isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-3 mb-1">
            <small className="text-muted">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button
                onClick={handleToggleMode}
                className="btn btn-link p-0 text-decoration-none text-primary font-weight-bold"
                style={{ fontSize: '12px' }}
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
