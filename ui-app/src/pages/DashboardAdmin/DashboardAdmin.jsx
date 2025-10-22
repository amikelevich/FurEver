import { useState } from "react";
import AnimalsTabAdmin from "./AnimalsTabAdmin";
import ApplicationsTab from "./ApplicationsTab";
import AnimalForm from "./AnimalForm";
import useAnimals from "../../hooks/useAnimal";
import "../../styles/DashboardAdmin.css";
import { FaPaw, FaFileAlt, FaPlus } from "react-icons/fa";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("animals");
  const [showForm, setShowForm] = useState(false);
  const { fetchAnimals } = useAnimals();

  const handleAnimalAdded = () => {
    setShowForm(false);
    fetchAnimals();
  };

  const PageTitle = {
    animals: "Zwierzęta",
    applications: "Wnioski Adopcyjne",
  };

  return (
    <div className="admin-dashboard">
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-header">
            <h1>Panel Admina</h1>
          </div>
          <nav className="sidebar-nav">
            <button
              className={`nav-link ${activeTab === "animals" ? "active" : ""}`}
              onClick={() => setActiveTab("animals")}
            >
              <FaPaw /> Zwierzęta
            </button>
            <button
              className={`nav-link ${
                activeTab === "applications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("applications")}
            >
              <FaFileAlt /> Wnioski
            </button>
          </nav>
        </div>
      </aside>

      <main className="dashboard-content">
        {activeTab === "animals" ? (
          <AnimalsTabAdmin isAdmin={true} />
        ) : (
          <ApplicationsTab />
        )}
      </main>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              &times;
            </button>
            <AnimalForm
              onClose={() => setShowForm(false)}
              onAdded={handleAnimalAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
}
