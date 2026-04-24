import { useState } from 'react';
import { Project } from '../types';
import { generateAIPlan, deleteProject } from '../api';
import TaskBoard from './TaskBoard';
import MeetingAgenda from './MeetingAgenda';
import ReminderSchedule from './ReminderSchedule';
import SubmissionChecklist from './SubmissionChecklist';
import TeamMembers from './TeamMembers';

type Tab = 'overview' | 'tasks' | 'agenda' | 'reminders' | 'checklist';

interface Props {
  project: Project;
  onUpdated: (p: Project) => void;
  onDeleted: (id: string) => void;
}

export default function ProjectDetail({ project, onUpdated, onDeleted }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const allTasks = project.phases.flatMap((ph) => ph.tasks);
  const completed = allTasks.filter((t) => t.status === 'completed').length;
  const inProgress = allTasks.filter((t) => t.status === 'in_progress').length;
  const pct = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;
  const daysLeft = Math.ceil((new Date(project.dueDate).getTime() - Date.now()) / 86400000);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const updated = await generateAIPlan(project.id);
      onUpdated(updated);
      setTab('tasks');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      onDeleted(project.id);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'tasks', label: 'Task Board', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'agenda', label: 'Meeting Agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'reminders', label: 'Reminders', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'checklist', label: 'Checklist', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div>
      {/* Project Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 truncate">{project.name}</h1>
              {project.aiGenerated && (
                <span className="badge bg-indigo-100 text-indigo-700 flex-shrink-0">✨ AI Generated</span>
              )}
            </div>
            <p className="text-slate-600 mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className={`flex items-center gap-1.5 font-medium ${
                daysLeft < 0 ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-600' : 'text-slate-600'
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : daysLeft === 0 ? 'Due today!' : `${daysLeft} days remaining`}
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.teamMembers.length} member{project.teamMembers.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {project.aiGenerated ? 'Regenerate Plan' : 'Generate AI Plan'}
                </>
              )}
            </button>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="btn-danger text-sm">
                Delete Project
              </button>
            ) : (
              <div className="flex gap-1">
                <button onClick={() => setConfirmDelete(false)} className="btn-secondary text-xs flex-1">Cancel</button>
                <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold flex-1">
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {allTasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Overall Progress</span>
              <span className="font-semibold text-slate-900">{pct}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: pct === 100 ? '#10b981' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                {allTasks.length - completed - inProgress} not started
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                {inProgress} in progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                {completed} completed
              </span>
            </div>
          </div>
        )}

        {generating && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 bg-indigo-50 rounded-lg px-4 py-3">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-indigo-900">AI is generating your project plan...</p>
                <p className="text-xs text-indigo-600">This may take 10-20 seconds. Sit tight!</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 mb-6 bg-white rounded-xl border border-slate-200 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center ${
              tab === t.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
            </svg>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Phase overview */}
            {project.phases.length > 0 ? (
              <div className="card p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Project Phases</h2>
                <div className="space-y-3">
                  {project.phases.map((phase, i) => {
                    const phaseTasks = phase.tasks.length;
                    const phaseDone = phase.tasks.filter((t) => t.status === 'completed').length;
                    const phasePct = phaseTasks > 0 ? Math.round((phaseDone / phaseTasks) * 100) : 0;
                    return (
                      <div key={phase.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 truncate">{phase.name}</h3>
                            <p className="text-xs text-slate-500">
                              {new Date(phase.startDate).toLocaleDateString()} – {new Date(phase.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs text-slate-500 flex-shrink-0">{phaseDone}/{phaseTasks}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-400 rounded-full transition-all"
                            style={{ width: `${phasePct}%` }}
                          />
                        </div>
                        {phase.description && (
                          <p className="text-xs text-slate-500 mt-2">{phase.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">No plan generated yet</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Click "Generate AI Plan" to let GPT-4o-mini create a complete project plan for your team.
                </p>
                <button onClick={handleGenerate} disabled={generating} className="btn-primary">
                  Generate AI Plan
                </button>
              </div>
            )}
          </div>
          <div>
            <TeamMembers project={project} onUpdated={onUpdated} />
          </div>
        </div>
      )}

      {tab === 'tasks' && (
        <TaskBoard project={project} onUpdated={onUpdated} />
      )}
      {tab === 'agenda' && (
        <MeetingAgenda project={project} />
      )}
      {tab === 'reminders' && (
        <ReminderSchedule project={project} />
      )}
      {tab === 'checklist' && (
        <SubmissionChecklist project={project} onUpdated={onUpdated} />
      )}
    </div>
  );
}
