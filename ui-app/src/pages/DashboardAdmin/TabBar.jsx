export default function TabBar({ activeTab, setActiveTab }) {
  return (
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
  );
}
