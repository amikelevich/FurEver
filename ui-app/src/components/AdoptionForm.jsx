import { useState, useEffect } from "react";
import Toast from "./Toast";
import "../styles/AdoptionForm.css";

export default function AdoptionForm({ animalId, onClose }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    street: "",
    houseNumber: "",
    city: "",
  });
  const [animal, setAnimal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleCloseToast = () => setToast(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
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

    fetch(`http://localhost:8000/api/animals/${animalId}/`)
      .then((res) => res.json())
      .then((data) => setAnimal(data))
      .catch(() => showToast("Błąd przy pobieraniu danych", "error"));
  }, [animalId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Musisz być zalogowany, aby złożyć wniosek.", "error");
      return;
    }

    const phonePattern = /^[\d+\- ]{7,15}$/;
    if (!phonePattern.test(formData.phone_number)) {
      showToast("Podaj poprawny numer telefonu.", "error");
      return;
    }

    if (!formData.street.trim()) {
      showToast("Podaj nazwę ulicy.", "error");
      return;
    }

    if (!/^\d+([\/\d]*)?$/.test(formData.houseNumber.trim())) {
      showToast("Podaj poprawny numer domu/mieszkania.", "error");
      return;
    }

    if (!/^\d{2}-\d{3}\s+\S+/.test(formData.city.trim())) {
      showToast(
        "Podaj poprawny kod pocztowy i miasto (np. 00-123 Warszawa).",
        "error"
      );
      return;
    }

    const fullAddress = `${formData.street}, ${formData.houseNumber}, ${formData.city}`;

    fetch("http://localhost:8000/api/adoption-applications/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        animal: animalId,
        phone_number: formData.phone_number,
        address: fullAddress,
      }),
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      })
      .then(() => {
        showToast("Wniosek został złożony!", "success");
        setTimeout(() => onClose(), 1000);
      })
      .catch(() => {
        showToast("Nie udało się złożyć wniosku.", "error");
        setTimeout(() => onClose(), 1000);
      });
  };

  if (!animal) return <p>Ładowanie...</p>;

  return (
    <div className="adoption-overlay">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}

      <form onSubmit={handleSubmit} className="adoption-modal">
        <button type="button" className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2>Formularz adopcyjny</h2>

        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Imię"
        />
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Nazwisko"
        />
        <input
          name="email"
          value={formData.email}
          placeholder="Email"
          disabled
        />
        <input
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Numer telefonu"
        />
        <input
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="ul. Krakowska"
        />
        <input
          name="houseNumber"
          value={formData.houseNumber}
          onChange={handleChange}
          placeholder="Numer domu/mieszkania (np. 15/3)"
        />
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="00-123 Warszawa"
        />

        <div className="animal-info-box">
          <p>
            <strong>
              {animal.name}, {animal.age} lat
            </strong>
          </p>
          <p>
            <strong>{animal.breed || "nieznana"}</strong>
          </p>
          <p>
            <strong>{animal.location_display}</strong>
          </p>
        </div>

        <button type="submit">Złóż wniosek</button>
      </form>
    </div>
  );
}
