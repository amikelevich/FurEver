import { useState } from "react";
import { Link } from "react-router-dom";
import AnimalCard from "../components/AnimalCard";
import "../styles/FavoritesTab.css";
import Pagination from "../components/Pagination";
import Breadcrumbs from "../components/Breadcrumbs";
import useAnimals from "../hooks/useAnimal";
import { FaHeartBroken } from "react-icons/fa";

export default function FavoritesTab({ isAdmin, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const { animals, loading, toggleLike, setAnimals } = useAnimals({
    favorites: true,
  });

  const handleUnlike = async (animalId) => {
    await toggleLike(animalId, false);
    setAnimals((prevAnimals) => prevAnimals.filter((a) => a.id !== animalId));
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnimals = animals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className={`favorites-page ${isAdmin ? "admin" : "user"}`}>
      <Breadcrumbs user={user} currentPageName="Obserwowane zwierzęta" />
      <h2>Twoje obserwowane zwierzęta</h2>

      {loading ? (
        <p>Ładowanie...</p>
      ) : animals.length > 0 ? (
        <>
          <div className="favorites-grid">
            {paginatedAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onLikeToggle={() => handleUnlike(animal.id)}
                isLiked={true}
                source="favorites"
              />
            ))}
          </div>

          {animals.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(animals.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="empty-state">
          <FaHeartBroken />
          <h3>Nie masz jeszcze obserwowanych zwierząt</h3>
          <p>Kliknij serce na karcie zwierzaka, aby dodać go do tej listy.</p>
          <Link to="/animals" className="cta-button">
            Przeglądaj zwierzęta
          </Link>
        </div>
      )}
    </div>
  );
}
