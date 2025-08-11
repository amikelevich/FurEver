import "./../styles/MainPage.css";
import { FaHome } from "react-icons/fa";
import dogImage from "../assets/dog.jpg";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

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
          <br /> Z FurEver pomagamy połączyć serca — na zawsze.
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

      <div className="image-content">
        <img src={dogImage} alt="Pies" className="dog-img" />
        <div className="home-icon">
          <FaHome />
          <span>Ostatnia adopcja</span>
        </div>
      </div>
    </main>
  );
}
