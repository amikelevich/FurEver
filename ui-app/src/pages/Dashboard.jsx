import "../styles/Dashboard.css";
import AnimalsTabUser from "../components/AnimalsTabUser";

export default function Dashboard() {
  return (
    <div>
      <AnimalsTabUser
        isAdmin={false}
        onDetails={(animal) => alert(`Szczegóły zwierzęcia: ${animal.name}`)}
      />
    </div>
  );
}
