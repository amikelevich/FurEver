import { useEffect } from "react";
import "../styles/Toast.css";

export default function Toast({ message, type, onClose, duration = 1000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  );
}
