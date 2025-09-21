import { useState, useEffect } from "react";
import Toast from "./Toast";
import "../styles/QuestionForm.css";

export default function QuestionForm({ animalId, onClose }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    question: "",
  });
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleCloseToast = () => setToast(null);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/api/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nie udało się pobrać danych użytkownika");
        return res.json();
      })
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
        }));
      })
      .catch((err) => showToast(err.message, "error"));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const phonePattern = /^[\d+\- ]{7,15}$/;
    if (!phonePattern.test(formData.phone)) {
      showToast("Podaj poprawny numer telefonu.", "error");
      return;
    }

    fetch("http://localhost:8000/api/send-question-email/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, animal: animalId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Błąd przy wysyłaniu pytania");
        return res.json();
      })
      .then(() => {
        showToast("Pytanie wysłane!", "success");
        setTimeout(() => onClose(), 1000);
      })
      .catch(() => {
        showToast("Nie udało się wysłać pytania.", "error");
      });
  };

  return (
    <div className="question-overlay">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      <div className="question-modal">
        <h3>Zadaj pytanie o zwierzaka</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="Imię"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Nazwisko"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Numer telefonu"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Adres e-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="question"
            placeholder="Twoje pytanie"
            value={formData.question}
            onChange={handleChange}
            required
            maxLength={500}
          />

          <div className="form-buttons">
            <button type="submit">Wyślij</button>
            <button type="button" onClick={onClose}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
