import React from 'react';
import { Layers, ShieldCheck, ArrowRight, Server, Terminal, CheckCircle2 } from 'lucide-react';

export default function DeploymentStatusPage({ versionInfo }) {
  const activeEnv = (versionInfo?.environment || 'blue').toUpperCase();
  const inactiveEnv = activeEnv === 'BLUE' ? 'GREEN' : 'BLUE';

  const steps = [
    { num: 1, label: 'Detect Active Environment', status: 'Completed', details: `Active target identified as ${activeEnv}` },
    { num: 2, label: 'Deploy Image to Inactive Env', status: 'Completed', details: `Targeting ${inactiveEnv} container stack` },
    { num: 3, label: 'Run Container Health Checks', status: 'Completed', details: 'HTTP 200 /health returning status=healthy' },
    { num: 4, label: 'Execute Automated Smoke Tests', status: 'Completed', details: 'Validated API CRUD endpoints & database connectivity' },
    { num: 5, label: 'Switch Nginx Proxy Traffic', status: 'Active', details: `Reloading Nginx with ${activeEnv} upstream pool` },
    { num: 6, label: 'Retire Legacy Environment', status: 'Standby', details: `Retaining ${inactiveEnv} for fast rollback guarantee` },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-1">Zero-Downtime Deployment Topology</h2>
        <p className="text-xs text-slate-400">Visual state of Nginx proxy routing and active environment pool</p>

        {/* Interactive Diagram */}
        <div className="mt-6 p-6 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Nginx Box */}
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 text-center">
            <div className="inline-flex p-2 bg-emerald-600/20 text-emerald-400 rounded-lg mb-2">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Nginx Reverse Proxy</h4>
            <p className="text-[11px] text-slate-400 mt-1">Port 80 / 443 Router</p>
          </div>

          {/* Traffic Arrows */}
          <div className="hidden md:flex flex-col items-center justify-center space-y-2 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-1 text-emerald-400">
              <span>Active Traffic Stream</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          {/* Target Containers */}
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border ${
              activeEnv === 'BLUE' 
                ? 'bg-blue-950/60 border-blue-600/80 text-blue-200 shadow-lg shadow-blue-900/20' 
                : 'bg-slate-900 border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono">BLUE ENVIRONMENT</span>
                {activeEnv === 'BLUE' && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] rounded font-bold">ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Frontend: 3001 | Backend: 8001</p>
            </div>

            <div className={`p-4 rounded-lg border ${
              activeEnv === 'GREEN' 
                ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200 shadow-lg shadow-emerald-900/20' 
                : 'bg-slate-900 border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono">GREEN ENVIRONMENT</span>
                {activeEnv === 'GREEN' && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded font-bold">ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Frontend: 3002 | Backend: 8002</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Pipeline Checklist */}
      <div className="glass-card p-6 rounded-xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Deployment Pipeline Execution Steps</h3>
        <div className="space-y-3">
          {steps.map(step => (
            <div key={step.num} className="p-3.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step.status === 'Completed' ? 'bg-emerald-600 text-white' :
                  step.status === 'Active' ? 'bg-blue-600 text-white animate-pulse' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {step.num}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{step.label}</h4>
                  <p className="text-xs text-slate-400">{step.details}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                step.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                step.status === 'Active' ? 'bg-blue-500/10 text-blue-400' :
                'bg-slate-800 text-slate-400'
              }`}>
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
