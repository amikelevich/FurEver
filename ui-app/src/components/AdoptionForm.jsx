import { useState, useEffect } from "react";
import "../styles/AdoptionForm.css";

export default function AdoptionForm({ animalId, onClose }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [animal, setAnimal] = useState(null);

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
      .catch((err) => console.error(err));

    fetch(`http://localhost:8000/api/animals/${animalId}/`)
      .then((res) => res.json())
      .then((data) => setAnimal(data))
      .catch((err) => console.error("Błąd przy pobieraniu zwierzaka:", err));
  }, [animalId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musisz być zalogowany, aby złożyć wniosek.");
      return;
    }

    fetch("http://localhost:8000/api/adoption-applications/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        animal: animalId,
        phone_number: formData.phone_number,
        address: formData.address,
      }),
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (res.ok) {
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          }
          return {};
        } else {
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            throw new Error(JSON.stringify(data));
          }
          const text = await res.text();
          throw new Error(text);
        }
      })
      .then((data) => {
        console.log("Wniosek złożony:", data);
        alert("Wniosek został złożony!");
        onClose();
      })
      .catch((err) => {
        console.error("Błąd przy wysyłaniu wniosku:", err);
        alert("Nie udało się złożyć wniosku. Sprawdź dane i token.");
      });
  };

  if (!animal) return <p>Ładowanie...</p>;

  return (
    <div className="adoption-overlay">
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
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Adres"
        />

        <div className="animal-info-box">
          <p>
            <strong>Imię:</strong> {animal.name}
          </p>
          <p>
            <strong>Rasa:</strong> {animal.breed || "nieznana"}
          </p>
          <p>
            <strong>Schronisko:</strong> {animal.location}
          </p>
        </div>

        <button type="submit">Złóż wniosek</button>
      </form>
    </div>
  );
}
