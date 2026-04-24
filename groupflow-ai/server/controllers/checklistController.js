const { readDb, writeDb } = require('../services/dbService');

async function getChecklist(req, res) {
  try {
    const db = await readDb();
    const items = db.checklistItems.filter((c) => c.projectId === req.params.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch checklist', error: error.message });
  }
}

async function updateChecklistItem(req, res) {
  try {
    const db = await readDb();
    const index = db.checklistItems.findIndex((c) => c.id === req.params.checklistItemId);
    if (index === -1) return res.status(404).json({ message: 'Checklist item not found' });

    db.checklistItems[index] = { ...db.checklistItems[index], ...req.body };
    await writeDb(db);
    res.json(db.checklistItems[index]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update checklist item', error: error.message });
  }
}

module.exports = {
  getChecklist,
  updateChecklistItem,
};
