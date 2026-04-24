function TaskCard({ task, onStatusChange }) {
  return (
    <article className="card task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <ul>
        <li><strong>Assigned:</strong> {task.assignedToName || 'Unassigned'}</li>
        <li><strong>Due:</strong> {task.dueDate || 'TBD'}</li>
        <li><strong>Priority:</strong> {task.priority}</li>
        <li><strong>Hours:</strong> {task.estimatedHours}</li>
      </ul>
      <label>
        Status
        <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value)}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </label>
    </article>
  );
}

export default TaskCard;
