import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getChecklist,
  getProject,
  getTasks,
  updateChecklistItem,
  updateTask,
} from '../api/projectsApi';
import TaskCard from '../components/TaskCard.jsx';
import {
  calculateProgress,
  calculateWorkload,
  getOverdueTasks,
  getUpcomingDeadlines,
} from '../utils/dashboardUtils';

function DashboardPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [projectData, taskData, checklistData] = await Promise.all([
          getProject(id),
          getTasks(id),
          getChecklist(id),
        ]);

        if (!cancelled) {
          setProject(projectData);
          setTasks(taskData);
          setChecklist(checklistData);
          setMilestones(projectData.milestones || []);
          setMeetings(projectData.meetings || []);
        }
      } catch {
        if (!cancelled) setError('Failed to load dashboard.');
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const progress = useMemo(() => calculateProgress(tasks), [tasks]);
  const workload = useMemo(() => calculateWorkload(tasks), [tasks]);
  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(tasks), [tasks]);
  const overdueTasks = useMemo(() => getOverdueTasks(tasks), [tasks]);

  const grouped = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === 'todo'),
      inProgress: tasks.filter((task) => task.status === 'in-progress'),
      done: tasks.filter((task) => task.status === 'done'),
    }),
    [tasks]
  );

  const changeStatus = async (taskId, status) => {
    try {
      const updated = await updateTask(taskId, { status });
      setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
    } catch {
      setError('Failed to update task status.');
    }
  };

  const toggleChecklist = async (item) => {
    try {
      const updated = await updateChecklistItem(item.id, { completed: !item.completed });
      setChecklist((prev) => prev.map((entry) => (entry.id === item.id ? updated : entry)));
    } catch {
      setError('Failed to update checklist item.');
    }
  };

  return (
    <section>
      <div className="card">
        <h2>{project ? project.title : 'Project Dashboard'}</h2>
        <p>{project ? `${project.course} • ${project.projectType} • Due ${project.dueDate}` : 'Loading...'}</p>
        <div className="progress-wrap">
          <div className="progress-label">Progress: {progress}%</div>
          <div className="progress-bar"><span style={{ width: `${progress}%` }} /></div>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </div>

      <div className="grid-2">
        <article className="card">
          <h3>Upcoming Deadlines</h3>
          {!upcomingDeadlines.length ? <p className="empty">No deadlines in the next 7 days.</p> : null}
          <ul>
            {upcomingDeadlines.map((task) => (
              <li key={task.id}>{task.title} — {task.dueDate}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3>Overdue Tasks</h3>
          {!overdueTasks.length ? <p className="empty">No overdue tasks.</p> : null}
          <ul>
            {overdueTasks.map((task) => (
              <li key={task.id}>{task.title} — {task.dueDate}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="card">
        <h3>Team Workload (Estimated Hours)</h3>
        {!Object.keys(workload).length ? <p className="empty">No workload data yet.</p> : null}
        <ul>
          {Object.entries(workload).map(([name, hours]) => (
            <li key={name}>{name}: {hours}h</li>
          ))}
        </ul>
      </article>

      <section className="board">
        <div>
          <h3>To Do</h3>
          {grouped.todo.map((task) => <TaskCard key={task.id} task={task} onStatusChange={changeStatus} />)}
          {!grouped.todo.length ? <p className="empty">No tasks.</p> : null}
        </div>
        <div>
          <h3>In Progress</h3>
          {grouped.inProgress.map((task) => <TaskCard key={task.id} task={task} onStatusChange={changeStatus} />)}
          {!grouped.inProgress.length ? <p className="empty">No tasks.</p> : null}
        </div>
        <div>
          <h3>Done</h3>
          {grouped.done.map((task) => <TaskCard key={task.id} task={task} onStatusChange={changeStatus} />)}
          {!grouped.done.length ? <p className="empty">No tasks.</p> : null}
        </div>
      </section>

      <div className="grid-2">
        <article className="card">
          <h3>Meetings</h3>
          {!meetings.length ? <p className="empty">No meetings yet.</p> : null}
          <ul>
            {meetings.map((meeting) => (
              <li key={meeting.id}>{meeting.title} — {meeting.date}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3>Final Checklist</h3>
          {!checklist.length ? <p className="empty">No checklist items yet.</p> : null}
          <ul className="checklist">
            {checklist.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(item.completed)}
                    onChange={() => toggleChecklist(item)}
                  />
                  {item.title}
                </label>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="card">
        <h3>Milestones</h3>
        {!milestones.length ? <p className="empty">No milestones yet.</p> : null}
        <ul>
          {milestones.map((milestone) => (
            <li key={milestone.id}>{milestone.title} — {milestone.dueDate}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export default DashboardPage;
