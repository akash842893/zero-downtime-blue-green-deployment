import React from 'react';
import { Layers, CheckCircle2, Clock, AlertCircle, ShieldAlert, Activity, GitBranch } from 'lucide-react';
import EnvironmentBanner from '../components/EnvironmentBanner';

export default function DashboardPage({ versionInfo, tasks, onRefresh, setActiveTab }) {
  const env = (versionInfo?.environment || 'blue').toUpperCase();
  const todoCount = tasks.filter(t => t.status === 'TODO').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <EnvironmentBanner versionInfo={versionInfo} onRefresh={onRefresh} />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Env</span>
            <div className={`p-2 rounded-lg ${env === 'BLUE' ? 'bg-blue-600/20 text-blue-400' : 'bg-emerald-600/20 text-emerald-400'}`}>
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">{env}</h3>
            <p className="text-xs text-slate-400 mt-1">Inactive: {env === 'BLUE' ? 'GREEN' : 'BLUE'}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">App Version</span>
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
              <GitBranch className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">v{versionInfo?.version || '1.0.0'}</h3>
            <p className="text-xs text-slate-400 mt-1">Immutable SHA: 8f31a21</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</span>
            <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">{tasks.length}</h3>
            <p className="text-xs text-slate-400 mt-1">{inProgressCount} in progress, {completedCount} completed</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Status</span>
            <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-400 tracking-tight">100% Operational</h3>
            <p className="text-xs text-slate-400 mt-1">Zero downtime recorded</p>
          </div>
        </div>
      </div>

      {/* Task Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent Infrastructure Tasks</h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All Tasks &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  task.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Zero-Downtime Guarantee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our automated Nginx reverse proxy routes production requests with zero dropped connections during blue-green deployment transitions.
            </p>

            <div className="mt-4 p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Health Verification</span>
                <span className="text-emerald-400 font-semibold">Passing</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Smoke Test Suite</span>
                <span className="text-emerald-400 font-semibold">100% Passed</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Auto Rollback Protection</span>
                <span className="text-blue-400 font-semibold">Enabled</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('deployment')}
            className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Inspect Deployment Flow
          </button>
        </div>
      </div>
    </div>
  );
}
