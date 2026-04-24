const { readDb, writeDb, generateId } = require('../services/dbService');

async function getTasks(req, res) {
  try {
    const db = await readDb();
    const tasks = db.tasks.filter((t) => t.projectId === req.params.id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
}

async function createTask(req, res) {
  try {
    const db = await readDb();
    const project = db.projects.find((p) => p.id === req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = {
      id: generateId('task', db.tasks),
      projectId: req.params.id,
      title: req.body.title,
      description: req.body.description || '',
      assignedTo: req.body.assignedTo || '',
      assignedToName: req.body.assignedToName || 'Unassigned',
      dueDate: req.body.dueDate,
      priority: req.body.priority || 'Medium',
      estimatedHours: Number(req.body.estimatedHours) || 1,
      status: req.body.status || 'todo',
    };

    db.tasks.push(task);
    await writeDb(db);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const db = await readDb();
    const index = db.tasks.findIndex((t) => t.id === req.params.taskId);
    if (index === -1) return res.status(404).json({ message: 'Task not found' });

    db.tasks[index] = { ...db.tasks[index], ...req.body };
    await writeDb(db);
    res.json(db.tasks[index]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
}

async function deleteTask(req, res) {
  try {
    const db = await readDb();
    const task = db.tasks.find((t) => t.id === req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    db.tasks = db.tasks.filter((t) => t.id !== req.params.taskId);
    await writeDb(db);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
