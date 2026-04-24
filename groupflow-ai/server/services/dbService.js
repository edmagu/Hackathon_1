const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

async function readDb() {
  const raw = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(raw);
}

async function writeDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

function generateId(prefix, items) {
  const max = items.reduce((acc, item) => {
    const value = Number(String(item.id || '').replace(`${prefix}_`, ''));
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 0);
  return `${prefix}_${String(max + 1).padStart(3, '0')}`;
}

module.exports = {
  readDb,
  writeDb,
  generateId,
};
