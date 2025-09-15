import AnimalCard from "./AnimalCard";

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

  const displayedAnimals = animals.slice(0, 3);
  return (
    <div style={{ color: "black" }}>
      <h3>{categoryKey}</h3>
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
          <div
            className="see-more-card"
            onClick={() => navigate(`/animals/full?category=${categoryKey}`)}
          >
            <div className="animal-card arrow-card">
              <span className="arrow">➡️</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalCategoryList;
