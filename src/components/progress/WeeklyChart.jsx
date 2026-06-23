import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import useProgress from '../../hooks/useProgress';

export const WeeklyChart = () => {
  const { weeklyChartData } = useProgress();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 rounded border border-light shadow-lg flex flex-col gap-1"
          style={{ background: '#ffffff', fontSize: '11px' }}
        >
          <p className="font-weight-bold text-dark mb-1">Chi tiết {label}</p>
          {payload.map((item, idx) => (
            <div key={idx} className="d-flex align-items-center gap-1.5 text-secondary">
              <div className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: item.color }} />
              <span>{item.name}:</span>
              <strong className="text-dark">{item.value} giờ</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-100 h-80" style={{ minHeight: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={weeklyChartData}
          margin={{ top: 20, right: 10, bottom: 5, left: -25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false}
            dy={8}
          />
          
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dx={-4}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle" 
            iconSize={6}
            wrapperStyle={{ fontSize: '11px', color: '#64748b' }}
          />

          <ReferenceLine 
            y={payload => payload?.length ? payload[0].Target : 4} 
            stroke="#f59e0b" 
            strokeDasharray="3 3"
            label={{ 
              value: 'Mục tiêu ngày', 
              fill: '#d97706', 
              fontSize: 9, 
              position: 'insideBottomRight',
              offset: 8
            }} 
          />

          {/* Scheduled Study Bars */}
          <Bar 
            name="Lịch dự kiến (giờ)" 
            dataKey="Scheduled" 
            barSize={16}
            radius={[4, 4, 0, 0]}
            fill="#e2e8f0" 
            stroke="#cbd5e1"
            strokeWidth={1}
          />

          {/* Actual Hours studied Bar */}
          <Bar 
            name="Thực tế học (giờ)" 
            dataKey="Actual" 
            barSize={16}
            radius={[4, 4, 0, 0]}
            fill="#0284c7" 
          />

          <Line 
            name="Hạn mức tiêu chuẩn" 
            type="monotone" 
            dataKey="Target" 
            stroke="#0ea5e9" 
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
