export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <div>
            <strong>{toast.type === "success" ? "Success" : "Error"}</strong>
            <p>{toast.message}</p>
          </div>
          <button type="button" className="icon-button" onClick={() => onDismiss(toast.id)}>
            x
          </button>
        </div>
      ))}
    </div>
  );
}
