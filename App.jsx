import React, { useState, useEffect, useCallback } from 'react';
import { AlertBanner } from './components/AlertBanner';
import { ThreatMap } from './components/ThreatMap';
import { IncidentLog } from './components/IncidentLog';
import { SystemHealthGauges } from './components/SystemHealthGauges';
// Removed TypeScript type imports
import { Loader2, ShieldCheck, Zap } from 'lucide-react';
import { analyzeThreat } from './services/geminiService';

const MOCK_INCIDENTS = [
  { id: 'INC-2049', severity: 'critical', sourceIp: '192.168.45.12', target: 'Auth-Server-01', timestamp: '2023-10-27 14:02:11', type: 'Brute Force' },
  { id: 'INC-2048', severity: 'high', sourceIp: '45.22.19.112', target: 'DB-Cluster-04', timestamp: '2023-10-27 13:59:45', type: 'SQL Injection' },
  { id: 'INC-2047', severity: 'medium', sourceIp: '89.102.11.5', target: 'Gateway-East', timestamp: '2023-10-27 13:45:22', type: 'Port Scan' },
  { id: 'INC-2046', severity: 'low', sourceIp: '10.0.5.22', target: 'File-Share', timestamp: '2023-10-27 13:30:10', type: 'Access Denied' },
  { id: 'INC-2045', severity: 'critical', sourceIp: '201.44.12.99', target: 'Main-Frame-X', timestamp: '2023-10-27 13:15:00', type: 'DDoS' },
];

const INITIAL_METRICS = {
  cpu: 45,
  network: 62,
  firewall: 98,
};

const INITIAL_ALERT = {
  id: 'ALT-001',
  level: 'critical',
  message: 'UNAUTHORIZED ACCESS DETECTED: SECTOR 7G',
};

const App = () => {
  // Removed generic type parameters from useState
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [activeAlert, setActiveAlert] = useState(INITIAL_ALERT);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKeyAvailable, setApiKeyAvailable] = useState(false);

  useEffect(() => {
    // Check if API key is roughly available (not empty)
    if (process.env.API_KEY && process.env.API_KEY.length > 0) {
      setApiKeyAvailable(true);
    }
    
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
        network: Math.min(100, Math.max(0, prev.network + (Math.random() * 15 - 7))),
        firewall: Math.min(100, Math.max(80, prev.firewall + (Math.random() * 2 - 1))), // Firewall usually stable
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Removed type annotation for 'incident' parameter
  const handleAnalyze = async (incident) => {
    if (!apiKeyAvailable) return;
    
    setSelectedIncident(incident);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeThreat(incident);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysisResult("Analysis failed. Connection to AI Core unstable.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseAnalysis = () => {
    setSelectedIncident(null);
    setAnalysisResult(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-cyan-500 overflow-hidden font-mono selection:bg-cyan-900 selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/50 bg-slate-900/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-widest text-cyan-100 font-[Rajdhani]">
            SENTINEL <span className="text-cyan-600">CYBERDASH</span>
          </h1>
        </div>
        <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
           <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${apiKeyAvailable ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></span>
            <span className={apiKeyAvailable ? 'text-green-400' : 'text-red-400'}>
              AI CORE: {apiKeyAvailable ? 'ONLINE' : 'OFFLINE'}
            </span>
           </div>
           <div className="text-slate-400">System Time: {new Date().toLocaleTimeString()}</div>
           <div className="px-3 py-1 border border-cyan-800 rounded bg-cyan-950/30 text-cyan-300">
             V.2.4.1-RC
           </div>
        </div>
      </header>

      {/* Alert Banner */}
      <AlertBanner alert={activeAlert} onDismiss={() => setActiveAlert(null)} />

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden relative">
        {/* Left Column: Threat Map (8/12) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 min-h-0 relative">
          <div className="flex-1 border border-cyan-900/50 rounded-lg bg-slate-900/50 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-2 left-2 z-10 bg-black/60 px-2 py-1 text-xs text-cyan-400 border border-cyan-800/50 rounded">
              GLOBAL THREAT VECTOR MAP // LIVE
            </div>
            <ThreatMap />
            {/* Map Overlay Grid Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          </div>
          
          {/* System Gauges (Bottom Left) */}
          <div className="h-48 border border-cyan-900/50 rounded-lg bg-slate-900/50 p-4 relative">
             <div className="absolute top-2 left-2 text-xs text-cyan-600 font-bold uppercase tracking-wider">System Telemetry</div>
             <SystemHealthGauges metrics={metrics} />
          </div>
        </div>

        {/* Right Column: Incident Log & Details (4/12) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-1 border border-cyan-900/50 rounded-lg bg-slate-900/80 overflow-hidden flex flex-col relative">
             <div className="p-3 border-b border-cyan-900/50 bg-cyan-950/20 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-300 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Incident Log
                </h2>
                <span className="text-xs text-cyan-700">{incidents.length} ACTV</span>
             </div>
             <div className="flex-1 overflow-auto">
                <IncidentLog 
                  incidents={incidents} 
                  onAnalyze={handleAnalyze} 
                  apiKeyAvailable={apiKeyAvailable}
                />
             </div>
          </div>

          {/* Analysis Panel (Pop-up or persistent if selected) */}
          {selectedIncident && (
            <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8 transition-all duration-300">
               <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-lg flex flex-col max-h-full">
                  <div className="flex items-center justify-between p-4 border-b border-cyan-800 bg-cyan-950/30">
                     <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                        AI THREAT ANALYSIS <span className="text-xs bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded ml-2">{selectedIncident.id}</span>
                     </h3>
                     <button onClick={handleCloseAnalysis} className="text-cyan-700 hover:text-cyan-400 transition-colors">
                        [CLOSE]
                     </button>
                  </div>
                  <div className="p-6 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300">
                     {isAnalyzing ? (
                       <div className="flex flex-col items-center justify-center py-12 gap-4">
                         <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                         <p className="animate-pulse text-cyan-500">DECRYPTING PACKETS & ANALYZING PATTERNS...</p>
                       </div>
                     ) : (
                       <div className="prose prose-invert prose-sm max-w-none">
                         <div className="mb-4 grid grid-cols-2 gap-4 text-xs border-b border-slate-800 pb-4">
                            <div><span className="text-slate-500">SOURCE:</span> <span className="text-red-400 font-bold">{selectedIncident.sourceIp}</span></div>
                            <div><span className="text-slate-500">TARGET:</span> <span className="text-cyan-400">{selectedIncident.target}</span></div>
                            <div><span className="text-slate-500">TYPE:</span> <span className="text-yellow-400">{selectedIncident.type}</span></div>
                            <div><span className="text-slate-500">TIMESTAMP:</span> {selectedIncident.timestamp}</div>
                         </div>
                         <div className="whitespace-pre-wrap">
                            {analysisResult}
                         </div>
                       </div>
                     )}
                  </div>
                  <div className="p-4 border-t border-cyan-800 bg-black/20 text-xs text-center text-slate-600 uppercase">
                    CONFIDENTIAL // FOR AUTHORIZED EYES ONLY
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
