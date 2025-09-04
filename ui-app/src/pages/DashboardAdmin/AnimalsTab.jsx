import { useEffect, useState } from "react";
import AnimalCard from "../../components/AnimalCard";
import "../../styles/AnimalCard.css";

export default function AnimalsTab({ onAddClick, isAdmin, onEdit }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnimals = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/animals/");
      const data = await res.json();
      setAnimals(data);
    } catch (err) {
      console.error("Błąd przy pobieraniu zwierząt:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const approveAdoption = async (animalId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Brak tokenu. Zaloguj się jako admin.");

      const res = await fetch(
        `http://localhost:8000/api/animals/${animalId}/admin_approve/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Nie udało się zatwierdzić adopcji");
      }

      alert("Adopcja zatwierdzona!");
      fetchAnimals();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="animals-tab">
      {isAdmin && (
        <button className="add-animal-btn" onClick={onAddClick}>
          ➕ Dodaj zwierzę
        </button>
      )}

      <p>Lista zwierząt</p>

      {loading ? (
        <p>Ładowanie...</p>
      ) : animals.length > 0 ? (
        <div className="animal-list">
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onApprove={() => approveAdoption(animal.id)}
            />
          ))}
        </div>
      ) : (
        <p>Brak zwierząt</p>
      )}
    </div>
  );
}
