"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDataDir = ensureDataDir;
exports.readProjects = readProjects;
exports.writeProjects = writeProjects;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_FILE = path_1.default.join(__dirname, '../../../data/projects.json');
function ensureDataDir() {
    const dir = path_1.default.dirname(DATA_FILE);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    if (!fs_1.default.existsSync(DATA_FILE)) {
        fs_1.default.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
}
function readProjects() {
    ensureDataDir();
    const content = fs_1.default.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
}
function writeProjects(projects) {
    ensureDataDir();
    fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}
