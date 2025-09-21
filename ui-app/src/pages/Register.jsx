import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import Toast from "../components/Toast";

export default function Register() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = e.target;

    const errorMessages = {
      "user with this email already exists.":
        "Wystąpił problem podczas rejestracji.",
      "This field may not be blank.": "To pole nie może być puste.",
      "Ensure this field has at least 6 characters.":
        "Pole musi mieć co najmniej 6 znaków.",
    };

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

      const data = await res.json();

      if (res.ok) {
        showToast("Rejestracja zakończona sukcesem!", "success");
        e.target.reset();
        setTimeout(() => navigate("/login"), 1200);
      } else {
        if (typeof data === "object" && data !== null) {
          const firstField = Object.keys(data)[0];
          const firstError = data[firstField][0];
          const translated = errorMessages[firstError] || firstError;
          showToast("Błąd: " + translated, "error");
        } else {
          showToast("Błąd: " + String(data), "error");
        }
      }
    } catch (err) {
      showToast("Coś poszło nie tak: " + err.message, "error");
    }
  };

  return (
    <div className="register-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
