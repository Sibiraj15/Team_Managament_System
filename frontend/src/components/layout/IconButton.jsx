const icons = {
  add: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a2.12 2.12 0 0 0-3-3L5 17v3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  delete: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
};

export default function IconButton({ icon, title, onClick, disabled, tone = "default" }) {
  return (
    <button
      type="button"
      className={`icon-button action-icon ${tone}`}
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
    >
      {icons[icon]}
    </button>
  );
}
