export default function Step({ icon, number, title, description }) {
  return (
    <div className="step">
      <div className="step-icons">
        <div className="icon-circle">{icon}</div>
        <div className="step-number">{number}</div>
      </div>
      <div className="step-text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
