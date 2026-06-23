import React from 'react';
import * as Icons from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: IconName,
  color = 'primary', // 'primary', 'accent', 'warning', 'success', 'danger'
  percentage = null,
  trend = 'up' // 'up', 'down'
}) => {
  const IconComponent = Icons[IconName] || Icons.Activity;

  const getColorConfig = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-white',
          border: 'border-light',
          text: 'text-primary',
          iconBg: 'bg-primary-subtle'
        };
      case 'accent':
        return {
          bg: 'bg-white',
          border: 'border-light',
          text: 'text-info',
          iconBg: 'bg-info-subtle'
        };
      case 'warning':
        return {
          bg: 'bg-white',
          border: 'border-light',
          text: 'text-warning',
          iconBg: 'bg-warning-subtle'
        };
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-light',
          text: 'text-success',
          iconBg: 'bg-success-subtle'
        };
      case 'danger':
        return {
          bg: 'bg-white',
          border: 'border-light',
          text: 'text-danger',
          iconBg: 'bg-danger-subtle'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-light',
          text: 'text-dark',
          iconBg: 'bg-light'
        };
    }
  };

  const config = getColorConfig();

  return (
    <div className={`card shadow-sm border ${config.border} p-3 ${config.bg}`} style={{ borderRadius: '10px' }}>
      <div className="d-flex items-center justify-content-between">
        <span className="text-muted text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '9px' }}>{title}</span>
        <div 
          className={`p-2 rounded d-flex align-items-center justify-content-center ${config.iconBg} ${config.text}`}
          style={{ width: '32px', height: '32px' }}
        >
          <IconComponent size={14} />
        </div>
      </div>

      <div className="d-flex align-items-baseline gap-1.5 mt-2 mb-0.5">
        <span className="h4 font-weight-bold text-dark mb-0">{value}</span>
        {percentage !== null && (
          <span 
            className={`
              badge py-1 px-1.5 rounded d-flex align-items-center gap-0.5
              ${trend === 'up' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}
            `}
            style={{ fontSize: '9px' }}
          >
            {trend === 'up' ? '↑' : '↓'} {percentage}%
          </span>
        )}
      </div>

      <span className="text-muted" style={{ fontSize: '11px' }}>{subtext}</span>
    </div>
  );
};

export default StatCard;
