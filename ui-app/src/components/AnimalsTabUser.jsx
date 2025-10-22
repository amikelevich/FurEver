import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AnimalFilters from "./AnimalFilters";
import AnimalCategoryList from "./AnimalCategoryList";
import useAnimals from "../hooks/useAnimal";
import "../styles/AnimalsTabUser.css";

export default function AnimalsTabUser() {
  const navigate = useNavigate();
  const { animals, loading, error, setFilters, approveAdoption, toggleLike } =
    useAnimals();

  const categories = useMemo(() => {
    const dogs = [],
      cats = [],
      longestSearching = [],
      sterilized = [];
    const today = new Date();

    animals.forEach((animal) => {
      const addedDate = new Date(animal.created_at);
      const daysSinceAdded = (today - addedDate) / (1000 * 60 * 60 * 24);

      if (daysSinceAdded > 2) longestSearching.push(animal);
      if (animal.species?.toLowerCase() === "dog") dogs.push(animal);
      if (animal.species?.toLowerCase() === "cat") cats.push(animal);
      if (animal.sterilized) sterilized.push(animal);
    });

    return { longestSearching, dogs, cats, sterilized };
  }, [animals]);

  const categoriesConfig = [
    { key: "Szukają domu najdłużej", data: categories.longestSearching },
    { key: "Psy", data: categories.dogs },
    { key: "Koty", data: categories.cats },
    { key: "Sterylizacja/kastracja", data: categories.sterilized },
  ];

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="animals-tab-layout user">
      <div className="main-content">
        {categoriesConfig.map(({ key, data }) => (
          <AnimalCategoryList
            key={key}
            animals={data}
            isAdmin={false}
            onApprove={approveAdoption}
            onLikeToggle={toggleLike}
            categoryKey={key}
            navigate={navigate}
          />
        ))}
      </div>
      <aside className="filters-sidebar">
        <AnimalFilters onFilterChange={setFilters} />
      </aside>
    </div>
  );
}
