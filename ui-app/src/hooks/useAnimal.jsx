import { useState, useEffect } from "react";

export default function useAnimals(initialFilters = {}) {
  const [animals, setAnimals] = useState([]);
  const [archivedAnimals, setArchivedAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchAnimals = async (activeFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
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

      if (!Array.isArray(data)) throw new Error("Oczekiwano tablicy zwierząt");

      const today = new Date();
      const available = [];
      const archived = [];

      data.forEach((animal) => {
        const adoptionDate = animal.adoption_date
          ? new Date(animal.adoption_date)
          : null;
        if (adoptionDate && adoptionDate < today) {
          archived.push(animal);
        } else {
          available.push(animal);
        }
      });

      setAnimals(available);
      setArchivedAnimals(archived);
    } catch (err) {
      console.error(err);
      setError(err.message || "Nieoczekiwany błąd");
      setAnimals([]);
      setArchivedAnimals([]);
    } finally {
      setLoading(false);
    }
  };

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
  useEffect(() => {
    fetchAnimals(filters);
  }, [filters]);

  return {
    animals,
    archivedAnimals,
    loading,
    error,
    filters,
    setFilters,
    fetchAnimals,
    approveAdoption,
    onLikeToggle,
  };
}
