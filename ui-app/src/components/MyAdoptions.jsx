import { useEffect, useState } from "react";
import "./../styles/MyAdoptions.css";
import catShadow from "../assets/cat_shadow.png";

export default function MyAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/my-adoptions/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAdoptions(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div className="my-adoptions">
      <h2>Moje adopcje</h2>
      {adoptions.length === 0 ? (
        <p>Nie masz jeszcze żadnych adopcji</p>
      ) : (
        <ul>
          {adoptions.map((app) => {
            const animal = app.animal;
            const status = animal.adoption_date
              ? "Zaadoptowana"
              : app.decision === "pending"
              ? "W trakcie"
              : app.decision || "Nieznany";

            return (
              <li key={app.id} className="adoption-item">
                <img
                  src={animal.images?.[0]?.image || catShadow}
                  alt={animal.name}
                  className="adoption-image"
                />
                <div className="adoption-info">
                  <p>
                    <strong>Imię:</strong> {animal.name}
                  </p>
                  <p>
                    <strong>Wiek:</strong> {animal.age}
                  </p>
                  <p>
                    <strong>Rasa:</strong> {animal.breed}
                  </p>
                  <p>
                    <strong>Lokalizacja:</strong> {animal.location}
                  </p>
                  <p>
                    <strong>Status:</strong> {status}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
