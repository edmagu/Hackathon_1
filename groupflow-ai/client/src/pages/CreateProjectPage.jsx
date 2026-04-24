import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projectsApi';

const initialForm = {
  title: '',
  course: '',
  projectType: '',
  assignmentDescription: '',
  dueDate: '',
  difficulty: 'Medium',
};

function CreateProjectPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const project = await createProject(form);
      navigate(`/projects/${project.id}/team`);
    } catch {
      setError('Failed to create project. Please check inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Create Project</h2>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          Title
          <input required name="title" value={form.title} onChange={onChange} />
        </label>
        <label>
          Course
          <input required name="course" value={form.course} onChange={onChange} />
        </label>
        <label>
          Project Type
          <input required name="projectType" value={form.projectType} onChange={onChange} />
        </label>
        <label>
          Due Date
          <input required type="date" name="dueDate" value={form.dueDate} onChange={onChange} />
        </label>
        <label>
          Difficulty
          <select name="difficulty" value={form.difficulty} onChange={onChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>
        <label className="full-width">
          Assignment Description
          <textarea required rows="4" name="assignmentDescription" value={form.assignmentDescription} onChange={onChange} />
        </label>
        {error ? <p className="error full-width">{error}</p> : null}
        <button className="button" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create and Continue'}
        </button>
      </form>
    </section>
  );
}

export default CreateProjectPage;
