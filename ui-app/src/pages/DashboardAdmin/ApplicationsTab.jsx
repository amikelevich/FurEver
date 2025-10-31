import React, { useEffect, useState, useMemo } from "react";
import "../../styles/ApplicationsTab.css";
import Pagination from "../../components/Pagination";
import Breadcrumbs from "../../components/Breadcrumbs";
import Toast from "../../components/Toast";
import { FaInbox } from "react-icons/fa";

const ApplicationItem = ({ application, onApprove, onReject }) => {
  const {
    id,
    user_first_name,
    user_last_name,
    user_email,
    phone_number,
    address,
    animal_name,
    submitted_at,
    decision,
  } = application;

  const statusMap = {
    approved: "Zatwierdzony",
    pending: "Oczekujący",
    rejected: "Odrzucony",
  };
  const status = statusMap[decision] || "Nieznany";

  return (
    <div className="application-item">
      <div className="item-header">
        <h4>
          {user_first_name} {user_last_name}
        </h4>
        <span className={`status-badge ${decision}`}>{status}</span>
      </div>
      <div className="item-details">
        <p>
          <strong>Zwierzę:</strong> {animal_name}
        </p>
        <p>
          <strong>Email:</strong> {user_email}
        </p>
        <p>
          <strong>Telefon:</strong> {phone_number}
        </p>
        <p>
          <strong>Adres:</strong> {address}
        </p>
        <p>
          <strong>Złożono:</strong> {new Date(submitted_at).toLocaleString()}
        </p>
      </div>
      {decision === "pending" && (
        <div className="item-actions">
          <button className="approve-btn" onClick={() => onApprove(id)}>
            Zatwierdź wniosek
          </button>
        </div>
      )}
    </div>
  );
};

export default function ApplicationsTab() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState("current");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
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
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // --- POCZĄTEK ZMIAN ---
  const approveApplication = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/api/adoption-applications/${id}/approve/`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Błąd podczas zatwierdzania wniosku");
      }

      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === id ? { ...app, decision: "approved" } : app
        )
      );

      setToast({
        message: data.success || "Wniosek zatwierdzony!",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({ message: err.message, type: "error" });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [openSection]);

  const { currentApps, archivedApps } = useMemo(() => {
    const current = [],
      archived = [];
    const today = new Date();
    applications.forEach((app) => {
      const adoptionDate = app.adoption_date
        ? new Date(app.adoption_date)
        : null;
      if (adoptionDate && adoptionDate < today) {
        archived.push(app);
      } else {
        current.push(app);
      }
    });
    return { currentApps: current, archivedApps: archived };
  }, [applications]);

  const activeList = openSection === "current" ? currentApps : archivedApps;
  const paginatedList = activeList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(activeList.length / ITEMS_PER_PAGE);

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="applications-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
      <Breadcrumbs user={user} currentPageName="Wnioski o adopcje" />
      <h2>Wnioski o adopcję</h2>

      <div className="application-tabs">
        <button
          className={openSection === "current" ? "active" : ""}
          onClick={() => setOpenSection("current")}
        >
          Aktualne ({currentApps.length})
        </button>
        <button
          className={openSection === "archived" ? "active" : ""}
          onClick={() => setOpenSection("archived")}
        >
          Archiwalne ({archivedApps.length})
        </button>
      </div>

      <div className="applications-content">
        {loading ? (
          <p>Ładowanie...</p>
        ) : paginatedList.length > 0 ? (
          <>
            <div className="applications-grid">
              {paginatedList.map((app) => (
                <ApplicationItem
                  key={app.id}
                  application={app}
                  onApprove={approveApplication}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="empty-state">
            <FaInbox />
            <h3>Brak wniosków w tej kategorii</h3>
            <p>Gdy pojawią się nowe wnioski, znajdziesz je tutaj.</p>
          </div>
        )}
      </div>
    </div>
  );
}
