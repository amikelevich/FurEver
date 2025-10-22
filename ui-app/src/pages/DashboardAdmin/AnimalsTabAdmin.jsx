import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimalCategoryList from "../../components/AnimalCategoryList";
import useAnimals from "../../hooks/useAnimal";
import Breadcrumbs from "../../components/Breadcrumbs";
import AnimalForm from "./AnimalForm";
import "../../styles/AnimalsTabAdmin.css";
import { FaPlus } from "react-icons/fa";

const AnimalsTabAdmin = forwardRef(({ onEdit }, ref) => {
  const navigate = useNavigate();
  const {
    animals,
    archivedAnimals,
    loading,
    error,
    filters,
    approveAdoption,
    fetchAnimals,
    toggleLike,
  } = useAnimals();

  const [showForm, setShowForm] = useState(false);

  let user = null;
  try {
    const storedUser = sessionStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Failed to parse user from sessionStorage", e);
  }

  useImperativeHandle(ref, () => ({
    refreshAnimals: () => fetchAnimals(filters),
  }));

  const handleAnimalAdded = () => {
    setShowForm(false);
    fetchAnimals(filters);
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
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <FaPlus /> Dodaj podopiecznego
            </button>
          </div>

          {categoriesConfig.map(({ key, data }) => (
            <AnimalCategoryList
              key={key}
              animals={data}
              isAdmin={true}
              onEdit={onEdit}
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
            <button className="close-btn" onClick={() => setShowForm(false)}>
              &times;
            </button>
            <AnimalForm
              onClose={() => setShowForm(false)}
              onAdded={handleAnimalAdded}
            />
          </div>
        </div>
      )}
    </>
  );
});

export default AnimalsTabAdmin;
