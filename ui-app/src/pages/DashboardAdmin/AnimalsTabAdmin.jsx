import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimalCategoryList from "../../components/AnimalCategoryList";
import useAnimals from "../../hooks/useAnimal";
import AnimalForm from "./AnimalForm";
import "../../styles/AnimalsTabAdmin.css";
import { FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../components/Breadcrumbs";

const AnimalsTabAdmin = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const filters = useMemo(() => ({}), []);
  const {
    animals,
    archivedAnimals,
    loading,
    error,
    approveAdoption,
    fetchAnimals,
    toggleLike,
    addAnimalManually,
    updateAnimalManually,
  } = useAnimals(filters);

  const [showForm, setShowForm] = useState(false);
  const [animalToEdit, setAnimalToEdit] = useState(null);

  let user = null;
  try {
    const storedUser = sessionStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Failed to parse user from sessionStorage", e);
  }
  useImperativeHandle(ref, () => ({
    refreshAnimals: () => fetchAnimals(),
  }));

  const handleShowAddForm = () => {
    setAnimalToEdit(null);
    setShowForm(true);
  };

  const handleStartEdit = (animal) => {
    setAnimalToEdit(animal);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setAnimalToEdit(null);
  };

  const handleAnimalAdded = (newAnimal) => {
    addAnimalManually(newAnimal);
  };

  const handleAnimalUpdated = (updatedAnimal) => {
    updateAnimalManually(updatedAnimal);
  };

  const uniqueAnimalsForAdmin = useMemo(
    () => Array.from(new Map(animals.map((a) => [a.id, a])).values()),
    [animals]
  );

  const categoriesConfig = [
    { key: "Aktualne zwierzęta", data: uniqueAnimalsForAdmin },
    { key: "Archiwalne zwierzęta", data: archivedAnimals },
  ];

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <div className="animals-tab-layout admin">
        <div className="main-content">
          <div className="content-header">
            <Breadcrumbs user={user} currentPageName="Zwierzęta w schronisku" />
            <button className="btn-primary" onClick={handleShowAddForm}>
              <FaPlus /> Dodaj podopiecznego
            </button>
          </div>
          {categoriesConfig.map(({ key, data }) => (
            <AnimalCategoryList
              key={key}
              animals={data}
              isAdmin={true}
              onEdit={handleStartEdit}
              onApprove={approveAdoption}
              onLikeToggle={toggleLike}
              categoryKey={key}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseForm}>
              &times;
            </button>
            <AnimalForm
              onClose={handleCloseForm}
              onAdded={handleAnimalAdded}
              animalToEdit={animalToEdit}
              onAnimalUpdated={handleAnimalUpdated}
            />
          </div>
        </div>
      )}
    </>
  );
});

export default AnimalsTabAdmin;
