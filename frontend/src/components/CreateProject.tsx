import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createProject } from '../api';
import { Project, TeamMember } from '../types';

interface Props {
  onCreated: (project: Project) => void;
  onCancel: () => void;
}

export default function CreateProject({ onCreated, onCancel }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [memberForm, setMemberForm] = useState({ name: '', email: '', skills: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const addMember = () => {
    if (!memberForm.name.trim()) return;
    setMembers((prev) => [
      ...prev,
      { id: uuidv4(), ...memberForm },
    ]);
    setMemberForm({ name: '', email: '', skills: '', role: '' });
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !dueDate) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const project = await createProject({ name, description, dueDate, teamMembers: members });
      onCreated(project);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Create New Project</h1>
        <p className="text-slate-500 mt-1">Fill in the details below. You can generate an AI plan after creating the project.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Project Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Project Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="input"
                placeholder="e.g., Machine Learning Final Project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Assignment Description <span className="text-red-500">*</span></label>
              <textarea
                className="input min-h-[120px] resize-y"
                placeholder="Describe the project goals, requirements, and what needs to be delivered..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Due Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                className="input"
                min={today}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Team Members
          </h2>

          {members.length > 0 && (
            <div className="space-y-2 mb-4">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between bg-indigo-50 rounded-lg px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-semibold text-indigo-700">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{m.name}</p>
                      <p className="text-slate-500 text-xs">{m.email} {m.role && `· ${m.role}`}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border border-dashed border-slate-300 rounded-lg p-4 space-y-3">
            <p className="text-sm text-slate-500 font-medium">Add a team member</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="input"
                  placeholder="Full name"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="email@example.com"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Role</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Developer, Designer"
                  value={memberForm.role}
                  onChange={(e) => setMemberForm((f) => ({ ...f, role: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Skills</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Python, Data Analysis"
                  value={memberForm.skills}
                  onChange={(e) => setMemberForm((f) => ({ ...f, skills: e.target.value }))}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addMember}
              disabled={!memberForm.name.trim()}
              className="btn-secondary text-sm w-full flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
