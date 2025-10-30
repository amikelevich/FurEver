import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AnimalCard from "../components/AnimalCard";
import Pagination from "../components/Pagination";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/SearchPage.css";

export default function SearchPage({ isAdmin, onEdit }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchAnimals = async () => {
    if (!queryParam) {
      setAnimals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/animals/search/?query=${encodeURIComponent(
          queryParam
        )}`
      );
      const data = await res.json();
      setAnimals(data);
    } catch (err) {
      console.error("Błąd przy wyszukiwaniu zwierząt:", err);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
    setCurrentPage(1);
  }, [queryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/animals/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAnimals = animals.slice(startIndex, endIndex);

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="search-page">
      <Breadcrumbs
        user={user}
        currentPageName="Wyszukane zwierzęta"
        previousPageName="Wyszukane zwierzęta"
      />

      <form onSubmit={handleSearchSubmit} className="search-form-page">
        <input
          type="text"
          placeholder="Szukaj zwierząt..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-page"
        />
        <button type="submit" className="search-btn-page">
          Szukaj
        </button>
      </form>

      <h2>Wyniki wyszukiwania dla: "{queryParam}"</h2>

      {loading ? (
        <p>Ładowanie...</p>
      ) : animals.length > 0 ? (
        <>
          <div className="animal-list-search">
            {paginatedAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onLikeToggle={() => {}}
                isLiked={animal.is_liked}
                source="search"
                onAnimalUpdated={fetchAnimals}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(animals.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p>Brak zwierząt pasujących do wyszukiwania</p>
      )}
    </div>
  );
}
