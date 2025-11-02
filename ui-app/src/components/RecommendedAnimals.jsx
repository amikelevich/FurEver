import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimalCard from "../components/AnimalCard";
import "../styles/FavoritesTab.css";
import Breadcrumbs from "../components/Breadcrumbs";
import { FaHeartBroken } from "react-icons/fa";
import "../styles/AnimalCategoryList.css";

export default function FavoritesTab({ isAdmin, onEdit }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPets, setLikedPets] = useState(new Set());

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchTopRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8000/api/recommendations/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Nie udało się pobrać rekomendacji");
        }

        const data = await res.json();

        setAnimals(data.slice(0, 3));

        const initialLiked = new Set(
          data
            .slice(0, 3)
            .filter((p) => p.is_liked)
            .map((p) => p.id)
        );
        setLikedPets(initialLiked);
      } catch (err) {
        console.error(err);
        setError(err.message || "Nieoczekiwany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchTopRecommendations();
  }, [token]);

  const handleLikeToggle = async (animalId, shouldLike) => {
    const endpoint = shouldLike ? "like" : "unlike";
    const url = `http://localhost:8000/api/animals/${animalId}/${endpoint}/`;

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (shouldLike) {
        setLikedPets((prev) => new Set(prev).add(animalId));
      } else {
        setLikedPets((prev) => {
          const newLiked = new Set(prev);
          newLiked.delete(animalId);
          return newLiked;
        });
        setAnimals((prevAnimals) =>
          prevAnimals.filter((a) => a.id !== animalId)
        );
      }
    } catch (err) {
      console.error("Błąd przy (od)lubieniu:", err);
    }
  };

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    if (error) {
      return <div className="empty-state">{error}</div>;
    }

    if (animals.length > 0) {
      return (
        <div className="favorites-grid">
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              isAdmin={isAdmin}
              onEdit={onEdit}
              isLiked={likedPets.has(animal.id)}
              onLikeToggle={(animalId, shouldLike) =>
                handleLikeToggle(animalId, shouldLike)
              }
              source="favorites-top-3"
            />
          ))}
        </div>
      );
    }

    return (
      <div className="empty-state">
        <FaHeartBroken />
        <h3>Nie mamy jeszcze dla Ciebie rekomendacji</h3>
        <p>Polub kilka zwierzaków, abyśmy mogli poznać Twój gust!</p>
        <Link to="/animals" className="cta-button">
          Przeglądaj zwierzęta
        </Link>
      </div>
    );
  };

  return (
    <div className={`favorites-page ${isAdmin ? "admin" : "user"}`}>
      <Breadcrumbs user={user} currentPageName="Propozycje dla Ciebie" />
      <h2>Dla Ciebie</h2>
      <div className="favorites-main-content">{renderContent()}</div>
    </div>
  );
}
