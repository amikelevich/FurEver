import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

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

        navigate("/main");
        alert("Zalogowano pomyślnie!");
      } else {
        alert("Błąd logowania: " + JSON.stringify(data));
      }
    } catch (err) {
      alert("Coś poszło nie tak: " + err.message);
    }
  };

  return (
    <div className="login-container">
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
