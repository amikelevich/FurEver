import React from "react";
import "../styles/Register.css";

export default function Register() {
  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      <form className="register-form">
        <label>
          Imię:
          <input
            type="text"
            name="firstName"
            placeholder="Twoje imię"
            required
          />
        </label>

        <label>
          Nazwisko:
          <input
            type="text"
            name="lastName"
            placeholder="Twoje nazwisko"
            required
          />
        </label>

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

        <button type="submit" className="register-page-btn">
          Zarejestruj się
        </button>
      </form>
    </div>
  );
}
