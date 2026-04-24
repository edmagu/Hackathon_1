export function calculateProgress(tasks) {
  if (!tasks.length) return 0;
  const done = tasks.filter((task) => task.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

export function calculateWorkload(tasks) {
  return tasks.reduce((acc, task) => {
    const person = task.assignedToName || 'Unassigned';
    acc[person] = (acc[person] || 0) + (Number(task.estimatedHours) || 0);
    return acc;
  }, {});
}

export function getUpcomingDeadlines(tasks) {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  return tasks
    .filter((task) => task.dueDate)
    .filter((task) => {
      const due = new Date(task.dueDate);
      return due >= now && due <= nextWeek;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

export function getOverdueTasks(tasks) {
  const now = new Date();
  return tasks.filter((task) => task.status !== 'done' && task.dueDate && new Date(task.dueDate) < now);
}
