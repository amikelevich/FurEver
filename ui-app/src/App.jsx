import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/MainPage";
import Steps from "./components/Steps";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./styles/App.css";
export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
        <Route path="/main" element={<Dashboard />} />{" "}
      </Routes>{" "}
    </Router>
  );
}
