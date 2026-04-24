import { useState } from 'react';
import { Project, Task } from '../types';
import { updateProject } from '../api';

interface Props {
  project: Project;
  onUpdated: (p: Project) => void;
}

const STATUS_COLS = [
  { id: 'not_started', label: 'Not Started', color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400', border: 'border-slate-200' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500', border: 'border-indigo-200' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
] as const;

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-slate-100 text-slate-600',
};

export default function TaskBoard({ project, onUpdated }: Props) {
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const allTasks = project.phases.flatMap((ph) =>
    ph.tasks.map((t) => ({ ...t, phaseName: ph.name, phaseId: ph.id }))
  );

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      setUpdatingTask(taskId);
      const updatedPhases = project.phases.map((ph) => ({
        ...ph,
        tasks: ph.tasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        ),
      }));
      const updated = await updateProject(project.id, { phases: updatedPhases });
      onUpdated(updated);
    } finally {
      setUpdatingTask(null);
    }
  };

  if (project.phases.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-500">No tasks yet. Generate an AI plan to populate the task board.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUS_COLS.map((col) => {
          const colTasks = allTasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className={`card border ${col.border} flex flex-col`}>
              <div className={`px-4 py-3 rounded-t-xl ${col.color} border-b ${col.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <span className="font-semibold text-sm">{col.label}</span>
                  </div>
                  <span className="text-sm font-bold">{colTasks.length}</span>
                </div>
              </div>
              <div className="flex-1 p-3 space-y-2 min-h-[200px]">
                {colTasks.length === 0 && (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-slate-400 text-sm text-center">No tasks</p>
                  </div>
                )}
                {colTasks.map((task) => (
                  <div key={task.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-slate-900 text-sm leading-tight">{task.title}</h4>
                      <span className={`badge ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.low} flex-shrink-0 capitalize`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                        {task.assignedTo ? task.assignedTo.charAt(0).toUpperCase() : '?'}
                      </div>
                      <span className="text-xs text-slate-600 truncate">{task.assignedTo || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Due {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <select
                        value={task.status}
                        disabled={updatingTask === task.id}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                        className="text-xs border border-slate-200 rounded px-1.5 py-1 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <span className="badge bg-slate-50 text-slate-500 text-xs">
                        {task.phaseName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase breakdown */}
      <div className="card p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Tasks by Phase</h2>
        <div className="space-y-2">
          {project.phases.map((phase, i) => {
            const isOpen = expandedPhase === phase.id;
            const done = phase.tasks.filter((t) => t.status === 'completed').length;
            const pct = phase.tasks.length > 0 ? Math.round((done / phase.tasks.length) * 100) : 0;
            return (
              <div key={phase.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedPhase(isOpen ? null : phase.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900 text-sm">{phase.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{done}/{phase.tasks.length} done · {pct}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-200 divide-y divide-slate-100">
                    {phase.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500">{task.assignedTo || 'Unassigned'}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-400">Due {new Date(task.deadline).toLocaleDateString()}</span>
                            <span className={`badge ${PRIORITY_COLORS[task.priority] || ''} ml-1`}>{task.priority}</span>
                          </div>
                        </div>
                        <select
                          value={task.status}
                          disabled={updatingTask === task.id}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                          className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
