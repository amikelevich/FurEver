import React from "react";
import "../styles/Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <h2>Logowanie</h2>
      <form className="login-form">
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
