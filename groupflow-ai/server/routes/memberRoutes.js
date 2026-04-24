const express = require('express');
const { updateMember, deleteMember } = require('../controllers/membersController');

const router = express.Router();

router.put('/members/:memberId', updateMember);
router.delete('/members/:memberId', deleteMember);

module.exports = router;
