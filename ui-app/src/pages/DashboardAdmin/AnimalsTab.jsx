import { forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import AnimalFilters from "../../components/AnimalFilters";
import Breadcrumbs from "../../components/Breadcrumbs";
import AnimalCategoryList from "../../components/AnimalCategoryList";
import useAnimals from "../../hooks/useAnimal";
import "../../styles/AnimalsTab.css";

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
    fetchAnimals,
  } = useAnimals();

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useImperativeHandle(ref, () => ({
    refreshAnimals: () => fetchAnimals(filters),
  }));

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
      if (animal.sterilized) sterilized.push(animal);
    });

    return { longestSearching, dogs, cats, sterilized };
  };

  const categories = categorizeAnimals(animals);

  const onLikeToggle = async (animalId, liked) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Brak tokenu. Zaloguj się, aby polubić.");

      const url = `http://localhost:8000/api/animals/${animalId}/${
        liked ? "like" : "unlike"
      }/`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Błąd przy polubieniu zwierzęcia");
      }

      fetchAnimals(filters);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const currentAnimalsForAdmin = [
    ...categories.longestSearching,
    ...categories.dogs,
    ...categories.cats,
    ...categories.sterilized,
  ];

  const uniqueAnimalsForAdmin = Array.from(
    new Map(currentAnimalsForAdmin.map((a) => [a.id, a])).values()
  );

  return (
    <div className={`animals-tab ${isAdmin ? "admin" : "user"}`}>
      <div className={`main-content ${isAdmin ? "admin" : "user"}`}>
        <Breadcrumbs user={user} currentPageName="Lista zwierząt" />

        {isAdmin && (
          <button className="add-animal-btn" onClick={onAddClick}>
            Dodaj nowego podopiecznego
          </button>
        )}

        {loading && <p>Ładowanie...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            {isAdmin ? (
              <>
                <AnimalCategoryList
                  animals={uniqueAnimalsForAdmin}
                  isAdmin={isAdmin}
                  onEdit={onEdit}
                  onApprove={approveAdoption}
                  onLikeToggle={onLikeToggle}
                  categoryKey="Aktualne zwierzęta"
                  navigate={navigate}
                />
                {archivedAnimals.length > 0 && (
                  <AnimalCategoryList
                    animals={archivedAnimals}
                    isAdmin={isAdmin}
                    onEdit={onEdit}
                    onApprove={approveAdoption}
                    onLikeToggle={onLikeToggle}
                    categoryKey="Archiwalne zwierzęta"
                    navigate={navigate}
                  />
                )}
              </>
            ) : (
              <>
                <AnimalCategoryList
                  animals={categories.longestSearching}
                  isAdmin={isAdmin}
                  onEdit={onEdit}
                  onApprove={approveAdoption}
                  onLikeToggle={onLikeToggle}
                  categoryKey="Szukają domu najdłużej"
                  navigate={navigate}
                />
                <AnimalCategoryList
                  animals={categories.dogs}
                  isAdmin={isAdmin}
                  onEdit={onEdit}
                  onApprove={approveAdoption}
                  onLikeToggle={onLikeToggle}
                  categoryKey="Psy"
                  navigate={navigate}
                />
                <AnimalCategoryList
                  animals={categories.cats}
                  isAdmin={isAdmin}
                  onEdit={onEdit}
                  onApprove={approveAdoption}
                  onLikeToggle={onLikeToggle}
                  categoryKey="Koty"
                  navigate={navigate}
                />
                <AnimalCategoryList
                  animals={categories.sterilized}
                  isAdmin={isAdmin}
                  onEdit={onEdit}
                  onApprove={approveAdoption}
                  onLikeToggle={onLikeToggle}
                  categoryKey="Sterylizacja/kastracja"
                  navigate={navigate}
                />
              </>
            )}
          </>
        )}
      </div>
      {!user.is_superuser && (
        <div style={{ flex: 1 }}>
          <AnimalFilters onFilterChange={setFilters} />
        </div>
      )}
    </div>
  );
});

export default AnimalsTab;
