const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  generatePlan,
} = require('../controllers/projectsController');
const { addMember, getMembers } = require('../controllers/membersController');
const { getTasks, createTask } = require('../controllers/tasksController');
const { getChecklist } = require('../controllers/checklistController');

const router = express.Router();

router.post('/projects', createProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

router.post('/projects/:id/members', addMember);
router.get('/projects/:id/members', getMembers);

router.post('/projects/:id/generate-plan', generatePlan);

router.get('/projects/:id/tasks', getTasks);
router.post('/projects/:id/tasks', createTask);

router.get('/projects/:id/checklist', getChecklist);

module.exports = router;
