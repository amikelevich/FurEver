import { useEffect, useState } from "react";
import AnimalCard from "../components/AnimalCard";
import "../styles/AnimalCard.css";
import Pagination from "../components/Pagination";
import Breadcrumbs from "../components/Breadcrumbs";

export default function FavoritesTab({ isAdmin, onEdit }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:8000/api/animals/?favorites=true",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();

      const today = new Date();
      const availableAnimals = (data || []).filter(
        (animal) =>
          !animal.adoption_date || new Date(animal.adoption_date) >= today
      );

      setAnimals(availableAnimals);
    } catch (err) {
      console.error("Błąd przy pobieraniu ulubionych zwierząt:", err);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

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

      if (!res.ok) throw new Error("Błąd przy polubieniu zwierzęcia");

      fetchFavorites();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAnimals = animals.slice(startIndex, endIndex);
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="animals-tab">
      <Breadcrumbs user={user} currentPageName={"obserwowane zwierzęta"} />
      <p>Twoje obserwowane zwierzęta</p>
      {loading ? (
        <p>Ładowanie...</p>
      ) : animals.length > 0 ? (
        <>
          <div className="animal-list">
            {paginatedAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onLikeToggle={onLikeToggle}
                isLiked={animal.is_liked}
                source="favorites"
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
        <p>Brak obserwowanych zwierząt dostępnych do adopcji</p>
      )}
    </div>
  );
}
