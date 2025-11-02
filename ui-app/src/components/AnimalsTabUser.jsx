import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import AnimalFilters from "./AnimalFilters";
import AnimalCategoryList from "./AnimalCategoryList";
import useAnimals from "../hooks/useAnimal";
import RecommendedAnimals from "../components/RecommendedAnimals";
import "../styles/AnimalsTabUser.css";

const paramsToFilters = (params) => {
  return {
    species: params.get("species") || null,
    age: params.get("age") || null,
    gender: params.get("gender") || null,
    location: params.get("location") || null,
    short_trait: params.get("short_trait") || null,
    breed: params.get("breed") || null,
  };
};

export default function AnimalsTabUser() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => paramsToFilters(searchParams), [searchParams]);
  const { animals, loading, error, approveAdoption, toggleLike } =
    useAnimals(filters);

  const handleFilterChange = (newFilters) => {
    const cleanParams = {};
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        cleanParams[key] = value;
      }
    });
    setSearchParams(cleanParams);
  };

  const categories = useMemo(() => {
    const dogs = [],
      longestSearching = [],
      sterilized = [];
    const today = new Date();

    animals.forEach((animal) => {
      const addedDate = new Date(animal.created_at);
      const daysSinceAdded = (today - addedDate) / (1000 * 60 * 60 * 24);

      if (daysSinceAdded > 2) longestSearching.push(animal);
      if (animal.species?.toLowerCase() === "dog") dogs.push(animal);
      if (animal.sterilized) sterilized.push(animal);
    });

    return { longestSearching, dogs, sterilized };
  }, [animals]);

  const categoriesConfig = [
    { key: "Szukają domu najdłużej", data: categories.longestSearching },
    { key: "Psy", data: categories.dogs },
    { key: "Sterylizacja/kastracja", data: categories.sterilized },
  ];

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="animals-tab-layout user">
      <div className="main-content">
        <RecommendedAnimals />
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
        <AnimalFilters filters={filters} onFilterChange={handleFilterChange} />
      </aside>
    </div>
  );
}
