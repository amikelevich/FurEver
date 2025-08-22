import React from "react";
import "../styles/Register.css";

export default function Register() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = e.target;

    try {
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.value,
          last_name: lastName.value,
          email: email.value,
          password: password.value,
        }),
      });

      const message = res.ok
        ? "Rejestracja zakończona sukcesem!"
        : `Błąd: ${JSON.stringify(await res.json())}`;

      alert(message);

      if (res.ok) e.target.reset();
    } catch (err) {
      alert("Coś poszło nie tak: " + err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      <form className="register-form" onSubmit={handleSubmit}>
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
