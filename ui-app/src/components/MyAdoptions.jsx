import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./../styles/MyAdoptions.css";
import catShadow from "../assets/cat_shadow.png";
import Pagination from "../components/Pagination";
import { FaPaw } from "react-icons/fa";

const AdoptionItem = ({ adoption }) => {
  const animal = adoption.animal_info || {};
  const animalName = animal.name || "Brak danych";

  const statusMap = {
    approved: "Zatwierdzona",
    pending: "W trakcie",
    rejected: "Odrzucona",
  };
  const status = statusMap[adoption.decision] || "Nieznany";

  return (
    <li className="adoption-item">
      <img
        src={animal.images?.[0]?.image || catShadow}
        alt={animalName}
        className="adoption-image"
      />
      <div className="adoption-info">
        <h4>{animalName}</h4>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Złożono wniosek:</strong>{" "}
          {new Date(adoption.application_date).toLocaleDateString()}
        </p>
      </div>
      <div className="adoption-actions">
        <Link to={`/animals/${animal.id}`} className="view-profile-link">
          Zobacz profil
        </Link>
      </div>
    </li>
  );
};

export default function MyAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState("approved");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/my-adoptions/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setAdoptions(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setAdoptions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [openSection]);

  const approvedAdoptions = useMemo(
    () => adoptions.filter((app) => app.decision === "approved"),
    [adoptions]
  );
  const pendingAdoptions = useMemo(
    () => adoptions.filter((app) => app.decision !== "approved"),
    [adoptions]
  );

  const activeAdoptions =
    openSection === "approved" ? approvedAdoptions : pendingAdoptions;
  const paginatedAdoptions = activeAdoptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(activeAdoptions.length / ITEMS_PER_PAGE);

  if (loading) return <p>Ładowanie...</p>;

  if (!Array.isArray(adoptions) || adoptions.length === 0) {
    return (
      <div className="empty-state">
        <FaPaw />
        <h3>Nie masz jeszcze żadnych adopcji</h3>
        <p>Gdy złożysz wniosek adopcyjny, pojawi się on w tym miejscu.</p>
        <Link to="/animals" className="cta-button">
          Przeglądaj zwierzęta
        </Link>
      </div>
    );
  }

  return (
    <div className="my-adoptions">
      <div className="adoption-tabs">
        <button
          className={openSection === "approved" ? "active" : ""}
          onClick={() => setOpenSection("approved")}
        >
          Zatwierdzone ({approvedAdoptions.length})
        </button>
        <button
          className={openSection === "pending" ? "active" : ""}
          onClick={() => setOpenSection("pending")}
        >
          W trakcie ({pendingAdoptions.length})
        </button>
      </div>

      {paginatedAdoptions.length > 0 ? (
        <>
          <ul className="adoption-list">
            {paginatedAdoptions.map((adoption) => (
              <AdoptionItem key={adoption.id} adoption={adoption} />
            ))}
          </ul>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <p>Brak adopcji w tej kategorii.</p>
      )}
    </div>
  );
}
