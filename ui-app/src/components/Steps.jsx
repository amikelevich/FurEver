import "./../styles/Steps.css";
import Step from "./Step";
import { FaUserPlus, FaSearch, FaPaperPlane } from "react-icons/fa";

export default function Steps() {
  return (
    <div className="steps-vertical" id="steps">
      <Step
        icon={<FaUserPlus />}
        number="1"
        title="Utwórz konto"
        description="Zarejestruj się w naszym systemie i wypełnij podstawowe informacje o sobie."
      />
      <Step
        icon={<FaSearch />}
        number="2"
        title="Dołącz do nas"
        description="Przeglądaj profile zwierząt, filtruj według swoich preferencji i znajdź idealnego towarzysza."
      />
      <Step
        icon={<FaPaperPlane />}
        number="3"
        title="Wyślij zgłoszenie"
        description="Wypełnij formularz adopcyjny i wyślij go do schroniska. Wkrótce skontaktujemy się z Tobą!"
      />
    </div>
  );
}
