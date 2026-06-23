import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outline', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  loading = false,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  const getBootstrapClasses = () => {
    let classes = 'btn d-inline-flex align-items-center justify-content-center gap-2 ';

    // Variant mapping
    switch (variant) {
      case 'primary':
        classes += 'btn-primary';
        break;
      case 'secondary':
        classes += 'btn-info text-white';
        break;
      case 'danger':
        classes += 'btn-danger';
        break;
      case 'outline':
        classes += 'btn-outline-primary';
        break;
      case 'ghost':
        classes += 'btn-link text-decoration-none text-muted';
        break;
      default:
        classes += 'btn-primary';
    }

    // Size mapping
    switch (size) {
      case 'sm':
        classes += ' btn-sm px-3 py-1.5';
        break;
      case 'md':
        classes += ' px-4 py-2';
        break;
      case 'lg':
        classes += ' btn-lg px-5 py-2.5';
        break;
    }

    return classes;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${getBootstrapClasses()} ${className}`}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" color="current" className="border-0 p-0" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
