import { useEffect, useState } from "react";
import "../styles/AnimalFilters.css";
import {
  FaPaw,
  FaBirthdayCake,
  FaVenusMars,
  FaMapMarkerAlt,
  FaSmile,
  FaTag,
} from "react-icons/fa";

export default function AnimalFilters({ filters = {}, onFilterChange }) {
  const [breeds, setBreeds] = useState([]);

  const SPECIES_CHOICES = {
    dog: "Pies",
    cat: "Kot",
    rabbit: "Królik",
    hamster: "Chomik",
    bird: "Ptak",
    other: "Inne",
  };

  const GENDER_CHOICES = {
    male: "Samiec",
    female: "Samica",
    unknown: "Nieznany",
  };

  const LOCATION_CHOICES = {
    "shelter-Warsaw-Warszawska-15": "Schronisko w Warszawie",
    "shelter-Krakow-Warszawska-15": "Schronisko w Krakowie",
    "shelter-Poznan-Warszawska-15": "Schronisko w Poznaniu",
    "foster-home": "Dom tymczasowy",
  };

  const SHORT_TRAITS_CHOICES = {
    calm: "Spokojny",
    afraid_of_loud_sounds: "Boi się głośnych dźwięków",
    active: "Aktywny",
    likes_company: "Lubi towarzystwo",
    independent: "Niezależne",
  };

  const AGE_GROUPS = {
    young: "Młody (<2 lata)",
    adult: "Dorosły (2-7 lat)",
    senior: "Starszy (8+ lat)",
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/animals/");
        const data = await res.json();
        setBreeds([...new Set(data.map((a) => a.breed).filter(Boolean))]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const handleClick = (type, value) => {
    const newFilters = {
      ...filters,
      [type]: filters[type] === value ? null : value,
    };
    onFilterChange(newFilters);
  };

  const handleSelect = (type, value) => {
    const newFilters = { ...filters, [type]: value || null };
    onFilterChange(newFilters);
  };
  return (
    <div className="animal-filters">
      <h3>Filtry</h3>

      <div className="filter-group">
        <p>
          <FaPaw /> Gatunek:
        </p>
        <div className="buttons-wrapper">
          {Object.entries(SPECIES_CHOICES).map(([value, label]) => (
            <button
              key={value}
              className={filters.species === value ? "active" : ""}
              onClick={() => handleClick("species", value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <p>
          <FaBirthdayCake /> Wiek:
        </p>
        <div className="buttons-wrapper">
          {Object.entries(AGE_GROUPS).map(([value, label]) => (
            <button
              key={value}
              className={filters.age === value ? "active" : ""}
              onClick={() => handleClick("age", value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <p>
          <FaVenusMars /> Płeć:
        </p>
        <div className="buttons-wrapper">
          {Object.entries(GENDER_CHOICES).map(([value, label]) => (
            <button
              key={value}
              className={filters.gender === value ? "active" : ""}
              onClick={() => handleClick("gender", value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <p>
          <FaMapMarkerAlt /> Miasto:
        </p>
        <div className="select-wrapper">
          <select
            value={filters.location || ""}
            onChange={(e) => handleSelect("location", e.target.value)}
          >
            <option value="">-- wybierz --</option>
            {Object.entries(LOCATION_CHOICES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-group">
        <p>
          <FaSmile /> Temperament:
        </p>
        <div className="select-wrapper">
          <select
            value={filters.short_trait || ""}
            onChange={(e) => handleSelect("short_trait", e.target.value)}
          >
            <option value="">-- wybierz --</option>
            {Object.entries(SHORT_TRAITS_CHOICES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-group">
        <p>
          <FaTag /> Rasa:
        </p>
        <div className="select-wrapper">
          <select
            value={filters.breed || ""}
            onChange={(e) => handleSelect("breed", e.target.value)}
          >
            <option value="">-- wybierz --</option>
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
