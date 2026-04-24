import { useState } from 'react';
import { Project } from '../types';
import { updateProject } from '../api';

interface Props {
  project: Project;
  onUpdated: (p: Project) => void;
}

export default function SubmissionChecklist({ project, onUpdated }: Props) {
  const [toggling, setToggling] = useState<string | null>(null);

  const checklist = project.submissionChecklist;
  const completed = checklist.filter((i) => i.completed).length;
  const pct = checklist.length > 0 ? Math.round((completed / checklist.length) * 100) : 0;

  const categories = Array.from(new Set(checklist.map((i) => i.category))).sort();

  const handleToggle = async (itemId: string, current: boolean) => {
    try {
      setToggling(itemId);
      const updatedChecklist = checklist.map((i) =>
        i.id === itemId ? { ...i, completed: !current } : i
      );
      const updated = await updateProject(project.id, { submissionChecklist: updatedChecklist });
      onUpdated(updated);
    } finally {
      setToggling(null);
    }
  };

  if (checklist.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-500">No checklist yet. Generate an AI plan to create one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="card p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-indigo-900 text-lg">Submission Checklist</h2>
            <p className="text-indigo-600 text-sm">{completed} of {checklist.length} items completed</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo-700">{pct}%</p>
            <p className="text-xs text-indigo-500">complete</p>
          </div>
        </div>
        <div className="h-3 bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? '#10b981' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            }}
          />
        </div>
        {pct === 100 && (
          <div className="mt-3 flex items-center gap-2 text-emerald-700 font-semibold">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All items complete — ready to submit! 🎉
          </div>
        )}
      </div>

      {/* Checklist by category */}
      {categories.map((category) => {
        const items = checklist.filter((i) => i.category === category);
        const catDone = items.filter((i) => i.completed).length;
        return (
          <div key={category} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 capitalize">{category}</h3>
              <span className="text-sm text-slate-500">{catDone}/{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    item.completed ? 'bg-emerald-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      disabled={toggling === item.id}
                      onChange={() => handleToggle(item.id, item.completed)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        item.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-300 bg-white'
                      } ${toggling === item.id ? 'opacity-50' : ''}`}
                    >
                      {item.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm leading-relaxed ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
