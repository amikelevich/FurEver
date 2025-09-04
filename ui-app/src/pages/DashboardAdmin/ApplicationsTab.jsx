import React, { useEffect, useState } from "react";
import "../../styles/ApplicationsTab.css";

export default function ApplicationsTab() {
  const [applications, setApplications] = useState([]);

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
      setApplications(data);
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
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Błąd podczas zatwierdzania wniosku");

      await fetchApplications();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="applications-container">
      <h2>Wnioski o adopcję</h2>
      {applications.length === 0 ? (
        <p>Brak wniosków</p>
      ) : (
        applications.map((app) => (
          <div className="application-item" key={app.id}>
            <strong>
              {app.user_first_name} {app.user_last_name}
            </strong>{" "}
            ({app.user_email}) <br />
            Zwierzak: {app.animal_name} ({app.animal_breed},{" "}
            {app.animal_location}) <br />
            Telefon: {app.phone_number} <br />
            Adres: {app.address} <br />
            Data złożenia: {new Date(app.submitted_at).toLocaleString()} <br />
            Decyzja: {app.decision || "oczekuje"} <br />
            {app.adoption_date && (
              <>
                Data adopcji: {new Date(app.adoption_date).toLocaleDateString()}
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
        ))
      )}
    </div>
  );
}
