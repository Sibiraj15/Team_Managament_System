import Modal from "./Modal.jsx";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="confirm-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
