import { Project } from '../types';

interface Props {
  project: Project;
}

export default function MeetingAgenda({ project }: Props) {
  if (project.meetingAgenda.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-500">No meeting agenda yet. Generate an AI plan to create one.</p>
      </div>
    );
  }

  const totalMinutes = project.meetingAgenda.reduce((acc, item) => {
    const match = item.duration.match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-slate-900 text-lg">Meeting Agenda</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {project.meetingAgenda.length} items · ~{totalMinutes} minutes total
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          {project.meetingAgenda.map((item, i) => (
            <div key={item.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                {i < project.meetingAgenda.length - 1 && (
                  <div className="w-0.5 bg-indigo-200 flex-1 mt-1 min-h-[20px]" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="card p-4 group-hover:border-indigo-200 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">{item.topic}</h3>
                    <div className="flex items-center gap-2">
                      <span className="badge bg-indigo-100 text-indigo-700">
                        <svg className="w-3 h-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {item.presenter ? item.presenter.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="text-sm text-slate-600">
                      Presenter: <span className="font-medium">{item.presenter || 'TBD'}</span>
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary card */}
      <div className="card p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-3">Meeting Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-indigo-700">{project.meetingAgenda.length}</p>
            <p className="text-xs text-indigo-600">Agenda Items</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-700">{totalMinutes}</p>
            <p className="text-xs text-indigo-600">Total Minutes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-700">
              {new Set(project.meetingAgenda.map((a) => a.presenter).filter(Boolean)).size}
            </p>
            <p className="text-xs text-indigo-600">Presenters</p>
          </div>
        </div>
      </div>
    </div>
  );
}
