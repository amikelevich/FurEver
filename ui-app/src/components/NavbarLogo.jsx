import { Link, useLocation, useNavigate } from "react-router-dom";
import "./../styles/Navbar.css";

export default function NavbarLogo({ logoImage }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        navigate("/main");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        e.preventDefault();
        navigate("/main");
      }
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
