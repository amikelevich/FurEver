import React from "react";
import "../styles/Login.css";

export default function Login() {
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target;

    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });

      const message = res.ok
        ? "Zalogowano pomyślnie!"
        : `Błąd logowania: ${JSON.stringify(await res.json())}`;

      if (res.ok) {
        const data = await res.json();
        console.log("Token JWT:", data.access);
        e.target.reset();
      }

      alert(message);
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
