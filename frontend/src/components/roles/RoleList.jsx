import IconButton from "../layout/IconButton.jsx";

export default function RoleList({ roles, onEdit, onDelete, deletingId }) {
  if (roles.length === 0) {
    return <p className="empty-state">No roles created yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Description</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role._id}>
              <td>{role.name}</td>
              <td>{role.description || "No description"}</td>
              <td>
                <div className="tag-row">
                  {role.permissions.length > 0 ? (
                    role.permissions.map((permission) => (
                      <span className="tag" key={permission}>
                        {permission}
                      </span>
                    ))
                  ) : (
                    <span className="muted">No permissions assigned</span>
                  )}
                </div>
              </td>
              <td>
                <div className="icon-row">
                  <IconButton icon="edit" title="Edit role" onClick={() => onEdit(role)} />
                  <IconButton
                    icon="delete"
                    title="Delete role"
                    tone="danger"
                    onClick={() => onDelete(role)}
                    disabled={deletingId === role._id}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
