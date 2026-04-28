export default function PermissionViewer({
  selectedUser,
  selectedTeam,
  resolvedPermissions,
  loading
}) {
  if (!selectedUser || !selectedTeam) {
    return (
      <div className="empty-panel">
        Select a user and a team to view resolved permissions.
      </div>
    );
  }

  if (loading) {
    return <div className="empty-panel">Loading permissions...</div>;
  }

  return (
    <div className="permission-panel">
      <div className="permission-summary">
        <div className="permission-summary-item">
          <span className="meta-label">User</span>
          <strong>{selectedUser.name}</strong>
        </div>
        <div className="permission-summary-item">
          <span className="meta-label">Team</span>
          <strong>{selectedTeam.name}</strong>
        </div>
        <div className="permission-summary-item">
          <span className="meta-label">Resolved roles</span>
          <strong>
            {resolvedPermissions.roles?.length
              ? resolvedPermissions.roles.map((role) => role.name).join(", ")
              : "No role assigned"}
          </strong>
        </div>
      </div>

      <div className="permission-grid">
        {resolvedPermissions.permissions.length > 0 ? (
          resolvedPermissions.permissions.map((permission) => (
            <div className="permission-card" key={permission}>
              {permission}
            </div>
          ))
        ) : (
          <div className="empty-panel">
            This user has no permissions in the selected team.
          </div>
        )}
      </div>
    </div>
  );
}
