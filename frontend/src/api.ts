import { Project } from './types';

const BASE = '/api';

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`${BASE}/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

export async function createProject(data: {
  name: string;
  description: string;
  dueDate: string;
  teamMembers: { id: string; name: string; email: string; skills: string; role: string }[];
}): Promise<Project> {
  const res = await fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${BASE}/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
}

export async function generateAIPlan(projectId: string): Promise<Project> {
  const res = await fetch(`${BASE}/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'AI generation failed');
  }
  return res.json();
}
