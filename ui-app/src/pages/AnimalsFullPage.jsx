import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AnimalCard from "../components/AnimalCard";
import AnimalFilters from "../components/AnimalFilters";
import Breadcrumbs from "../components/Breadcrumbs";
import Pagination from "../components/Pagination";
import "../styles/AnimalsFullPage.css";

export default function AnimalsFullPage({ onEdit }) {
  const location = useLocation();
  const initialAnimals = location.state?.animals || [];
  const categoryKey = location.state?.categoryKey || "all";

  const [filters, setFilters] = useState({});
  const [filteredAnimals, setFilteredAnimals] = useState(initialAnimals);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = !!user?.is_superuser;

  const CATEGORY_LABELS = {
    archived: "Archiwalne zwierzęta",
    all: "Wszystkie zwierzęta",
    longest_home: "Szukają domu najdłużej",
    dogs: "Psy",
    cats: "Koty",
    sterilized: "Sterylizacja/kastracja",
  };

  const SHORT_TRAITS_CHOICES = {
    calm: "Spokojny",
    afraid_of_loud_sounds: "Boi się głośnych dźwięków",
    active: "Aktywny",
    likes_company: "Lubi towarzystwo",
    independent: "Niezależne",
  };

  useEffect(() => {
    let result = [...initialAnimals];

    if (filters.species) {
      result = result.filter(
        (a) => a.species?.toLowerCase() === filters.species.toLowerCase()
      );
    }

    if (filters.age) {
      result = result.filter((a) => {
        const age = Number(a.age) || 0;
        if (filters.age === "young") return age < 2;
        if (filters.age === "adult") return age >= 2 && age <= 7;
        if (filters.age === "senior") return age >= 8;
        return true;
      });
    }

    if (filters.gender) {
      result = result.filter(
        (a) => a.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.location) {
      result = result.filter(
        (a) => a.location?.toLowerCase() === filters.location.toLowerCase()
      );
    }

    if (filters.short_trait) {
      result = result.filter(
        (a) =>
          Array.isArray(a.short_traits_display) &&
          a.short_traits_display.some(
            (t) =>
              t.toLowerCase() ===
              SHORT_TRAITS_CHOICES[filters.short_trait].toLowerCase()
          )
      );
    }

    if (filters.breed) {
      result = result.filter(
        (a) => a.breed?.toLowerCase() === filters.breed.toLowerCase()
      );
    }

    setFilteredAnimals(result);
    setCurrentPage(1);
  }, [filters, initialAnimals]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnimals = filteredAnimals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="animals-full-page">
      <Breadcrumbs
        user={user}
        currentPageName={CATEGORY_LABELS[categoryKey] || categoryKey}
      />

      <h2 className="category-name-full-page">
        {CATEGORY_LABELS[categoryKey] || categoryKey}
      </h2>

      <div className="content-wrapper">
        <div className="filters">
          <AnimalFilters onFilterChange={setFilters} />
        </div>

        <div className="animal-list-wrapper">
          <div className="animal-list-inner">
            {filteredAnimals.length > 0 ? (
              paginatedAnimals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  isAdmin={isAdmin}
                  onEdit={onEdit || (() => {})}
                  onLikeToggle={() => {}}
                  isLiked={!!animal.is_liked}
                  source="animals-full"
                />
              ))
            ) : (
              <p>Brak zwierząt</p>
            )}
          </div>

          {filteredAnimals.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredAnimals.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
