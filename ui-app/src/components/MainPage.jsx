import "./../styles/MainPage.css";
import { FaHome } from "react-icons/fa";
import dogImage from "../assets/dog.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const [lastAdoptionImage, setLastAdoptionImage] = useState(dogImage);

  useEffect(() => {
    const fetchLastAdoption = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/adoption-applications/public_last_adoptions/"
        );

        if (!res.ok) {
          console.warn("Nie udało się pobrać ostatniej adopcji:", res.status);
          return;
        }

        const data = await res.json();

        const adoptionWithImage = Array.isArray(data)
          ? data.find((app) => app.animal_info?.images?.length)
          : null;

        if (adoptionWithImage) {
          setLastAdoptionImage(adoptionWithImage.animal_info.images[0].image);
        }
      } catch (err) {
        console.error("Błąd przy pobieraniu ostatniej adopcji:", err);
      }
    };

    fetchLastAdoption();
  }, []);

  return (
    <main className="main-section">
      <div className="text-content">
        <h1 className="hero-title">
          FurEver - adopcja, <br />
          <span className="highlight-green">która zostaje</span>{" "}
          <span className="highlight-orange">na zawsze</span>
        </h1>

        <p className="hero-desc">
          Każde zwierzę ma historię. A Ty możesz być jej nowym rozdziałem.{" "}
          <br />Z FurEver pomagamy połączyć serca — na zawsze.
        </p>

        <div className="buttons">
          <button className="primary-btn" onClick={() => navigate("/register")}>
            Utwórz konto
          </button>
          <button
            className="secondary-btn"
            onClick={() => {
              document
                .getElementById("steps")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Zobacz jak to działa
          </button>
        </div>
      </div>

      <div className="image-wrapper">
        <div className="image-content">
          <img
            src={lastAdoptionImage}
            alt="Ostatnia adopcja"
            className="dog-img"
          />
          <div className="home-icon">
            <FaHome />
            <span>Ostatnia adopcja</span>
          </div>
        </div>
      </div>
    </main>
  );
}
