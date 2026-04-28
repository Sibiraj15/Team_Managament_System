import IconButton from "../layout/IconButton.jsx";

export default function MembershipList({ memberships, onEdit, onDelete, deletingId }) {
  if (memberships.length === 0) {
    return <p className="empty-state">No team-role assignments yet.</p>;
  }

  return (
    <div className="assignment-grid">
      {memberships.map((membership) => {
        const roles = membership.roleIds || [];
        const permissions = [...new Set(roles.flatMap((role) => role.permissions || []))];

        return (
          <article className="assignment-card" key={membership._id}>
            <div className="assignment-header">
              <div>
                <strong>{membership.userId?.name || "Unknown user"}</strong>
                <p>{membership.userId?.email || "No email"}</p>
              </div>
              <div className="icon-row">
                <IconButton icon="edit" title="Edit assignment" onClick={() => onEdit(membership)} />
                <IconButton
                  icon="delete"
                  title="Delete assignment"
                  tone="danger"
                  onClick={() => onDelete(membership)}
                  disabled={deletingId === membership._id}
                />
              </div>
            </div>

            <div className="assignment-meta">
              <div className="assignment-meta-item">
                <span className="meta-label">Team</span>
                <strong>{membership.teamId?.name || "Unknown team"}</strong>
              </div>
              <div className="assignment-meta-item">
                <span className="meta-label">Roles</span>
                <div className="assignment-role-list">
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <span className="assignment-role-chip" key={role._id || role.name}>
                        {role.name}
                      </span>
                    ))
                  ) : (
                    <span className="muted">No roles</span>
                  )}
                </div>
              </div>
            </div>

            <div className="assignment-section">
              <span className="meta-label">Permissions</span>
              <div className="tag-row">
                {permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <span className="tag" key={permission}>
                      {permission}
                    </span>
                  ))
                ) : (
                  <span className="muted">No permissions assigned</span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
