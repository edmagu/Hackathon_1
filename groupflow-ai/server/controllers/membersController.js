const { readDb, writeDb, generateId } = require('../services/dbService');

async function addMember(req, res) {
  try {
    const db = await readDb();
    const project = db.projects.find((p) => p.id === req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const member = {
      id: generateId('member', db.teamMembers),
      projectId: req.params.id,
      name: req.body.name,
      email: req.body.email,
      skills: req.body.skills || '',
      availability: req.body.availability || '',
      preferredRole: req.body.preferredRole || '',
    };

    db.teamMembers.push(member);
    await writeDb(db);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add member', error: error.message });
  }
}

async function getMembers(req, res) {
  try {
    const db = await readDb();
    const members = db.teamMembers.filter((m) => m.projectId === req.params.id);
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
}

async function updateMember(req, res) {
  try {
    const db = await readDb();
    const index = db.teamMembers.findIndex((m) => m.id === req.params.memberId);
    if (index === -1) return res.status(404).json({ message: 'Member not found' });

    db.teamMembers[index] = { ...db.teamMembers[index], ...req.body };
    await writeDb(db);
    res.json(db.teamMembers[index]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update member', error: error.message });
  }
}

async function deleteMember(req, res) {
  try {
    const db = await readDb();
    const member = db.teamMembers.find((m) => m.id === req.params.memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    db.teamMembers = db.teamMembers.filter((m) => m.id !== req.params.memberId);
    await writeDb(db);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
}

module.exports = {
  addMember,
  getMembers,
  updateMember,
  deleteMember,
};
