import React from 'react';
import { SystemMetrics } from '../types';

interface GaugeProps {
  label: string;
  value: number;
  color: string;
}

const Gauge: React.FC<GaugeProps> = ({ label, value, color }) => {
  const radius = 36;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#1e293b" // slate-800
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="filter drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-lg font-bold text-white font-[Rajdhani]">{Math.round(value)}%</span>
        </div>
      </div>
      <span className="mt-2 text-[10px] tracking-widest text-cyan-600 uppercase font-bold">{label}</span>
    </div>
  );
};

interface SystemHealthGaugesProps {
  metrics: SystemMetrics;
}

export const SystemHealthGauges: React.FC<SystemHealthGaugesProps> = ({ metrics }) => {
  return (
    <div className="flex items-center justify-around h-full px-4">
      <Gauge label="CPU LOAD" value={metrics.cpu} color={metrics.cpu > 80 ? '#ef4444' : '#22c55e'} />
      <Gauge label="NET TRAFFIC" value={metrics.network} color={metrics.network > 80 ? '#eab308' : '#3b82f6'} />
      <Gauge label="FIREWALL" value={metrics.firewall} color={metrics.firewall < 90 ? '#ef4444' : '#a855f7'} />
    </div>
  );
};