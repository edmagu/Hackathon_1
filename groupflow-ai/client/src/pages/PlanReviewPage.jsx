import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generatePlan, getChecklist, getProject, getTasks, updateProject } from '../api/projectsApi';

function PlanReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const currentProject = await getProject(id);
        setProject(currentProject);

        const [tasks, checklist] = await Promise.all([getTasks(id), getChecklist(id)]);

        if (tasks.length || checklist.length || currentProject.summary) {
          setPlan({
            summary: currentProject.summary || '',
            tasks,
            checklistItems: checklist,
            milestones: currentProject.milestones || [],
            meetings: currentProject.meetings || [],
          });
        }
      } catch {
        setError('Failed to load project data.');
      }
    };

    load();
  }, [id]);

  const onGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const generated = await generatePlan(id);
      setPlan(generated);
      const refreshed = await getProject(id);
      setProject(refreshed);
    } catch {
      setError('Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  const onSavePlan = async () => {
    setSaving(true);
    setError('');
    try {
      await updateProject(id, { planSaved: true });
      navigate(`/projects/${id}/dashboard`);
    } catch {
      setError('Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card">
      <h2>AI Plan Review</h2>
      <p>{project ? `${project.title} • Due ${project.dueDate}` : 'Loading project...'}</p>

      <div className="actions">
        <button className="button" onClick={onGenerate} disabled={loading}>
          {loading ? 'Generating plan...' : 'Generate Project Plan'}
        </button>
        <button className="button secondary" onClick={onSavePlan} disabled={!plan || saving}>
          {saving ? 'Saving...' : 'Save Plan & Open Dashboard'}
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {!plan ? <p className="empty">No plan yet. Generate one to review summary, milestones, tasks, meetings, and checklist.</p> : null}

      {plan ? (
        <div className="plan-layout">
          <article className="card nested"><h3>Summary</h3><p>{plan.summary}</p></article>

          <article className="card nested">
            <h3>Milestones</h3>
            <ul>
              {(plan.milestones || []).map((milestone) => (
                <li key={milestone.id || milestone.title}>{milestone.title} — {milestone.dueDate}</li>
              ))}
            </ul>
          </article>

          <article className="card nested">
            <h3>Tasks</h3>
            <ul>
              {(plan.tasks || []).map((task) => (
                <li key={task.id || task.title}>{task.title} — {task.assignedToName || 'Unassigned'} — {task.dueDate}</li>
              ))}
            </ul>
          </article>

          <article className="card nested">
            <h3>Meetings</h3>
            <ul>
              {(plan.meetings || []).map((meeting) => (
                <li key={meeting.id || meeting.title}>{meeting.title} — {meeting.date}</li>
              ))}
            </ul>
          </article>

          <article className="card nested">
            <h3>Final Checklist</h3>
            <ul>
              {(plan.checklistItems || []).map((item) => (
                <li key={item.id || item.title}>{item.title}</li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default PlanReviewPage;
