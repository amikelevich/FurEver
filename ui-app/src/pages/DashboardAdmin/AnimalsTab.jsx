import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import AnimalFilters from "../../components/AnimalFilters";
import Breadcrumbs from "../../components/Breadcrumbs";
import AnimalCategoryList from "../../components/AnimalCategoryList";
import useAnimals from "../../hooks/useAnimal";
import "../../styles/AnimalCard.css";

const AnimalsTab = forwardRef(({ onAddClick, isAdmin, onEdit }, ref) => {
  const navigate = useNavigate();
  const {
    animals,
    archivedAnimals,
    loading,
    error,
    filters,
    setFilters,
    approveAdoption,
    toggleLike,
  } = useAnimals();

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const categorizeAnimals = (animalsList) => {
    const dogs = [];
    const cats = [];
    const longestSearching = [];
    const sterilized = [];
    const today = new Date();

    animalsList.forEach((animal) => {
      const addedDate = animal.created_at ? new Date(animal.created_at) : today;
      const daysSinceAdded = Math.floor(
        (today - addedDate) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceAdded > 2) longestSearching.push(animal);
      if (animal.species === "dog") dogs.push(animal);
      if (animal.species === "cat") cats.push(animal);
      if (animal.sterilized == true) sterilized.push(animal);
    });

    return { longestSearching, dogs, cats, sterilized };
  };

  const categories = categorizeAnimals(animals);

  return (
    <div className="animals-tab" style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 3 }}>
        <Breadcrumbs user={user} currentPageName="Lista zwierząt" />

        {isAdmin && (
          <button className="add-animal-btn" onClick={onAddClick}>
            ➕ Dodaj zwierzę
          </button>
        )}

        <p>Lista zwierząt</p>

        {loading && <p>Ładowanie...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <AnimalCategoryList
              animals={categories.longestSearching}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onApprove={approveAdoption}
              onLikeToggle={toggleLike}
              categoryKey="Szukają domu najdłużej"
              navigate={navigate}
            />
            <AnimalCategoryList
              animals={categories.dogs}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onApprove={approveAdoption}
              onLikeToggle={toggleLike}
              categoryKey="Psy"
              navigate={navigate}
            />
            <AnimalCategoryList
              animals={categories.cats}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onApprove={approveAdoption}
              onLikeToggle={toggleLike}
              categoryKey="Koty"
              navigate={navigate}
            />
            <AnimalCategoryList
              animals={categories.sterilized}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onApprove={approveAdoption}
              onLikeToggle={toggleLike}
              categoryKey="Sterylizacja/kastracja"
              navigate={navigate}
            />

            {isAdmin && archivedAnimals.length > 0 && (
              <AnimalCategoryList
                animals={archivedAnimals}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onApprove={approveAdoption}
                onLikeToggle={toggleLike}
                categoryKey="Archived"
                navigate={navigate}
              />
            )}
          </>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <AnimalFilters onFilterChange={setFilters} />
      </div>
    </div>
  );
});

export default AnimalsTab;
