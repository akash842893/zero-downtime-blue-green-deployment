import React from 'react';
import { LayoutDashboard, CheckSquare, Activity, Cpu, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, versionInfo, healthStatus, user, onLogout }) {
  const isBlue = (versionInfo?.environment || 'blue').toLowerCase() === 'blue';

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">Blue-Green Ops</span>
              <span className="ml-2 text-xs font-mono text-slate-400">v{versionInfo?.version || '1.0.0'}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard' ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tasks' ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Task Board</span>
            </button>

            <button
              onClick={() => setActiveTab('deployment')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'deployment' ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Deployment</span>
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'health' ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>System Health</span>
            </button>
          </div>

          {/* Environment & Health Badges */}
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
              isBlue ? 'badge-blue' : 'badge-green'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isBlue ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
              <span>Env: {versionInfo?.environment || 'BLUE'}</span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
              <span className="hidden sm:inline">System Healthy</span>
            </div>

            {user && (
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
