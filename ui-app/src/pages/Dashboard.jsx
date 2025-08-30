import "../styles/Dashboard.css";
import AnimalsTab from "./DashboardAdmin/AnimalsTab";

export default function Dashboard() {
  return (
    <div>
      <AnimalsTab
        isAdmin={false}
        onDetails={(animal) => alert(`Szczegóły zwierzęcia: ${animal.name}`)}
      />
      <p>Tu będą Twoje filtry.</p>
    </div>
  );
}
