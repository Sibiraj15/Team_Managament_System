import IconButton from "../layout/IconButton.jsx";

export default function UserList({
  users,
  selectedUserId,
  onSelect,
  onEdit,
  onDelete,
  deletingId
}) {
  if (users.length === 0) {
    return <p className="empty-state">No users created yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className={selectedUserId === user._id ? "selected-row" : ""}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="table-actions">
                  <button type="button" className="table-action" onClick={() => onSelect(user._id)}>
                    {selectedUserId === user._id ? "Selected" : "Select"}
                  </button>
                  <IconButton icon="edit" title="Edit user" onClick={() => onEdit(user)} />
                  <IconButton
                    icon="delete"
                    title="Delete user"
                    tone="danger"
                    onClick={() => onDelete(user)}
                    disabled={deletingId === user._id}
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
