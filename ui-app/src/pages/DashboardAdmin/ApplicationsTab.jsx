import React, { useEffect, useState } from "react";
import "../../styles/ApplicationsTab.css";
import Pagination from "../../components/Pagination";

export default function ApplicationsTab() {
  const [applications, setApplications] = useState([]);
  const [archivedApplications, setArchivedApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentArchivedPage, setCurrentArchivedPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:8000/api/adoption-applications/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Błąd podczas pobierania wniosków");

      const data = await res.json();
      const today = new Date();
      const current = [];
      const archived = [];

      data.forEach((app) => {
        const adoptionDate = app.adoption_date
          ? new Date(app.adoption_date)
          : null;
        if (adoptionDate && adoptionDate < today) {
          archived.push(app);
        } else {
          current.push(app);
        }
      });

      setApplications(current);
      setArchivedApplications(archived);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const approveApplication = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/api/adoption-applications/${id}/approve/`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Błąd podczas zatwierdzania wniosku");

      alert(data.success || "Wniosek zatwierdzony!");
      await fetchApplications();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const renderApplication = (app) => (
    <div className="application-item" key={app.id}>
      <strong>
        {app.user_first_name} {app.user_last_name}
      </strong>{" "}
      ({app.user_email}) <br />
      Zwierzak: {app.animal_name} ({app.animal_breed}, {app.animal_location}){" "}
      <br />
      Telefon: {app.phone_number} <br />
      Adres: {app.address} <br />
      Data złożenia: {new Date(app.submitted_at).toLocaleString()} <br />
      Decyzja: {app.decision || "oczekuje"} <br />
      {app.adoption_date && (
        <>
          Data adopcji: {new Date(app.adoption_date).toLocaleDateString()}{" "}
          <br />
        </>
      )}
      {app.decision === "approved" && (
        <p className="approved-message">Wniosek został zatwierdzony</p>
      )}
      {app.decision === "pending" && (
        <button
          className="approve-btn"
          onClick={() => approveApplication(app.id)}
        >
          Zatwierdź
        </button>
      )}
      <hr />
    </div>
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedApplications = applications.slice(startIndex, endIndex);

  const archivedStartIndex = (currentArchivedPage - 1) * ITEMS_PER_PAGE;
  const archivedEndIndex = archivedStartIndex + ITEMS_PER_PAGE;
  const paginatedArchivedApplications = archivedApplications.slice(
    archivedStartIndex,
    archivedEndIndex
  );

  return (
    <div className="applications-container">
      <h2>Wnioski o adopcję</h2>

      <h3>Aktualne wnioski</h3>
      {applications.length === 0 ? (
        <p>Brak wniosków</p>
      ) : (
        <>
          {paginatedApplications.map(renderApplication)}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(applications.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {archivedApplications.length > 0 && (
        <>
          <h3>Archiwalne wnioski</h3>
          {paginatedArchivedApplications.map(renderApplication)}
          <Pagination
            currentPage={currentArchivedPage}
            totalPages={Math.ceil(archivedApplications.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentArchivedPage}
          />
        </>
      )}
    </div>
  );
}
