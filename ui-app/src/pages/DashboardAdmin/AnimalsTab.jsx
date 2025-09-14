import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import AnimalCard from "../../components/AnimalCard";
import AnimalFilters from "../../components/AnimalFilters";
import "../../styles/AnimalCard.css";
import Breadcrumbs from "../../components/Breadcrumbs";
import useAnimals from "../../hooks/useAnimal";
import AnimalCategoryList from "../../components/AnimalCategoryList";

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

  return (
    <div className="animals-tab" style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 3 }}>
        <Breadcrumbs user={user} currentPageName="Lista zwierząt" />
        {isAdmin && <button onClick={onAddClick}>➕ Dodaj zwierzę</button>}
        <p>Lista zwierząt</p>
        {loading && <p>Ładowanie...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <AnimalCategoryList
              animals={animals}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onApprove={approveAdoption}
              onLikeToggle={toggleLike}
              categoryKey="Active"
              navigate={navigate}
            />
            {isAdmin && (
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
