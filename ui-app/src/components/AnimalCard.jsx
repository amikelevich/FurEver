import "../styles/AnimalCard.css";
import catShadow from "../assets/cat_shadow.png";
import { useNavigate } from "react-router-dom";

export default function AnimalCard({
  animal,
  isAdmin,
  onEdit,
  onAdopt,
  onDetails,
}) {
  const navigate = useNavigate();

  return (
    <div className="animal-card">
      {animal.images?.length > 0 ? (
        <div className="animal-images">
          {animal.images.map((img, index) => (
            <img
              key={index}
              src={img.image}
              alt={`${animal.name} ${index + 1}`}
            />
          ))}
        </div>
      ) : (
        <img src={catShadow} alt="Kot" />
      )}

      <h3>{animal.name}</h3>
      <p>
        <strong>Wiek:</strong> {animal.age}
      </p>
      <p>
        <strong>Rasa:</strong> {animal.breed}
      </p>

      <div className="animal-card-actions">
        {isAdmin ? (
          <>
            <button onClick={() => onAdopt(animal)}>Edytuj</button>
            <button onClick={() => onAdopt(animal)}>Adopcja</button>
          </>
        ) : (
          <button onClick={() => navigate(`/animals/${animal.id}`)}>
            Zobacz szczegóły
          </button>
        )}
      </div>
    </div>
  );
}
