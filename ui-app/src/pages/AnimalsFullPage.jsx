import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AnimalCard from "../components/AnimalCard";
import AnimalFilters from "../components/AnimalFilters";
import Pagination from "../components/Pagination";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/AnimalsFullPage.css";

export default function AnimalsFullPage({ isAdmin, onEdit }) {
  const [animals, setAnimals] = useState([]);
  const [archivedAnimals, setArchivedAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "active";

  const fetchAnimals = async (activeFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams(
        Object.entries(activeFilters).filter(([_, v]) => v != null && v !== "")
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
        if (adoptionDate && adoptionDate < today) archived.push(animal);
        else available.push(animal);
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

  useEffect(() => {
    fetchAnimals(filters);
  }, [filters]);

  const displayedAnimals = category === "archived" ? archivedAnimals : animals;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnimals = displayedAnimals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(displayedAnimals.length / ITEMS_PER_PAGE);

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="animals-full-page">
      <Breadcrumbs
        user={user}
        currentPageName={
          category === "archived"
            ? "Archiwalne zwierzęta"
            : "Wszystkie zwierzęta"
        }
      />

      <h2>
        {category === "archived"
          ? "Archiwalne zwierzęta"
          : "Wszystkie zwierzęta"}
      </h2>

      <div className="content">
        <div className="animal-list">
          {loading ? (
            <p>Ładowanie...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : displayedAnimals.length > 0 ? (
            <>
              {paginatedAnimals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  isAdmin={true}
                  onEdit={onEdit || (() => {})}
                  onLikeToggle={() => {}}
                  isLiked={!!animal.is_liked}
                  source="animals-full"
                  onAnimalUpdated={fetchAnimals}
                />
              ))}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <p>Brak zwierząt</p>
          )}
        </div>

        <div className="filters">
          <AnimalFilters onFilterChange={setFilters} />
        </div>
      </div>
    </div>
  );
}
