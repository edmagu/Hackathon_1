"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const storage_1 = require("../storage");
const router = (0, express_1.Router)();
// GET /api/projects
router.get('/', (_req, res) => {
    try {
        const projects = (0, storage_1.readProjects)();
        res.json(projects);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to read projects' });
    }
});
// POST /api/projects
router.post('/', (req, res) => {
    try {
        const { name, description, dueDate, teamMembers } = req.body;
        if (!name || !description || !dueDate) {
            return res.status(400).json({ error: 'name, description, and dueDate are required' });
        }
        const projects = (0, storage_1.readProjects)();
        const newProject = {
            id: (0, uuid_1.v4)(),
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
        (0, storage_1.writeProjects)(projects);
        res.status(201).json(newProject);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});
// GET /api/projects/:id
router.get('/:id', (req, res) => {
    try {
        const projects = (0, storage_1.readProjects)();
        const project = projects.find((p) => p.id === req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to read project' });
    }
});
// PUT /api/projects/:id
router.put('/:id', (req, res) => {
    try {
        const projects = (0, storage_1.readProjects)();
        const index = projects.findIndex((p) => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }
        projects[index] = { ...projects[index], ...req.body, id: req.params.id };
        (0, storage_1.writeProjects)(projects);
        res.json(projects[index]);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update project' });
    }
});
// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
    try {
        const projects = (0, storage_1.readProjects)();
        const index = projects.findIndex((p) => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }
        projects.splice(index, 1);
        (0, storage_1.writeProjects)(projects);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});
exports.default = router;
