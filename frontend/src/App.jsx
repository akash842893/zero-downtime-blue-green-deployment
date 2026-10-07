import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import DeploymentStatusPage from './pages/DeploymentStatusPage';
import HealthPage from './pages/HealthPage';
import { fetchHealth, fetchVersion, fetchTasks, createTask, updateTask, deleteTask } from './services/api';

export default function App() {
  const [user, setUser] = useState({ username: 'admin', role: 'DevOps Engineer' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [versionInfo, setVersionInfo] = useState({ version: '1.0.0', environment: 'blue' });
  const [healthStatus, setHealthStatus] = useState({ status: 'healthy' });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [v, h, t] = await Promise.all([
        fetchVersion(),
        fetchHealth(),
        fetchTasks()
      ]);
      setVersionInfo(v);
      setHealthStatus(h);
      setTasks(t);
    } catch (err) {
      console.error('Failed loading frontend initial state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (taskData) => {
    const newTask = await createTask(taskData);
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = async (id, taskData) => {
    const updated = await updateTask(id, taskData);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  if (!user) {
    return <LoginPage onLogin={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        versionInfo={versionInfo}
        healthStatus={healthStatus}
        user={user}
        onLogout={() => setUser(null)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardPage
            versionInfo={versionInfo}
            tasks={tasks}
            onRefresh={loadData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksPage
            tasks={tasks}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'deployment' && (
          <DeploymentStatusPage versionInfo={versionInfo} />
        )}

        {activeTab === 'health' && (
          <HealthPage
            healthStatus={healthStatus}
            versionInfo={versionInfo}
            onRefresh={loadData}
          />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        Zero-Downtime Blue-Green Platform &bull; Active Node Env: {versionInfo?.environment?.toUpperCase() || 'BLUE'} &bull; v{versionInfo?.version || '1.0.0'}
      </footer>
    </div>
  );
}
