import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./../styles/Navbar.css";
import logoImage from "../assets/logo.png";
import NavbarLogo from "./NavbarLogo";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      console.log("Znaleziono usera w localStorage:", JSON.parse(storedUser));
    }
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavbarLogo logoImage={logoImage} />
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <input
              type="text"
              placeholder="Szukaj zwierząt..."
              className="search-bar"
            />

            <div className="dropdown">
              <button className="dropdown-btn">
                Cześć, {user.first_name || "Użytkowniku"} ▼
              </button>
              <div className="dropdown-content">
                <Link to="/adoptions">Moje adopcje</Link>
                <Link to="/favorites">Obserwowane zwierzęta</Link>
                <button onClick={handleLogoutClick} className="logout-btn">
                  Wyloguj się
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>
              Zaloguj się
            </button>
            <button
              className="register-btn"
              onClick={() => navigate("/register")}
            >
              Zarejestruj się
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
