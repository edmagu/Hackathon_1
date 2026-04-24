import api from './http';

export const createProject = (payload) => api.post('/projects', payload).then((r) => r.data);
export const getProjects = () => api.get('/projects').then((r) => r.data);
export const getProject = (id) => api.get(`/projects/${id}`).then((r) => r.data);
export const updateProject = (id, payload) => api.put(`/projects/${id}`, payload).then((r) => r.data);
export const addMember = (projectId, payload) => api.post(`/projects/${projectId}/members`, payload).then((r) => r.data);
export const getMembers = (projectId) => api.get(`/projects/${projectId}/members`).then((r) => r.data);
export const generatePlan = (projectId) => api.post(`/projects/${projectId}/generate-plan`).then((r) => r.data);
export const getTasks = (projectId) => api.get(`/projects/${projectId}/tasks`).then((r) => r.data);
export const updateTask = (taskId, payload) => api.put(`/tasks/${taskId}`, payload).then((r) => r.data);
export const createTask = (projectId, payload) => api.post(`/projects/${projectId}/tasks`, payload).then((r) => r.data);
export const getChecklist = (projectId) => api.get(`/projects/${projectId}/checklist`).then((r) => r.data);
export const updateChecklistItem = (id, payload) => api.put(`/checklist/${id}`, payload).then((r) => r.data);
export const listAllProjects = getProjects;
