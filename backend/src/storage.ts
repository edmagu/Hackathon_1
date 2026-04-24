import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../../../data/projects.json');

export function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

export function readProjects(): any[] {
  ensureDataDir();
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(content);
}

export function writeProjects(projects: any[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}
