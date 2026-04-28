export default function PaginationControls({ pagination, onPageChange }) {
  if (!pagination) {
    return null;
  }

  const { page, totalPages, totalItems } = pagination;

  return (
    <div className="pagination-row">
      <span className="muted">
        Page {page} of {Math.max(totalPages, 1)} - {totalItems} items
      </span>
      <div className="button-row">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
