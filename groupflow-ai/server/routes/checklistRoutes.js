const express = require('express');
const { updateChecklistItem } = require('../controllers/checklistController');

const router = express.Router();

router.put('/checklist/:checklistItemId', updateChecklistItem);

module.exports = router;
