import { useEffect, useState } from "react";
import AnimalCard from "../../components/AnimalCard";
import "../../styles/AnimalCard.css";

export default function AnimalsTab({
  onAddClick,
  isAdmin,
  onEdit,
  onAdopt,
  onDetails,
}) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/animals/")
      .then((res) => res.json())
      .then((data) => {
        setAnimals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd przy pobieraniu zwierząt:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animals-tab">
      {isAdmin && (
        <button className="add-animal-btn" onClick={onAddClick}>
          ➕ Dodaj zwierzę
        </button>
      )}

      <p>Lista zwierząt</p>

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
              onAdopt={onAdopt}
              onDetails={onDetails}
            />
          ))}
        </div>
      ) : (
        <p>Brak zwierząt</p>
      )}
    </div>
  );
}
