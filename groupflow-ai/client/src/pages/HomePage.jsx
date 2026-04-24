import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addMember, createProject, generatePlan, listAllProjects } from '../api/projectsApi';

const demoProject = {
  title: 'World War I History Presentation',
  course: 'Grade 10 History',
  projectType: 'Presentation',
  assignmentDescription:
    'Create a 10-minute group presentation explaining the main causes of World War I. The presentation must include at least 5 sources, a bibliography, visuals, and speaking parts for every group member.',
  dueDate: '2026-05-10',
  difficulty: 'Medium',
};

const demoTeam = [
  {
    name: 'Elias',
    email: 'elias@example.com',
    skills: 'Research, Presentation, Leadership',
    availability: 'Evenings',
    preferredRole: 'Research Lead',
  },
  {
    name: 'Sophia',
    email: 'sophia@example.com',
    skills: 'Design, Writing',
    availability: 'Weekends',
    preferredRole: 'Slide Designer',
  },
  {
    name: 'Daniel',
    email: 'daniel@example.com',
    skills: 'Writing, Editing, Presentation',
    availability: 'Flexible',
    preferredRole: 'Editor',
  },
];

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const data = await listAllProjects();
        if (!cancelled) setProjects(data);
      } catch {
        if (!cancelled) setError('Unable to load projects. Is the backend running?');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoadDemo = async () => {
    setBusy(true);
    setError('');
    try {
      const project = await createProject(demoProject);
      await Promise.all(demoTeam.map((member) => addMember(project.id, member)));
      await generatePlan(project.id);
      navigate(`/projects/${project.id}/dashboard`);
    } catch {
      setError('Could not load demo project. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <div className="card hero-card">
        <h2>AI-powered group project organizer for students</h2>
        <p>Create projects, add teammates, generate plans, and track progress in one place.</p>
        <div className="actions">
          <Link className="button" to="/projects/new">Create New Project</Link>
          <button className="button secondary" onClick={handleLoadDemo} disabled={busy}>
            {busy ? 'Loading Demo...' : 'Load Demo Project'}
          </button>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div className="card">
        <h3>Your Projects</h3>
        {loading ? <p>Loading projects...</p> : null}
        {!loading && !projects.length ? <p className="empty">No projects yet. Start by creating one.</p> : null}
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.title}</strong>
              <span>{project.course}</span>
              <Link to={`/projects/${project.id}/dashboard`}>Open Dashboard</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default HomePage;
