import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import "../styles/Login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleCloseToast = () => setToast(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target;

    const payload = {
      email: email.value,
      password: password.value,
    };

    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (onLogin) onLogin(data.user);

        showToast("Zalogowano pomyślnie!", "success");

        setTimeout(() => {
          if (data.user.is_superuser) {
            navigate("/dashboard_admin");
          } else {
            navigate("/dashboard");
          }
        }, 1200);
      } else {
        showToast(
          "Błąd logowania: " + (data.detail || "spróbuj ponownie"),
          "error"
        );
      }
    } catch (err) {
      showToast("Coś poszło nie tak: " + err.message, "error");
    }
  };

  return (
    <div className="login-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}

      <h2>Logowanie</h2>

      <form className="login-form" onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="np. mail@przyklad.pl"
            required
          />
        </label>

        <label>
          Hasło:
          <input
            type="password"
            name="password"
            placeholder="Twoje hasło"
            minLength={6}
            required
          />
        </label>

        <button type="submit" className="login-page-btn">
          Zaloguj się
        </button>
      </form>
    </div>
  );
}
