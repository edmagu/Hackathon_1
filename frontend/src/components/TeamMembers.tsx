import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, TeamMember } from '../types';
import { updateProject } from '../api';

interface Props {
  project: Project;
  onUpdated: (p: Project) => void;
}

export default function TeamMembers({ project, onUpdated }: Props) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '', skills: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    try {
      setLoading(true);
      const newMember: TeamMember = { id: uuidv4(), ...form };
      const updated = await updateProject(project.id, {
        teamMembers: [...project.teamMembers, newMember],
      });
      onUpdated(updated);
      setForm({ name: '', email: '', role: '', skills: '' });
      setAdding(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const updated = await updateProject(project.id, {
        teamMembers: project.teamMembers.filter((m) => m.id !== id),
      });
      onUpdated(updated);
    } catch (_) {}
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-900">Team Members</h2>
        <button onClick={() => setAdding(!adding)} className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
          {adding ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {project.teamMembers.length === 0 && !adding && (
        <p className="text-slate-400 text-sm text-center py-4">No team members yet.</p>
      )}

      <div className="space-y-2">
        {project.teamMembers.map((m) => (
          <div key={m.id} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 flex-shrink-0">
              {m.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 text-sm truncate">{m.name}</p>
              <p className="text-xs text-slate-500 truncate">{m.role || 'Member'}{m.email ? ` · ${m.email}` : ''}</p>
              {m.skills && <p className="text-xs text-indigo-600 truncate">{m.skills}</p>}
            </div>
            <button
              onClick={() => handleRemove(m.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {adding && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
          <input className="input" placeholder="Name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input className="input" placeholder="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
          <input className="input" placeholder="Skills" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
          <button onClick={handleAdd} disabled={loading || !form.name.trim()} className="btn-primary w-full text-sm">
            {loading ? 'Adding...' : 'Add Member'}
          </button>
        </div>
      )}
    </div>
  );
}
