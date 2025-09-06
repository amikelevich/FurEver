import { useState, useRef } from "react";
import TabBar from "./TabBar";
import AnimalsTab from "./AnimalsTab";
import ApplicationsTab from "./ApplicationsTab";
import AnimalForm from "./AnimalForm";
import "../../styles/DashboardAdmin.css";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("animals");
  const [showForm, setShowForm] = useState(false);
  const animalsTabRef = useRef(null);

  const handleEdit = (animal) => {
    console.log("Edit:", animal);
  };

  const handleAnimalAdded = () => {
    setShowForm(false);
    if (animalsTabRef.current) animalsTabRef.current.refreshAnimals();
  };

  return (
    <div className="admin-dashboard">
      <div className="header-space"></div>

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        className={`tab-content ${
          activeTab === "animals" ? "content-animals" : "content-applications"
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
        <AnimalForm
          onClose={() => setShowForm(false)}
          onAdded={handleAnimalAdded}
        />
      )}
    </div>
  );
}
