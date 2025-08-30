import { Link, useLocation, useNavigate } from "react-router-dom";
import "./../styles/Navbar.css";

export default function NavbarLogo({ logoImage }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    e.preventDefault();
    const user = JSON.parse(storedUser);

    if (user.is_superuser) {
      navigate("/dashboard_admin");
    } else {
      navigate("/dashboard");
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
