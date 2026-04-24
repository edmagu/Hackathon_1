import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readProjects, writeProjects } from '../storage';

const router = Router();

// GET /api/projects
router.get('/', (_req: Request, res: Response) => {
  try {
    const projects = readProjects();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

// POST /api/projects
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, description, dueDate, teamMembers } = req.body;
    if (!name || !description || !dueDate) {
      return res.status(400).json({ error: 'name, description, and dueDate are required' });
    }
    const projects = readProjects();
    const newProject = {
      id: uuidv4(),
      name,
      description,
      dueDate,
      createdAt: new Date().toISOString(),
      teamMembers: teamMembers || [],
      phases: [],
      meetingAgenda: [],
      reminderSchedule: [],
      submissionChecklist: [],
      aiGenerated: false,
    };
    projects.push(newProject);
    writeProjects(projects);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/projects/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const projects = readProjects();
    const project = projects.find((p: any) => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read project' });
  }
});

// PUT /api/projects/:id
router.put('/:id', (req: Request, res: Response) => {
  try {
    const projects = readProjects();
    const index = projects.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    projects[index] = { ...projects[index], ...req.body, id: req.params.id };
    writeProjects(projects);
    res.json(projects[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const projects = readProjects();
    const index = projects.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    projects.splice(index, 1);
    writeProjects(projects);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
