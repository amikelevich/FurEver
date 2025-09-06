import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import AnimalCard from "../../components/AnimalCard";
import AnimalFilters from "../../components/AnimalFilters";
import "../../styles/AnimalCard.css";

const AnimalsTab = forwardRef(({ onAddClick, isAdmin, onEdit }, ref) => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);

  const fetchAnimals = async (activeFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const query = new URLSearchParams(
        Object.entries(activeFilters).filter(([_, v]) => v !== null && v !== "")
      ).toString();

      const res = await fetch(
        `http://localhost:8000/api/animals/${query ? `?${query}` : ""}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) throw new Error(`Błąd pobierania zwierząt: ${res.status}`);
      const data = await res.json();
      setAnimals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Nieoczekiwany błąd");
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshAnimals: () => fetchAnimals(),
  }));

  useEffect(() => {
    fetchAnimals(filters);
  }, [filters]);

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
      fetchAnimals(filters);
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

      fetchAnimals(filters);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="animals-tab" style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 3 }}>
        {isAdmin && (
          <button className="add-animal-btn" onClick={onAddClick}>
            ➕ Dodaj zwierzę
          </button>
        )}

        <p>Lista zwierząt</p>

        {loading ? (
          <p>Ładowanie...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : animals.length > 0 ? (
          <div className="animal-list">
            {animals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                isAdmin={isAdmin}
                onEdit={onEdit || (() => {})}
                onApprove={() => approveAdoption(animal.id)}
                onLikeToggle={onLikeToggle}
                isLiked={!!animal.is_liked}
              />
            ))}
          </div>
        ) : (
          <p>Brak zwierząt</p>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <AnimalFilters onFilterChange={setFilters} />
      </div>
    </div>
  );
});

export default AnimalsTab;
