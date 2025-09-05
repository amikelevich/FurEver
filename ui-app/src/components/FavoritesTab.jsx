import { useEffect, useState } from "react";
import AnimalCard from "../components/AnimalCard";
import "../styles/AnimalCard.css";

export default function FavoritesTab({ isAdmin, onEdit }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setAnimals(data);
    } catch (err) {
      console.error("Błąd przy pobieraniu ulubionych zwierząt:", err);
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

  return (
    <div className="animals-tab">
      <p>Twoje obserwowane zwierzęta</p>
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
              onLikeToggle={onLikeToggle}
              isLiked={animal.is_liked}
            />
          ))}
        </div>
      ) : (
        <p>Brak obserwowanych zwierząt</p>
      )}
    </div>
  );
}
