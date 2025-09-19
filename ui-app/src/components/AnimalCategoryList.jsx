import AnimalCard from "./AnimalCard";
import "../styles/AnimalCategoryList.css";

const AnimalCategoryList = ({
  animals,
  isAdmin,
  onEdit,
  onApprove,
  onLikeToggle,
  categoryKey,
  navigate,
}) => {
  if (!animals || animals.length === 0) return null;

  const displayedAnimals = animals.slice(0, 2);

  const handleSeeMoreClick = () => {
    navigate(`/animals/full`, {
      state: {
        animals,
        categoryKey,
      },
    });
    console.log(animals), console.log(categoryKey);
  };

  return (
    <div className="animal-category">
      <h3 className="animal-category-header">{categoryKey}</h3>
      <div className="animal-list">
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
        {animals.length > 2 && (
          <div className="see-more-card" onClick={handleSeeMoreClick}>
            <div className="arrow-card modern-arrow">
              <span className="extra-count">+{animals.length - 2}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalCategoryList;
