import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import "../styles/AnimalCard.css";
import catShadow from "../assets/cat_shadow.png";
import AnimalForm from "../pages/DashboardAdmin/AnimalForm";

export default function AnimalCard({
  animal,
  isAdmin,
  onApprove,
  onLikeToggle,
  isLiked,
  source,
  onAnimalUpdated,
}) {
  const [liked, setLiked] = useState(isLiked || false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    onLikeToggle(animal.id, newLiked);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <div className="animal-card">
      {!isAdmin && (
        <button className="like-button" onClick={handleLikeClick}>
          <span className={`heart ${liked ? "liked" : ""}`}>&#9825;</span>
        </button>
      )}

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
            <button onClick={() => setShowForm(true)}>Edytuj</button>
            {!animal.adoption_date ? (
              <button onClick={onApprove}>Adopcja</button>
            ) : (
              <span className="already-adopted">Zaadoptowany</span>
            )}
          </>
        ) : (
          <button
            onClick={() =>
              navigate(`/animals/${animal.id}`, { state: { from: source } })
            }
          >
            Zobacz szczegóły
          </button>
        )}
      </div>

      {showForm &&
        ReactDOM.createPortal(
          <div className="modal-overlay">
            <div className="modal-content">
              <AnimalForm
                onClose={handleFormClose}
                animalToEdit={animal}
                onAdded={() => setShowForm(false)}
                onAnimalUpdated={onAnimalUpdated}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
