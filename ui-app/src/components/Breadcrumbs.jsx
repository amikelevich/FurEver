import { Link, useLocation } from "react-router-dom";

const routeNames = {
  register: "Rejestracja",
  login: "Logowanie",
  animals: "Zwierzęta",
  profile: "Profil",
  adoptions: "Adopcje",
  favorites: "Obserwowane zwierzęta",
};

export default function Breadcrumbs({ user, currentPageName }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const panelName = user?.is_superuser
    ? "Panel administratora"
    : "Panel użytkownika";
  const panelLink = user?.is_superuser ? "/dashboard_admin" : "/dashboard";

  return (
    <nav className="breadcrumbs">
      <Link to={panelLink}>{panelName}</Link>
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        let label = routeNames[value] || value;

        let to;
        if (value === "animals") {
          to = user?.is_superuser ? "/dashboard_admin" : "/animals";
        } else {
          to = `/${pathnames.slice(0, index + 1).join("/")}`;
        }

        if (isLast) {
          if (currentPageName) label = currentPageName;
          return <span key={to}> / {label}</span>;
        }

        return (
          <span key={to}>
            {" / "}
            <Link to={to}>{label}</Link>
          </span>
        );
      })}
    </nav>
  );
}
