const express = require('express');
const { updateTask, deleteTask } = require('../controllers/tasksController');

const router = express.Router();

router.put('/tasks/:taskId', updateTask);
router.delete('/tasks/:taskId', deleteTask);

module.exports = router;
