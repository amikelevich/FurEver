import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import "../styles/AnimalCard.css";
import catShadow from "../assets/cat_shadow.png";
import AnimalForm from "../pages/DashboardAdmin/AnimalForm";
import { FaHeart, FaRegHeart, FaEdit, FaPaw } from "react-icons/fa";

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
      <div className="animal-image-wrapper">
        {animal.images?.length > 0 ? (
          <img src={animal.images[0].image} alt={animal.name} />
        ) : (
          <img src={catShadow} alt="Kot" />
        )}

        {!isAdmin && (
          <button className="like-button" onClick={handleLikeClick}>
            {liked ? (
              <FaHeart className="heart-icon liked" />
            ) : (
              <FaRegHeart className="heart-icon" />
            )}
          </button>
        )}
      </div>

      <div className="animal-info">
        <h3>{animal.name}</h3>
        <p className="breed">{animal.breed ? animal.breed : "nieznana rasa"}</p>
        <p className="age">{animal.age + " lat"}</p>
      </div>

      <div className="animal-card-actions">
        {isAdmin ? (
          <>
            <button
              className="action-btn edit"
              onClick={() => setShowForm(true)}
            >
              <FaEdit /> Edytuj
            </button>
            {!animal.adoption_date ? (
              <button className="action-btn adopt" onClick={onApprove}>
                <FaPaw /> Adopcja
              </button>
            ) : (
              <span className="already-adopted">Zaadoptowany</span>
            )}
          </>
        ) : (
          <button
            className="action-btn details"
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
