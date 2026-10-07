import React from 'react';
import { Layers, CheckCircle, Server, RefreshCw } from 'lucide-react';

export default function EnvironmentBanner({ versionInfo, onRefresh }) {
  const env = (versionInfo?.environment || 'blue').toUpperCase();
  const isBlue = env === 'BLUE';

  return (
    <div className={`p-4 rounded-xl border mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
      isBlue 
        ? 'bg-blue-950/40 border-blue-800/40 text-blue-200' 
        : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
    }`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${isBlue ? 'bg-blue-600/20 text-blue-400' : 'bg-emerald-600/20 text-emerald-400'}`}>
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white">Active Traffic Environment: {env}</h2>
            <span className={`px-2 py-0.5 text-xs font-mono rounded ${
              isBlue ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              v{versionInfo?.version || '1.0.0'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-downtime routing active. Reverse proxy Nginx routing live requests to upstream pool <code className="font-mono">{env.toLowerCase()}_upstream</code>.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        <button
          onClick={onRefresh}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Status</span>
        </button>
      </div>
    </div>
  );
}
