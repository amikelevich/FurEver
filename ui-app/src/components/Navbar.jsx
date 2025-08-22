import { Link, useNavigate } from "react-router-dom";
import "./../styles/Navbar.css";
import logoImage from "../assets/logo.png";
import NavbarLogo from "./NavbarLogo";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavbarLogo logoImage={logoImage} />
      </div>
      <div className="navbar-right">
        <button className="login-btn" onClick={() => navigate("/login")}>
          Zaloguj się
        </button>
        <button className="register-btn" onClick={() => navigate("/register")}>
          Zarejestruj się
        </button>
      </div>
    </nav>
  );
}
