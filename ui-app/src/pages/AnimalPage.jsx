import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/AnimalPage.css";
import catShadow from "../assets/cat_shadow.png";
import AdoptionForm from "../components/AdoptionForm";
import QuestionForm from "../components/QuestionForm";
import Breadcrumbs from "../components/Breadcrumbs";

export default function AnimalPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

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

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="animal-page">
      <Breadcrumbs user={user} currentPageName={animal.name} />
      <h2>{animal.name}</h2>
      <p className="animal-age">{animal.age} lat</p>
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
              <strong>Płeć:</strong>{" "}
              {animal.gender === "male"
                ? "Samiec"
                : animal.gender === "female"
                ? "Samica"
                : animal.gender}
            </p>
            <p>
              <strong>Rasa:</strong> {animal.breed || "Brak danych"}
            </p>
            <p>
              <strong>Lokalizacja:</strong>{" "}
              {animal.location_display || "Brak danych"}
            </p>
            <p>
              <strong>Stosunek do ludzi:</strong>{" "}
              {animal.human_friendly_display || "Brak danych"}
            </p>
            <p>
              <strong>Stosunek do innych zwierząt:</strong>{" "}
              {animal.animal_friendly_display || "Brak danych"}
            </p>
            <p>
              <strong>Najlepszy dom:</strong>{" "}
              {animal.best_home_display || "Brak danych"}
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
              <strong>Stan zdrowia:</strong>{" "}
              {animal.health_status_display || "Brak danych"}
            </p>
            <p>
              <strong>Badania:</strong>{" "}
              {animal.examinations_display || "Brak danych"}
            </p>
            <p>
              <strong>Ostatnia wizyta u weterynarza:</strong>{" "}
              {animal.last_vet_visit || "Brak danych"}
            </p>
          </div>
        </div>

        <div className="animal-images-wrapper">
          {animal.images?.length > 0 ? (
            <div className="animal-images">
              {animal.images.slice(0, 3).map((img, index) => (
                <div
                  key={index}
                  className="animal-thumb"
                  style={{ zIndex: 3 - index }}
                  onClick={() => setShowGallery(true)}
                >
                  <img src={img.image} alt={`${animal.name} ${index + 1}`} />
                </div>
              ))}
              {animal.images.length > 1 && (
                <div
                  className="animal-thumb more"
                  onClick={() => setShowGallery(true)}
                  style={{ zIndex: 0 }}
                >
                  +{animal.images.length - 3}
                </div>
              )}
            </div>
          ) : (
            <img src={catShadow} alt="Kot" className="animal-thumb-single" />
          )}
        </div>
      </div>
      {showGallery && (
        <div className="gallery-modal" onClick={() => setShowGallery(false)}>
          <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-gallery"
              onClick={() => setShowGallery(false)}
            >
              &times;
            </button>

            <div className="gallery-images">
              {animal.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.image}
                  alt={`${animal.name} ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

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

          <button className="ask-btn" onClick={() => setShowQuestionForm(true)}>
            Zadaj pytanie
          </button>
          {showQuestionForm && animal.id && (
            <QuestionForm
              animalId={animal.id}
              onClose={() => setShowQuestionForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
