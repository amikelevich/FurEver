import { useEffect, useState } from "react";
import AnimalCard from "../../components/AnimalCard";
import "../../styles/AnimalCard.css";

export default function AnimalsTab({ onAddClick, isAdmin, onEdit }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnimals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/animals/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setAnimals(data);
    } catch (err) {
      console.error(err);
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

  const onLikeToggle = async (animalId, liked) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Brak tokenu. Zaloguj się, aby polubić.");

      const url = `http://localhost:8000/api/animals/${animalId}/${
        liked ? "like" : "unlike"
      }/`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Błąd przy polubieniu zwierzęcia");
      }

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
              onLikeToggle={onLikeToggle}
              isLiked={animal.is_liked}
            />
          ))}
        </div>
      ) : (
        <p>Brak zwierząt</p>
      )}
    </div>
  );
}
