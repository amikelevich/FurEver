import { Link, useLocation } from "react-router-dom";
import "./../styles/Navbar.css";

export default function NavbarLogo({ logoImage }) {
  const location = useLocation();

  const handleClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      to="/"
      className="navbar-logo-link"
      style={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
      }}
      onClick={handleClick}
    >
      <img src={logoImage} alt="Logo" className="logo-img" />
      <span className="navbar-title">FurEver</span>
    </Link>
  );
}
