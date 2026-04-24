const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const memberRoutes = require('./routes/memberRoutes');
const taskRoutes = require('./routes/taskRoutes');
const checklistRoutes = require('./routes/checklistRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', projectRoutes);
app.use('/api', memberRoutes);
app.use('/api', taskRoutes);
app.use('/api', checklistRoutes);

module.exports = app;
