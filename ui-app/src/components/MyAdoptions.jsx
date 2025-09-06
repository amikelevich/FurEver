import { useEffect, useState } from "react";
import "./../styles/MyAdoptions.css";
import catShadow from "../assets/cat_shadow.png";

export default function MyAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAdoptions([]);
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/my-adoptions/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAdoptions(data || []))
      .catch((err) => {
        console.error(err);
        setAdoptions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie...</p>;

  if (adoptions.length === 0) return <p>Nie masz jeszcze żadnych adopcji</p>;

  return (
    <div className="my-adoptions">
      <h2>Moje adopcje</h2>
      <ul>
        {adoptions.map((app) => {
          const animal = app.animal || {};
          const animalName = animal.name || "-";
          const animalAge = animal.age || "-";
          const animalBreed = animal.breed || "-";
          const animalLocation = animal.location || "-";

          const status = animal.adoption_date
            ? "Zaadoptowana"
            : app.decision === "pending"
            ? "W trakcie"
            : app.decision || "Nieznany";

          return (
            <li key={app.id} className="adoption-item">
              <img
                src={animal.images?.[0]?.image || catShadow}
                alt={animalName}
                className="adoption-image"
              />
              <div className="adoption-info">
                <p>
                  <strong>Imię:</strong> {animalName}
                </p>
                <p>
                  <strong>Wiek:</strong> {animalAge}
                </p>
                <p>
                  <strong>Rasa:</strong> {animalBreed}
                </p>
                <p>
                  <strong>Lokalizacja:</strong> {animalLocation}
                </p>
                <p>
                  <strong>Status:</strong> {status}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
