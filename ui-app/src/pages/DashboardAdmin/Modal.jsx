export default function Modal({ children, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}
