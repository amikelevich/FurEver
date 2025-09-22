import { useEffect, useState } from "react";
import "./../styles/MyAdoptions.css";
import catShadow from "../assets/cat_shadow.png";
import Pagination from "../components/Pagination";

export default function MyAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState("approved");
  const [currentApprovedPage, setCurrentApprovedPage] = useState(1);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAdoptions([]);
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/my-adoptions/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAdoptions(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setAdoptions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie...</p>;
  if (!Array.isArray(adoptions) || adoptions.length === 0)
    return <p>Nie masz jeszcze żadnych adopcji</p>;

  const approvedAdoptions = adoptions.filter(
    (app) => app.decision === "approved"
  );
  const pendingAdoptions = adoptions.filter(
    (app) => app.decision !== "approved"
  );

  const paginate = (items, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const renderAdoption = (app) => {
    const animal = app.animal_info || {};
    const animalName = animal.name || "-";
    const animalAge = animal.age || "-";
    const animalBreed = animal.breed || "nieznana";
    const animalLocation = animal.location_display || "-";

    const status =
      app.decision === "approved"
        ? "Zatwierdzona"
        : app.decision === "pending"
        ? "W trakcie"
        : "Niezatwierdzona";

    return (
      <li key={app.id} className="adoption-item">
        <img
          src={animal.images?.[0]?.image || catShadow}
          alt={animalName}
          className="adoption-image"
        />
        <div className="adoption-info">
          <p>
            <strong>Imię:</strong> {animalName}
          </p>
          <p>
            <strong>Wiek:</strong> {animalAge}
          </p>
          <p>
            <strong>Rasa:</strong> {animalBreed}
          </p>
          <p>
            <strong>Lokalizacja:</strong> {animalLocation}
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>
        </div>
      </li>
    );
  };

  return (
    <div className="my-adoptions">
      <h2>Moje adopcje</h2>

      <div className="adoptions-dropdown">
        <button
          className={openSection === "approved" ? "active" : ""}
          onClick={() => setOpenSection("approved")}
        >
          Zatwierdzone
        </button>
        <button
          className={openSection === "pending" ? "active" : ""}
          onClick={() => setOpenSection("pending")}
        >
          Niezatwierdzone
        </button>
      </div>

      {openSection === "approved" && (
        <>
          {approvedAdoptions.length === 0 ? (
            <p>Brak zatwierdzonych adopcji</p>
          ) : (
            <>
              <ul>
                {paginate(approvedAdoptions, currentApprovedPage).map(
                  renderAdoption
                )}
              </ul>
              <Pagination
                currentPage={currentApprovedPage}
                totalPages={Math.ceil(
                  approvedAdoptions.length / ITEMS_PER_PAGE
                )}
                onPageChange={setCurrentApprovedPage}
              />
            </>
          )}
        </>
      )}
      {openSection === "pending" && (
        <>
          {pendingAdoptions.length === 0 ? (
            <p>Brak niezatwierdzonych adopcji</p>
          ) : (
            <>
              <ul>
                {paginate(pendingAdoptions, currentPendingPage).map(
                  renderAdoption
                )}
              </ul>
              <Pagination
                currentPage={currentPendingPage}
                totalPages={Math.ceil(pendingAdoptions.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPendingPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
