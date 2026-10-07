import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import TaskModal from '../components/TaskModal';

export default function TasksPage({ tasks, onCreateTask, onUpdateTask, onDeleteTask }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    return task.status === filter;
  });

  const handleOpenCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleSave = (taskData) => {
    if (taskToEdit) {
      onUpdateTask(taskToEdit.id, taskData);
    } else {
      onCreateTask(taskData);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Task Management Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">Manage infrastructure deployments and system verification tasks</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Task Board Columns / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['TODO', 'IN_PROGRESS', 'COMPLETED'].map(colStatus => {
          const colTasks = tasks.filter(t => t.status === colStatus);
          return (
            <div key={colStatus} className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(colStatus)}
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">{colStatus}</h3>
                </div>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs font-mono">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                    No tasks in {colStatus}
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div key={task.id} className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => handleOpenEdit(task)}
                            className="p-1 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{task.description}</p>
                      )}

                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>ID: #{task.id}</span>
                        <span>{new Date(task.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
