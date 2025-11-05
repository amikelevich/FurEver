import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/MainPage";
import Steps from "./components/Steps";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";
import AnimalsTabAdmin from "./pages/DashboardAdmin/AnimalsTabAdmin";
import AnimalsTabUser from "./components/AnimalsTabUser";
import AnimalPage from "./pages/AnimalPage";
import MyAdoptions from "./components/MyAdoptions";
import FavoritesTab from "./components/FavoritesTab";
import Breadcrumbs from "./components/Breadcrumbs";
import SearchPage from "./pages/SearchPage";
import AnimalsFullPage from "./pages/AnimalsFullPage";
import ApplicationsTab from "./pages/DashboardAdmin/ApplicationsTab";
import "./styles/App.css";
import MainPageAnimals from "./components/MainPageAnimals";
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
              <Hero /> <Steps /> <MainPageAnimals />{" "}
            </>
          }
        />{" "}
        <Route path="/register" element={<Registration />} />{" "}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />{" "}
        <Route path="/dashboard" element={<Dashboard />} />{" "}
        <Route path="/dashboard_admin" element={<DashboardAdmin />} />{" "}
        <Route path="/animals/admin" element={<AnimalsTabAdmin />} />
        <Route path="/animals/user" element={<AnimalsTabUser />} />
        <Route path="/animals/:id" element={<AnimalPage />} />
        <Route path="/animals/full" element={<AnimalsFullPage />} />
        <Route path="/adoptions/admin" element={<ApplicationsTab />} />
        <Route
          path="/adoptions"
          element={
            <div style={{ paddingTop: "80px" }}>
              <Breadcrumbs user={user} currentPageName="Adopcje" />
              <MyAdoptions />
            </div>
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
