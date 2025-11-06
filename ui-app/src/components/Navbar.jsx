import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./../styles/Navbar.css";
import logoImage from "../assets/logo.png";
import NavbarLogo from "./NavbarLogo";
import { FaSearch } from "react-icons/fa";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    onLogout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/animals/search?query=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavbarLogo logoImage={logoImage} />
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Szukaj zwierząt..."
                className="search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <FaSearch />
              </button>
            </form>

            {user.is_superuser ? (
              <div className="admin-nav-links">
                <button
                  onClick={handleLogoutClick}
                  className="logout-btn-inline"
                >
                  Wyloguj się
                </button>
              </div>
            ) : (
              <div className="dropdown">
                <button className="dropdown-btn">
                  Cześć, {user.first_name || "Użytkowniku"} ▼
                </button>
                <div className="dropdown-content">
                  <Link to="/favorites">Obserwowane zwierzęta</Link>
                  <Link to="/adoptions">Moje adopcje</Link>
                  <button onClick={handleLogoutClick} className="logout-btn">
                    Wyloguj się
                  </button>
                </div>
              </div>
            )}
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
