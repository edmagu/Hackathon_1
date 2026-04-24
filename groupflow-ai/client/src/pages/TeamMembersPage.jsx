import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addMember, getMembers } from '../api/projectsApi';

const initialMember = {
  name: '',
  email: '',
  skills: '',
  availability: '',
  preferredRole: '',
};

function TeamMembersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(initialMember);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadMembers = async () => {
      try {
        const data = await getMembers(id);
        if (!cancelled) setMembers(data);
      } catch {
        if (!cancelled) setError('Failed to load team members.');
      }
    };

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await addMember(id, member);
      const refreshed = await getMembers(id);
      setMembers(refreshed);
      setMember(initialMember);
    } catch {
      setError('Failed to add team member.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card">
      <h2>Add Team Members</h2>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          Name
          <input required name="name" value={member.name} onChange={onChange} />
        </label>
        <label>
          Email
          <input required type="email" name="email" value={member.email} onChange={onChange} />
        </label>
        <label>
          Skills
          <input required name="skills" value={member.skills} onChange={onChange} />
        </label>
        <label>
          Availability
          <input required name="availability" value={member.availability} onChange={onChange} />
        </label>
        <label>
          Preferred Role
          <input required name="preferredRole" value={member.preferredRole} onChange={onChange} />
        </label>
        <button className="button" disabled={saving}>{saving ? 'Adding...' : 'Add Member'}</button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      <div className="member-list">
        <h3>Current Team</h3>
        {!members.length ? <p className="empty">No members added yet.</p> : null}
        <ul>
          {members.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> — {item.preferredRole} ({item.availability})
            </li>
          ))}
        </ul>
      </div>

      <div className="actions">
        <Link className="button secondary" to="/">Back Home</Link>
        <button className="button" onClick={() => navigate(`/projects/${id}/plan`)} disabled={!members.length}>
          Continue to AI Plan
        </button>
      </div>
    </section>
  );
}

export default TeamMembersPage;
