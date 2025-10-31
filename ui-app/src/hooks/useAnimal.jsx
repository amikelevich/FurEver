import { useState, useEffect, useCallback } from "react";

export default function useAnimals(filters = {}) {
  const [animals, setAnimals] = useState([]);
  const [archivedAnimals, setArchivedAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stableFilters = JSON.stringify(filters);

  const fetchAnimals = useCallback(
    async (filterString = stableFilters) => {
      const activeFilters = JSON.parse(filterString);

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");

        const query = new URLSearchParams(
          Object.entries(activeFilters).filter(
            ([_, v]) => v !== null && v !== ""
          )
        ).toString();

        const res = await fetch(
          `http://localhost:8000/api/animals/${query ? `?${query}` : ""}`,
          {
            cache: "no-store",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!res.ok) throw new Error(`Błąd pobierania zwierząt: ${res.status}`);

        const data = await res.json();

        if (!Array.isArray(data))
          throw new Error("Oczekiwano tablicy zwierząt");

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
    },
    [stableFilters]
  );

  const approveAdoption = useCallback(
    async (animalId) => {
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
          throw new Error(
            errorData.error || "Nie udało się zatwierdzić adopcji"
          );
        }

        fetchAnimals(stableFilters);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    },
    [fetchAnimals, stableFilters]
  );

  const addAnimalManually = useCallback((newAnimal) => {
    console.log("KROK 2 (useAnimals - DODAWANIE): Próbuję dodać:", newAnimal);
    const today = new Date();
    const adoptionDate = newAnimal.adoption_date
      ? new Date(newAnimal.adoption_date)
      : null;

    if (adoptionDate && adoptionDate < today) {
      setArchivedAnimals((current) => [newAnimal, ...current]);
    } else {
      setAnimals((current) => [newAnimal, ...current]);
    }
  }, []);

  const updateAnimalManually = useCallback((updatedAnimal) => {
    console.log(
      "KROK 2 (useAnimals - EDYCJA/LIKE): Aktualizuję ręcznie:",
      updatedAnimal
    );

    const isMatchingAnimal = (animal) =>
      String(animal.id) === String(updatedAnimal.id);

    setAnimals((current) =>
      current.filter((animal) => !isMatchingAnimal(animal))
    );
    setArchivedAnimals((current) =>
      current.filter((animal) => !isMatchingAnimal(animal))
    );

    const today = new Date();
    const adoptionDate = updatedAnimal.adoption_date
      ? new Date(updatedAnimal.adoption_date)
      : null;

    if (adoptionDate && adoptionDate < today) {
      setArchivedAnimals((current) => [updatedAnimal, ...current]);
    } else {
      setAnimals((current) => [updatedAnimal, ...current]);
    }
  }, []);

  const toggleLike = useCallback(
    async (animalId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Musisz być zalogowany, aby polubić zwierzę.");
          return;
        }

        const res = await fetch(
          `http://localhost:8000/api/animals/${animalId}/like/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const updatedAnimal = await res.json();
          updateAnimalManually(updatedAnimal);
        } else {
          const errorData = await res.json();
          console.error("Błąd przy polubieniu:", errorData);
        }
      } catch (err) {
        console.error("Błąd sieci przy toggleLike", err);
      }
    },
    [updateAnimalManually]
  );

  useEffect(() => {
    fetchAnimals(stableFilters);
  }, [fetchAnimals, stableFilters]);

  return {
    animals,
    archivedAnimals,
    loading,
    error,
    fetchAnimals,
    approveAdoption,
    toggleLike,
    addAnimalManually,
    updateAnimalManually,
  };
}
