import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/MainPage";
import Steps from "./components/Steps";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";
import AnimalsTab from "./pages/DashboardAdmin/AnimalsTab";
import AnimalPage from "./pages/AnimalPage";
import MyAdoptions from "./components/MyAdoptions";
import FavoritesTab from "./components/FavoritesTab";
import Breadcrumbs from "./components/Breadcrumbs";
import SearchPage from "./pages/SearchPage";
import "./styles/App.css";
export default function App() {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };
  return (
    <Router>
      {" "}
      <Navbar user={user} onLogout={handleLogout} />{" "}
      <Routes>
        {" "}
        <Route
          path="/"
          element={
            <>
              {" "}
              <Hero /> <Steps />{" "}
            </>
          }
        />{" "}
        <Route path="/register" element={<Registration />} />{" "}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />{" "}
        <Route path="/dashboard" element={<Dashboard />} />{" "}
        <Route path="/dashboard_admin" element={<DashboardAdmin />} />{" "}
        <Route path="/animals" element={<AnimalsTab />} />
        <Route path="/animals/:id" element={<AnimalPage />} />
        <Route
          path="/adoptions"
          element={
            <>
              <Breadcrumbs user={user} currentPageName="Adopcje" />
              <MyAdoptions />
            </>
          }
        />
        <Route
          path="/favorites"
          element={<FavoritesTab isAdmin={user?.is_admin} />}
        />
        <Route
          path="/animals/search"
          element={
            <>
              <SearchPage isAdmin={user?.is_admin} />
            </>
          }
        />
      </Routes>{" "}
    </Router>
  );
}
