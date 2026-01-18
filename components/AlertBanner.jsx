import React from 'react';
// Removed TypeScript type import
import { AlertTriangle, X } from 'lucide-react';

// Removed AlertBannerProps interface and React.FC generic annotation
export const AlertBanner = ({ alert, onDismiss }) => {
  if (!alert) return null;

  const bgColors = {
    critical: 'bg-red-950/90 border-red-600 text-red-100',
    warning: 'bg-yellow-950/90 border-yellow-600 text-yellow-100',
    info: 'bg-blue-950/90 border-blue-600 text-blue-100',
  };

  const pulseColor = {
    critical: 'animate-[pulse_1s_ease-in-out_infinite]',
    warning: 'animate-pulse',
    info: '',
  };

  return (
    <div className={`w-full px-4 py-2 border-b-2 flex items-center justify-between shadow-[0_0_15px_rgba(0,0,0,0.5)] z-50 backdrop-blur-sm ${bgColors[alert.level]}`}>
      <div className="flex items-center gap-3">
        <AlertTriangle className={`w-5 h-5 ${pulseColor[alert.level]}`} />
        <span className="font-bold tracking-widest uppercase text-sm">
          [{alert.level}] {alert.message}
        </span>
      </div>
      <button 
        onClick={onDismiss}
        className="hover:bg-black/20 p-1 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
