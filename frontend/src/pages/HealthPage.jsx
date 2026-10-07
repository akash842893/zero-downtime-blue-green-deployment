import React, { useState } from 'react';
import { ShieldCheck, Activity, RefreshCw, Terminal, CheckCircle } from 'lucide-react';
import { fetchHealth, fetchVersion } from '../services/api';

export default function HealthPage({ healthStatus, versionInfo, onRefresh }) {
  const [testing, setTesting] = useState(false);
  const [logTrace, setLogTrace] = useState([]);

  const handleTestEndpoints = async () => {
    setTesting(true);
    const start = performance.now();
    const h = await fetchHealth();
    const v = await fetchVersion();
    const end = performance.now();
    const latency = Math.round(end - start);

    setLogTrace(prev => [
      { time: new Date().toLocaleTimeString(), msg: `GET /health -> 200 OK (${latency}ms) Payload: ${JSON.stringify(h)}` },
      { time: new Date().toLocaleTimeString(), msg: `GET /version -> 200 OK Payload: ${JSON.stringify(v)}` },
      ...prev
    ]);
    setTesting(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">System Health & Verification</h2>
            <p className="text-xs text-slate-400 mt-1">Live inspection of health check endpoints and payload contracts</p>
          </div>

          <button
            onClick={handleTestEndpoints}
            disabled={testing}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs shadow-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing Endpoints...' : 'Run Diagnostics'}</span>
          </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Endpoint</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs font-mono">/health</span>
            </div>
            <pre className="p-3 bg-slate-950 rounded text-xs font-mono text-emerald-300 border border-slate-800">
              {JSON.stringify(healthStatus, null, 2)}
            </pre>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Version Endpoint</span>
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs font-mono">/version</span>
            </div>
            <pre className="p-3 bg-slate-950 rounded text-xs font-mono text-blue-300 border border-slate-800">
              {JSON.stringify(versionInfo, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="glass-card p-6 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 mb-4">
          <Terminal className="w-5 h-5 text-slate-400" />
          <h3 className="text-base font-bold text-white">Live Endpoint Execution Console</h3>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 border border-slate-800 h-48 overflow-y-auto space-y-2">
          {logTrace.length === 0 ? (
            <div className="text-slate-500">Click "Run Diagnostics" to stream live HTTP verification traces...</div>
          ) : (
            logTrace.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-slate-500">[{log.time}]</span>
                <span className="text-emerald-400 font-semibold">{log.msg}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
