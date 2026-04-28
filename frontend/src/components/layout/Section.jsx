export default function Section({ title, subtitle, action, children }) {
  return (
    <section className="section">
      <div className="section-header">
        <div className="section-copy">
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action ? <div className="section-action">{action}</div> : null}
      </div>
      <div className="section-content">{children}</div>
    </section>
  );
}
