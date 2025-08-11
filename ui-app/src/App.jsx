import "./styles/App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/MainPage";
import Steps from "./components/Steps";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Steps />
    </div>
  );
}
