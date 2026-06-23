import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  footer = null,
  closeOnOverlayClick = true
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'modal-sm';
      case 'md': return '';
      case 'lg': return 'modal-lg';
      case 'xl': return 'modal-xl';
      default: return '';
    }
  };

  const handleBackdropClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="modal show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className={`modal-dialog modal-dialog-centered ${getSizeClass()}`} role="document">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '12px', background: '#ffffff' }}>
          
          {/* Header */}
          <div className="modal-header border-bottom border-light px-4 py-3 d-flex align-items-center justify-content-between">
            <h5 className="modal-title font-weight-bold text-dark text-lg" style={{ fontSize: '1.1rem' }}>
              {title}
            </h5>
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle p-1.5 d-flex align-items-center justify-content-center"
              onClick={onClose}
              style={{ width: '32px', height: '32px' }}
            >
              <X size={16} className="text-muted" />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body px-4 py-4 text-secondary" style={{ fontSize: '0.92rem' }}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="modal-footer border-top border-light px-4 py-3 bg-light d-flex align-items-center justify-content-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
