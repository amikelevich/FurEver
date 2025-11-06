import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import UnauthenticatedAnimalCard from "./UnauthenticatedAnimalCard";
import "../styles/MainPageAnimals.css";

export default function MainPageAnimals() {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomAnimals = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/animals/public_random/"
        );
        if (!res.ok) {
          throw new Error("Nie udało się pobrać danych");
        }
        const data = await res.json();
        setAnimals(data);
      } catch (err) {
        console.error("Błąd pobierania rekomendacji:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomAnimals();
  }, []);

  const handleSeeAllClick = () => {
    navigate("/animals/user");
  };

  if (!isLoading && animals.length === 0) {
    return null;
  }

  return (
    <section className="main-page-animals-section" id="recommended">
      <h2 className="main-page-animals-title">
        {isLoading
          ? "Szukamy przyjaciół..."
          : "Kto z nich skradnie Twoje serce?"}
      </h2>
      <p className="main-page-animals-subtitle">
        {!isLoading && "Poznaj historie, które czekają na nowy początek."}
      </p>

      <div className="main-page-animals-grid">
        {isLoading ? (
          <div className="main-page-animals-status">Ładowanie...</div>
        ) : (
          <>
            {animals.map((animal) => (
              <UnauthenticatedAnimalCard key={animal.id} animal={animal} />
            ))}

            <div className="cta-animal-card" onClick={handleSeeAllClick}>
              <div className="cta-icon-wrapper">
                <FaPaw />
              </div>
              <h3>Przeglądaj dalej</h3>
              <p>Zobacz pełną listę naszych podopiecznych</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
