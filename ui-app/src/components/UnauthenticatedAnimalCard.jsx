import { useNavigate } from "react-router-dom";
import "../styles/UnauthenticatedAnimalCard.css";
import icon from "../assets/icon.jpg";

export default function UnauthenticatedAnimalCard({ animal }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/animals/${animal.id}`);
  };

  const imageUrl = animal.images?.length > 0 ? animal.images[0].image : icon;
  const firstTrait = animal.short_traits_display?.[0];
  const tagText = firstTrait || "Gotowy na dom";

  return (
    <div className="unauth-animal-card" onClick={handleCardClick}>
      <div className="unauth-animal-image-wrapper" data-tag={tagText}>
        <img src={imageUrl} alt={animal.name} />
      </div>

      <div className="unauth-animal-info">
        <h3>{animal.name}</h3>
        <p className="unauth-animal-breed">
          {animal.breed ? animal.breed : "Rasa nieznana"}
        </p>
        <p className="unauth-animal-age">{animal.age} lat</p>
      </div>
    </div>
  );
}
