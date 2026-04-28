import { useEffect, useState } from "react";

const initialState = {
  userId: "",
  teamId: "",
  roleIds: []
};

export default function MembershipForm({
  users,
  teams,
  roles,
  onSubmit,
  loading,
  selectedUserId,
  selectedTeamId,
  initialValues = initialState,
  submitLabel,
  lockUser = false,
  lockTeam = false
}) {
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      userId: selectedUserId || current.userId,
      teamId: selectedTeamId || current.teamId
    }));
  }, [selectedUserId, selectedTeamId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleRoleToggle = (roleId) => {
    setForm((current) => ({
      ...current,
      roleIds: current.roleIds.includes(roleId)
        ? current.roleIds.filter((item) => item !== roleId)
        : [...current.roleIds, roleId]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm((current) => ({ ...initialState, userId: current.userId, teamId: current.teamId }));
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        <span>User <span className="required-mark">*</span></span>
        <select name="userId" value={form.userId} onChange={handleChange} required disabled={lockUser}>
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Team <span className="required-mark">*</span></span>
        <select name="teamId" value={form.teamId} onChange={handleChange} required disabled={lockTeam}>
          <option value="">Select team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>

      <div className="full-width">
        <span className="field-label">Roles <span className="required-mark">*</span></span>
        <div className="selection-grid">
          {roles.map((role) => (
            <label
              className={`selection-card ${form.roleIds.includes(role._id) ? "active" : ""}`}
              key={role._id}
            >
              <input
                type="checkbox"
                checked={form.roleIds.includes(role._id)}
                onChange={() => handleRoleToggle(role._id)}
              />
              <span className="selection-check" aria-hidden="true" />
              <div className="selection-copy">
                <strong>{role.name}</strong>
                <span>{role.description || "Reusable permission bundle"}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="full-width form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel || "Assign Roles In Team"}
        </button>
      </div>
    </form>
  );
}
