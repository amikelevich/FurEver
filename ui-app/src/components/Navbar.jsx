import "./../styles/Navbar.css";
import logoImage from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logoImage} alt="Logo" className="logo-img" />
        <span className="navbar-title">FurEver</span>
      </div>
      <div className="navbar-right">
        <button className="login-btn">Zaloguj się</button>
        <button className="register-btn">Zarejestruj się</button>
      </div>
    </nav>
  );
}
