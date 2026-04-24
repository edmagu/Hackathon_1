import { Project, Reminder } from '../types';

interface Props {
  project: Project;
}

const TYPE_STYLES: Record<Reminder['type'], { bg: string; text: string; icon: string; label: string }> = {
  milestone: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: '🏁', label: 'Milestone' },
  deadline: { bg: 'bg-red-100', text: 'text-red-700', icon: '⏰', label: 'Deadline' },
  meeting: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🤝', label: 'Meeting' },
  general: { bg: 'bg-slate-100', text: 'text-slate-700', icon: '📌', label: 'General' },
};

export default function ReminderSchedule({ project }: Props) {
  if (project.reminderSchedule.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-500">No reminders yet. Generate an AI plan to create a schedule.</p>
      </div>
    );
  }

  const sorted = [...project.reminderSchedule].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-slate-900 text-lg">Reminder Schedule</h2>
            <p className="text-slate-500 text-sm mt-0.5">{project.reminderSchedule.length} reminders set</p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-4">
            {sorted.map((reminder) => {
              const style = TYPE_STYLES[reminder.type] || TYPE_STYLES.general;
              const reminderDate = new Date(reminder.date);
              reminderDate.setHours(0, 0, 0, 0);
              const isPast = reminderDate < today;
              const isToday = reminderDate.getTime() === today.getTime();
              const daysUntil = Math.ceil((reminderDate.getTime() - today.getTime()) / 86400000);

              return (
                <div key={reminder.id} className="flex gap-4 relative">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10 border-2 ${
                    isPast ? 'border-slate-200 bg-slate-100 opacity-60' : `border-white ${style.bg}`
                  }`}>
                    {style.icon}
                  </div>
                  <div className={`flex-1 card p-4 ${isPast ? 'opacity-60' : ''} ${isToday ? 'border-amber-300 bg-amber-50' : ''}`}>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`badge ${style.bg} ${style.text}`}>{style.label}</span>
                        {isToday && <span className="badge bg-amber-100 text-amber-700 font-bold">TODAY</span>}
                        {isPast && <span className="badge bg-slate-100 text-slate-500">Past</span>}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {reminderDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className={`text-sm ${isPast ? 'text-slate-400' : 'text-slate-700'}`}>{reminder.message}</p>
                    {!isPast && !isToday && (
                      <p className="text-xs text-slate-400 mt-1">
                        in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Type breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['milestone', 'deadline', 'meeting', 'general'] as Reminder['type'][]).map((type) => {
          const count = project.reminderSchedule.filter((r) => r.type === type).length;
          const style = TYPE_STYLES[type];
          return (
            <div key={type} className="card p-4 text-center">
              <div className={`w-10 h-10 rounded-full ${style.bg} flex items-center justify-center text-xl mx-auto mb-2`}>
                {style.icon}
              </div>
              <p className={`text-xl font-bold ${style.text}`}>{count}</p>
              <p className="text-xs text-slate-500">{style.label}{count !== 1 ? 's' : ''}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
