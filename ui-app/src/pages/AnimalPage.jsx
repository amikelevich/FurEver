import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/AnimalPage.css";
import catShadow from "../assets/cat_shadow.png";
import AdoptionForm from "../components/AdoptionForm";

export default function AnimalPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/animals/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setAnimal(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd przy pobieraniu zwierzaka:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Ładowanie...</p>;
  if (!animal) return <p>Nie znaleziono zwierzaka</p>;

  return (
    <div className="animal-page">
      <h2>{animal.name}</h2>
      <p className="animal-age">Wiek: {animal.age}</p>
      <div className="animal-traits">
        {animal.short_traits_display?.map((trait) => (
          <span key={trait} className="trait-badge">
            {trait}
          </span>
        ))}
      </div>

      <div className="animal-content">
        <div className="animal-boxes">
          <div className="animal-box">
            <h3>Opis</h3>
            <p>{animal.description || "Brak opisu"}</p>
          </div>

          <div className="animal-box">
            <h3>Informacje ogólne</h3>
            <p>
              <strong>Płeć:</strong> {animal.gender}
            </p>
            <p>
              <strong>Rasa:</strong> {animal.breed}
            </p>
            <p>
              <strong>Lokalizacja:</strong> {animal.location}
            </p>
            <p>
              <strong>Stosunek do ludzi:</strong> {animal.human_friendly}
            </p>
            <p>
              <strong>Stosunek do innych zwierząt:</strong>{" "}
              {animal.animal_friendly}
            </p>
            <p>
              <strong>Najlepszy dom:</strong> {animal.best_home}
            </p>
          </div>

          <div className="animal-box">
            <h3>Informacje medyczne</h3>
            <p>
              <strong>Sterylizacja/kastracja:</strong>{" "}
              {animal.sterilized ? "Tak" : "Nie"}
            </p>
            <p>
              <strong>Szczepienia:</strong> {animal.vaccinated ? "Tak" : "Nie"}
            </p>
            <p>
              <strong>Odrobaczenie:</strong> {animal.dewormed ? "Tak" : "Nie"}
            </p>
            <p>
              <strong>Mikroczip:</strong> {animal.chipped ? "Tak" : "Nie"}
            </p>
            <p>
              <strong>Stan zdrowia:</strong> {animal.health_status}
            </p>
            <p>
              <strong>Badania:</strong> {animal.examinations}
            </p>
            <p>
              <strong>Ostatnia wizyta u weterynarza:</strong>{" "}
              {animal.last_vet_visit || "Brak danych"}
            </p>
          </div>
        </div>

        <div className="animal-images">
          {animal.images?.length > 0 ? (
            animal.images.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt={`${animal.name} ${index + 1}`}
              />
            ))
          ) : (
            <img src={catShadow} alt="Kot" />
          )}
        </div>
      </div>

      <div className="animal-actions">
        <p>Zainteresowany?</p>
        <div className="buttons">
          {animal.adoption_date ? (
            <span className="already-adopted">Zaadoptowany</span>
          ) : (
            <button className="adopt-btn" onClick={() => setShowForm(true)}>
              Zgłoś chęć adopcji
            </button>
          )}
          {showForm && animal.id && (
            <AdoptionForm
              animalId={animal.id}
              onClose={() => setShowForm(false)}
            />
          )}
          <button className="ask-btn">Zadaj pytanie</button>
        </div>
      </div>
    </div>
  );
}
