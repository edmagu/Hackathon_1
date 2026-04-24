const { readDb, writeDb, generateId } = require('../services/dbService');
const { generateFallbackPlan } = require('../services/plannerService');
const { generatePlanWithAI } = require('../services/aiService');

async function createProject(req, res) {
  try {
    const db = await readDb();
    const project = {
      id: generateId('project', db.projects),
      title: req.body.title,
      course: req.body.course,
      projectType: req.body.projectType,
      assignmentDescription: req.body.assignmentDescription,
      dueDate: req.body.dueDate,
      difficulty: req.body.difficulty,
      summary: '',
      planSaved: false,
      createdAt: new Date().toISOString(),
    };

    db.projects.push(project);
    await writeDb(db);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
}

async function getProjects(_req, res) {
  try {
    const db = await readDb();
    res.json(db.projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
}

async function getProjectById(req, res) {
  try {
    const db = await readDb();
    const project = db.projects.find((p) => p.id === req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json({
      ...project,
      milestones: db.milestones.filter((item) => item.projectId === req.params.id),
      meetings: db.meetings.filter((item) => item.projectId === req.params.id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
}

async function updateProject(req, res) {
  try {
    const db = await readDb();
    const index = db.projects.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Project not found' });

    db.projects[index] = { ...db.projects[index], ...req.body };
    await writeDb(db);
    res.json(db.projects[index]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
}

async function deleteProject(req, res) {
  try {
    const db = await readDb();
    const project = db.projects.find((p) => p.id === req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    db.projects = db.projects.filter((p) => p.id !== req.params.id);
    db.teamMembers = db.teamMembers.filter((m) => m.projectId !== req.params.id);
    db.tasks = db.tasks.filter((t) => t.projectId !== req.params.id);
    db.milestones = db.milestones.filter((m) => m.projectId !== req.params.id);
    db.meetings = db.meetings.filter((m) => m.projectId !== req.params.id);
    db.checklistItems = db.checklistItems.filter((c) => c.projectId !== req.params.id);

    await writeDb(db);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
}

async function generatePlan(req, res) {
  try {
    const db = await readDb();
    const project = db.projects.find((p) => p.id === req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const members = db.teamMembers.filter((m) => m.projectId === req.params.id);
    const aiPlan = process.env.AI_API_KEY ? await generatePlanWithAI(project, members) : null;
    const plan = aiPlan || generateFallbackPlan(project, members);

    db.tasks = db.tasks.filter((t) => t.projectId !== project.id);
    db.milestones = db.milestones.filter((m) => m.projectId !== project.id);
    db.meetings = db.meetings.filter((m) => m.projectId !== project.id);
    db.checklistItems = db.checklistItems.filter((c) => c.projectId !== project.id);

    const newTasks = [];
    for (const task of plan.tasks) {
      const created = {
        id: generateId('task', [...db.tasks, ...newTasks]),
        projectId: project.id,
        ...task,
      };
      newTasks.push(created);
    }
    db.tasks.push(...newTasks);

    const newMilestones = [];
    for (const milestone of plan.milestones) {
      const created = {
        id: generateId('milestone', [...db.milestones, ...newMilestones]),
        projectId: project.id,
        ...milestone,
      };
      newMilestones.push(created);
    }
    db.milestones.push(...newMilestones);

    const newMeetings = [];
    for (const meeting of plan.meetings) {
      const created = {
        id: generateId('meeting', [...db.meetings, ...newMeetings]),
        projectId: project.id,
        ...meeting,
      };
      newMeetings.push(created);
    }
    db.meetings.push(...newMeetings);

    const newChecklist = [];
    for (const item of plan.checklistItems) {
      const created = {
        id: generateId('checklist', [...db.checklistItems, ...newChecklist]),
        projectId: project.id,
        ...item,
      };
      newChecklist.push(created);
    }
    db.checklistItems.push(...newChecklist);

    const projectIndex = db.projects.findIndex((p) => p.id === project.id);
    db.projects[projectIndex] = { ...db.projects[projectIndex], summary: plan.summary };

    await writeDb(db);
    res.json({
      summary: plan.summary,
      milestones: newMilestones,
      tasks: newTasks,
      meetings: newMeetings,
      checklistItems: newChecklist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate plan', error: error.message });
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  generatePlan,
};
