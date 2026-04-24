import { Project } from '../types';

interface Props {
  projects: Project[];
  loading: boolean;
  onSelectProject: (p: Project) => void;
  onNewProject: () => void;
}

function getDaysUntil(dateStr: string) {
  const due = new Date(dateStr);
  const now = new Date();
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getTaskStats(project: Project) {
  const allTasks = project.phases.flatMap((ph) => ph.tasks);
  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === 'completed').length;
  const inProgress = allTasks.filter((t) => t.status === 'in_progress').length;
  return { total, completed, inProgress };
}

export default function ProjectList({ projects, loading, onSelectProject, onNewProject }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No projects yet</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Create your first group project and let AI generate a complete project plan for your team.
        </p>
        <button onClick={onNewProject} className="btn-primary">
          Create Your First Project
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
          <p className="text-slate-500 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={onNewProject} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const days = getDaysUntil(project.dueDate);
          const stats = getTaskStats(project);
          const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          const isOverdue = days < 0;
          const isUrgent = days >= 0 && days <= 3;

          return (
            <button
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="card p-6 text-left hover:shadow-md hover:border-indigo-300 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-indigo-700 transition-colors truncate">
                    {project.name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{project.description}</p>
                </div>
                {project.aiGenerated && (
                  <span className="badge bg-indigo-100 text-indigo-700 ml-2 flex-shrink-0">
                    ✨ AI
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`badge ${
                  isOverdue ? 'bg-red-100 text-red-700' :
                  isUrgent ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {isOverdue
                    ? `${Math.abs(days)} days overdue`
                    : days === 0
                    ? 'Due today!'
                    : `${days} days left`}
                </span>
                <span className="text-slate-400 text-xs">
                  Due {new Date(project.dueDate).toLocaleDateString()}
                </span>
              </div>

              {stats.total > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{stats.completed}/{stats.total} tasks</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex -space-x-2">
                  {project.teamMembers.slice(0, 4).map((m) => (
                    <div key={m.id}
                      className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-indigo-700"
                      title={m.name}
                    >
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {project.teamMembers.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500">
                      +{project.teamMembers.length - 4}
                    </div>
                  )}
                  {project.teamMembers.length === 0 && (
                    <span className="text-slate-400 text-xs">No members</span>
                  )}
                </div>
                <span className="text-slate-400 text-xs">
                  {project.phases.length} phase{project.phases.length !== 1 ? 's' : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
