import { useState, useRef } from "react";
import TabBar from "./TabBar";
import AnimalsTab from "./AnimalsTab";
import ApplicationsTab from "./ApplicationsTab";
import AnimalForm from "./AnimalForm";
import useAnimals from "../../hooks/useAnimal";
import "../../styles/DashboardAdmin.css";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("animals");
  const [showForm, setShowForm] = useState(false);
  const animalsTabRef = useRef(null);
  const { fetchAnimals } = useAnimals();

  const handleEdit = (animal) => {
    console.log("Edytuj zwierzę:", animal);
  };

  const handleAnimalAdded = () => {
    setShowForm(false);
    fetchAnimals();
  };

  return (
    <div className="admin-dashboard">
      <div className="header-space" />

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div
        className={`tab-content ${
          activeTab === "animals" ? "animals" : "applications"
        }`}
      >
        {activeTab === "animals" ? (
          <AnimalsTab
            ref={animalsTabRef}
            onAddClick={() => setShowForm(true)}
            isAdmin={true}
            onEdit={handleEdit}
          />
        ) : (
          <ApplicationsTab />
        )}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-overlay"></div>
          <div className="modal-content">
            <button className="close-btn">×</button>
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
