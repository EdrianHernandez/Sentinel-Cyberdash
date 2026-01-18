import React from 'react';
import { Incident } from '../types';
import { Search, Terminal, AlertOctagon, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface IncidentLogProps {
  incidents: Incident[];
  onAnalyze: (incident: Incident) => void;
  apiKeyAvailable: boolean;
}

export const IncidentLog: React.FC<IncidentLogProps> = ({ incidents, onAnalyze, apiKeyAvailable }) => {
  const getSeverityConfig = (severity: string) => {
    switch(severity) {
      case 'critical': return {
        styles: 'bg-red-950/40 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
        icon: <AlertOctagon className="w-3 h-3 animate-[pulse_2s_infinite]" />
      };
      case 'high': return {
        styles: 'bg-orange-950/40 border-orange-500/50 text-orange-400',
        icon: <AlertTriangle className="w-3 h-3" />
      };
      case 'medium': return {
        styles: 'bg-yellow-950/40 border-yellow-500/50 text-yellow-400',
        icon: <ShieldAlert className="w-3 h-3" />
      };
      case 'low': return {
        styles: 'bg-blue-950/40 border-blue-500/50 text-blue-400',
        icon: <CheckCircle2 className="w-3 h-3" />
      };
      default: return {
        styles: 'text-slate-400 border-slate-700',
        icon: null
      };
    }
  };

  return (
    <div className="flex flex-col h-full text-xs font-mono relative">
      {/* Search Bar Stub */}
      <div className="flex items-center gap-2 p-3 border-b border-cyan-900/30 bg-black/20 backdrop-blur-sm">
        <Search className="w-3 h-3 text-cyan-700" />
        <input 
          type="text" 
          placeholder="SEARCH LOGS_..." 
          className="bg-transparent border-none outline-none text-cyan-500 placeholder-cyan-800 w-full focus:placeholder-cyan-700 transition-colors"
          disabled
        />
      </div>

      <div className="overflow-auto custom-scrollbar flex-1 relative">
        <table className="w-full text-left border-collapse relative z-10">
          <thead className="bg-slate-900/90 sticky top-0 backdrop-blur-md z-20 text-cyan-600 font-bold tracking-wider text-[10px] uppercase shadow-lg shadow-black/40">
            <tr>
              <th className="p-3 border-b border-cyan-900/50 w-24">Severity</th>
              <th className="p-3 border-b border-cyan-900/50 w-32">Time</th>
              <th className="p-3 border-b border-cyan-900/50">Source</th>
              <th className="p-3 border-b border-cyan-900/50 hidden lg:table-cell">Target</th>
              <th className="p-3 border-b border-cyan-900/50 w-16 text-center">CMD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-900/20">
            {incidents.map((incident) => {
              const config = getSeverityConfig(incident.severity);
              return (
                <tr 
                  key={incident.id} 
                  className="group hover:bg-cyan-950/30 transition-all duration-200 cursor-default relative overflow-hidden"
                >
                  <td className="p-2 pl-3 align-middle">
                     <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold uppercase w-full justify-center ${config.styles}`}>
                       {config.icon}
                       <span>{incident.severity.substring(0, 3)}</span>
                     </div>
                  </td>
                  <td className="p-2 text-cyan-600/80 tabular-nums group-hover:text-cyan-400 transition-colors">
                    {incident.timestamp.split(' ')[1]}
                  </td>
                  <td className="p-2 text-cyan-300 font-medium tracking-wide group-hover:text-cyan-100 transition-colors shadow-cyan-500/0 group-hover:shadow-cyan-500/20">
                    {incident.sourceIp}
                  </td>
                  <td className="p-2 text-slate-500 hidden lg:table-cell group-hover:text-slate-300 transition-colors">
                    {incident.target}
                  </td>
                  <td className="p-2 text-center relative">
                    {/* Hover Glow Effect for Row */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300" />
                    
                    <button 
                      onClick={() => onAnalyze(incident)}
                      disabled={!apiKeyAvailable}
                      className={`
                        p-1.5 rounded-md border 
                        ${apiKeyAvailable 
                          ? 'border-cyan-800 text-cyan-600 bg-cyan-950/30 hover:bg-cyan-900 hover:text-cyan-200 hover:border-cyan-500 hover:shadow-[0_0_8px_rgba(6,182,212,0.5)] cursor-pointer' 
                          : 'border-slate-800 text-slate-700 bg-slate-900/50 cursor-not-allowed'}
                        transition-all duration-200
                      `}
                      title={apiKeyAvailable ? "Run AI Analysis" : "AI Core Offline"}
                    >
                      <Terminal className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
             {/* Aesthetic Grid Lines / Filler */}
             {Array.from({ length: 6 }).map((_, i) => (
               <tr key={`filler-${i}`} className="hover:bg-transparent">
                 <td className="p-3 text-slate-800/50 font-mono text-[10px]">null</td>
                 <td className="p-3 text-slate-800/50 font-mono text-[10px]">--:--:--</td>
                 <td className="p-3 text-slate-800/50 font-mono text-[10px]">...</td>
                 <td className="p-3 text-slate-800/50 hidden lg:table-cell font-mono text-[10px]">...</td>
                 <td className="p-3"></td>
               </tr>
            ))}
          </tbody>
        </table>
        
        {/* Background Scanline Pattern for Table Area */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-0 opacity-50"></div>
      </div>
    </div>
  );
};