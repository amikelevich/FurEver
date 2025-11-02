import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import AnimalCard from "../components/AnimalCard";
import "../styles/FavoritesTab.css";
import Pagination from "../components/Pagination";
import Breadcrumbs from "../components/Breadcrumbs";
import useAnimals from "../hooks/useAnimal";
import { FaHeartBroken } from "react-icons/fa";
import { FaInfoCircle, FaStar } from "react-icons/fa";
import catShadow from "../assets/cat_shadow.png";

export default function FavoritesTab({ isAdmin, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [imageError, setImageError] = useState(false);
  const ITEMS_PER_PAGE = 15;

  const { animals, loading, toggleLike } = useAnimals({
    favorites: true,
  });

  const handleUnlike = async (animalId) => {
    await toggleLike(animalId, false);
  };

  const paginatedAnimals = animals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const [spotlightAnimal, setSpotlightAnimal] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchTopRecommendation = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/recommendations/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(
            "Nie udało się pobrać rekomendacji dla panelu bocznego"
          );
        }
        const data = await res.json();
        if (data && data.length > 0) {
          setSpotlightAnimal(data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTopRecommendation();
  }, [token]);

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const getPreferenceProfile = () => {
    if (animals.length === 0) return null;
    const counts = animals.reduce((acc, animal) => {
      const species = (animal.species || "other").toLowerCase();
      acc[species] = (acc[species] || 0) + 1;
      return acc;
    }, {});
    const [topSpeciesKey, topCount] = Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    let typePlural = "zwierzęta";
    if (topSpeciesKey === "dog") typePlural = "psy";
    else if (topSpeciesKey === "cat") typePlural = "koty";
    else if (topSpeciesKey === "rabbit") typePlural = "króliki";
    else if (topSpeciesKey === "hamster") typePlural = "chomiki";
    else if (topSpeciesKey === "bird") typePlural = "ptaki";
    else if (topSpeciesKey === "other") typePlural = "inne";
    return { type: typePlural, count: topCount, total: animals.length };
  };

  const preference = getPreferenceProfile();

  useEffect(() => {
    setImageError(false);
  }, [spotlightAnimal]);

  const finalImageSrc = useMemo(() => {
    if (imageError) return catShadow;
    if (!spotlightAnimal) return catShadow;

    const imageSrc =
      spotlightAnimal.image?.trim() ||
      spotlightAnimal.images?.[0]?.image?.trim() ||
      spotlightAnimal.images?.[0]?.url?.trim() ||
      spotlightAnimal.images?.[0]?.image_url?.trim() ||
      spotlightAnimal.photos?.[0]?.url?.trim() ||
      catShadow;
    return imageSrc;
  }, [spotlightAnimal, imageError]);

  return (
    <div className={`favorites-page ${isAdmin ? "admin" : "user"}`}>
      <Breadcrumbs user={user} currentPageName="Obserwowane zwierzęta" />
      <h2>Twoje obserwowane zwierzęta</h2>
      <div className="favorites-main-content">
        {loading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
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
      <aside className="favorites-sidebar">
        {preference && spotlightAnimal && (
          <div key="profile-widget" className="sidebar-widget profile-widget">
            <h3>
              <FaStar /> Twój Profil
            </h3>
            <p className="profile-summary">
              Wygląda na to, że Twoje serce skradły{" "}
              <strong>{preference.type}</strong>!
            </p>
            <p className="profile-subtext">
              Stanowią {preference.count} z {preference.total} obserwowanych
              przez Ciebie zwierzaków.
            </p>
            <hr className="profile-divider" />

            <h4 className="spotlight-title">Polecane dla Ciebie:</h4>

            <Link
              to={`/animals/${spotlightAnimal.id}`}
              className="spotlight-card"
            >
              <img
                src={finalImageSrc}
                alt={spotlightAnimal.name || "Zdjęcie zwierzaka"}
                onError={() => setImageError(true)}
              />
              <div className="spotlight-info">
                <strong>{spotlightAnimal.name || "Brak nazwy"}</strong>
                <span>{spotlightAnimal.breed || "Brak rasy"}</span>
              </div>
            </Link>
          </div>
        )}

        <div key="info-widget" className="sidebar-widget">
          <h3>
            <FaInfoCircle /> Warto wiedzieć
          </h3>
          <p className="sidebar-info-text">
            Obserwowanie zwierzaka to pierwszy krok. Pamiętaj, aby skontaktować
            się ze schroniskiem i umówić na wizytę!
          </p>
        </div>
      </aside>
    </div>
  );
}
