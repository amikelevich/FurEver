import { useState } from "react";
import "../../styles/DashboardAdmin.css";
import TabBar from "./TabBar";
import AnimalsTab from "./AnimalsTab";
import ApplicationsTab from "./ApplicationsTab";
import AnimalForm from "./AnimalForm";
import Modal from "./Modal";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("animals");
  const [showForm, setShowForm] = useState(false);

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
            onAddClick={() => setShowForm(true)}
            isAdmin={true}
            onEdit={(animal) => console.log("Edit", animal)}
            onAdopt={(animal) => console.log("Adopt", animal)}
            onDetails={(animal) => console.log("Details", animal)}
          />
        ) : (
          <ApplicationsTab />
        )}
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <AnimalForm onClose={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
