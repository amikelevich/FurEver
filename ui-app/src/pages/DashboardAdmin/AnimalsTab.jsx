import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import AnimalCard from "../../components/AnimalCard";
import AnimalFilters from "../../components/AnimalFilters";
import "../../styles/AnimalCard.css";
import Breadcrumbs from "../../components/Breadcrumbs";

const AnimalsTab = forwardRef(({ onAddClick, isAdmin, onEdit }, ref) => {
  const [animals, setAnimals] = useState([]);
  const [archivedAnimals, setArchivedAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="animals-tab" style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 3 }}>
        <Breadcrumbs user={user} currentPageName={"lista zwierząt"} />

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
        ) : (
          <>
            <div className="animal-list">
              {animals.slice(0, 3).map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  isAdmin={isAdmin}
                  onEdit={onEdit || (() => {})}
                  onApprove={() => approveAdoption(animal.id)}
                  onLikeToggle={onLikeToggle}
                  isLiked={!!animal.is_liked}
                  source="animals"
                />
              ))}

              {animals.length > 3 && (
                <div
                  className="see-more-card"
                  onClick={() => navigate("/animals/full?category=active")}
                >
                  <div className="animal-card arrow-card">
                    <span className="arrow">➡️</span>
                  </div>
                </div>
              )}
            </div>

            {isAdmin && archivedAnimals.length > 0 && (
              <>
                <h4>Archiwalne zwierzęta</h4>
                <div className="animal-list">
                  {archivedAnimals.slice(0, 3).map((animal) => (
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

                  {archivedAnimals.length > 3 && (
                    <div
                      className="see-more-card"
                      onClick={() =>
                        navigate("/animals/full?category=archived")
                      }
                    >
                      <div className="animal-card arrow-card">
                        <span className="arrow">➡️</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <AnimalFilters onFilterChange={setFilters} />
      </div>
    </div>
  );
});

export default AnimalsTab;
