import { Link, useLocation } from "react-router-dom";

const routeNames = {
  register: "Rejestracja",
  login: "Logowanie",
  animals: "Zwierzęta",
  profile: "Profil",
  adoptions: "Adopcje",
  favorites: "Obserwowane zwierzęta",
};

export default function Breadcrumbs({
  user,
  currentPageName,
  previousPageName,
}) {
  const location = useLocation();
  const from = location.state?.from;
  const pathnames = location.pathname.split("/").filter((x) => x);

  const panelName = user?.is_admin
    ? "Panel administratora"
    : "Panel użytkownika";

  return (
    <nav className="breadcrumbs">
      <Link to={user?.is_admin ? "/dashboard_admin" : "/dashboard"}>
        {panelName}
      </Link>
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        let label = routeNames[value] || value;

        if (isLast && currentPageName) label = currentPageName;

        if (value === "animals") {
          if (from === "favorites") label = "Obserwowane zwierzęta";
          else if (from === "search") label = "Wyszukane zwierzęta";
          else if (previousPageName) label = previousPageName;
        }

        let to = `/${pathnames.slice(0, index + 1).join("/")}`;
        if (
          value === "animals" &&
          (from === "favorites" || from === "search")
        ) {
          to = from === "favorites" ? "/favorites" : "/animals/search";
        }

        return isLast ? (
          <span key={to}> / {label}</span>
        ) : (
          <span key={to}>
            {" / "}
            <Link to={to}>{label}</Link>
          </span>
        );
      })}
    </nav>
  );
}
