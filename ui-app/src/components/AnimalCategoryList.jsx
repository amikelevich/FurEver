import { useMemo } from "react";
import AnimalCard from "./AnimalCard";
import "../styles/AnimalCategoryList.css";

const ADMIN_PREVIEW_COUNT = 4;
const USER_PREVIEW_COUNT = 2;

const AnimalCategoryList = ({
  animals,
  isAdmin,
  onEdit,
  onApprove,
  onLikeToggle,
  categoryKey,
  navigate,
}) => {
  const displayedAnimals = useMemo(() => {
    if (!animals || animals.length === 0) {
      return [];
    }
    const count = isAdmin ? ADMIN_PREVIEW_COUNT : USER_PREVIEW_COUNT;
    return animals.slice(0, count);
  }, [animals, isAdmin]);

  if (displayedAnimals.length === 0) {
    return null;
  }

  const handleSeeMoreClick = () => {
    navigate(`/animals/full`, {
      state: {
        animals,
        categoryKey,
      },
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      handleSeeMoreClick();
    }
  };

  return (
    <div className="animal-category">
      <h3 className="animal-category-header">{categoryKey}</h3>
      <div className={`animal-list ${isAdmin ? "admin-list" : "user-list"}`}>
        {displayedAnimals.map((a) => (
          <AnimalCard
            key={a.id}
            animal={a}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onApprove={() => onApprove(a.id)}
            onLikeToggle={onLikeToggle}
            isLiked={!!a.is_liked}
          />
        ))}
        {animals.length > displayedAnimals.length && (
          <div
            className="see-more-card"
            onClick={handleSeeMoreClick}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            role="button"
          >
            <div className="arrow-card modern-arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              <p>Zobacz więcej</p>
              <span className="extra-count">
                +{animals.length - displayedAnimals.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalCategoryList;
