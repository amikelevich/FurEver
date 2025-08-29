import { useState } from "react";
import "../styles/DashboardAdmin.css";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("animals");

  return (
    <div className="admin-dashboard">
      <div className="header-space"></div>
      <div className="tab-bar">
        <div
          className={`tab tab-animals ${
            activeTab === "animals" ? "active-animals" : ""
          }`}
          onClick={() => setActiveTab("animals")}
        >
          Zwierzęta
        </div>
        <div
          className={`tab tab-applications ${
            activeTab === "applications" ? "active-applications" : ""
          }`}
          onClick={() => setActiveTab("applications")}
        >
          Adopcje
        </div>
      </div>
      <div
        className={`tab-content ${
          activeTab === "animals" ? "content-animals" : "content-applications"
        }`}
      >
        {activeTab === "animals" ? (
          <p>Lista zwierząt</p>
        ) : (
          <p>Wnioski o adopcję</p>
        )}
      </div>
    </div>
  );
}
