import IconButton from "../layout/IconButton.jsx";

export default function TeamList({
  teams,
  selectedTeamId,
  onSelect,
  onEdit,
  onDelete,
  deletingId
}) {
  if (teams.length === 0) {
    return <p className="empty-state">No teams created yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Description</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team._id} className={selectedTeamId === team._id ? "selected-row" : ""}>
              <td>{team.name}</td>
              <td>{team.description || "No description"}</td>
              <td>{new Date(team.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="table-actions">
                  <button type="button" className="table-action" onClick={() => onSelect(team._id)}>
                    {selectedTeamId === team._id ? "Selected" : "Select"}
                  </button>
                  <IconButton icon="edit" title="Edit team" onClick={() => onEdit(team)} />
                  <IconButton
                    icon="delete"
                    title="Delete team"
                    tone="danger"
                    onClick={() => onDelete(team)}
                    disabled={deletingId === team._id}
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
