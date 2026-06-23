import React from 'react';
import { AlertCircle, Clock, CalendarDays } from 'lucide-react';
import { getDaysRemaining, formatShortDate } from '../../utils/dateUtils';

export const DeadlineBadge = ({ dueDate }) => {
  const daysLeft = getDaysRemaining(dueDate);

  const getBadgeConfig = () => {
    if (daysLeft < 0) {
      return {
        text: `Quá hạn (${Math.abs(daysLeft)} ngày)`,
        className: 'badge bg-danger text-white',
        icon: AlertCircle
      };
    }
    if (daysLeft === 0) {
      return {
        text: 'Hôm nay',
        className: 'badge bg-warning text-dark',
        icon: AlertCircle
      };
    }
    if (daysLeft === 1) {
      return {
        text: 'Ngày mai',
        className: 'badge bg-info text-white',
        icon: Clock
      };
    }
    if (daysLeft < 4) {
      return {
        text: `${daysLeft} ngày còn lại`,
        className: 'badge bg-primary-subtle text-primary border border-primary-subtle',
        icon: Clock
      };
    }
    return {
      text: `${formatShortDate(dueDate)}`,
      className: 'badge bg-light text-secondary border border-light-subtle',
      icon: CalendarDays
    };
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <span 
      className={`d-inline-flex align-items-center gap-1 px-2.5 py-1 text-uppercase tracking-wider rounded-pill ${config.className}`}
      style={{ fontSize: '9px', fontWeight: 'bold' }}
    >
      <IconComponent size={9} className="stroke-[2.5]" />
      <span>{config.text}</span>
    </span>
  );
};

export default DeadlineBadge;
