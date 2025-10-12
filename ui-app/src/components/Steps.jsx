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
        description="Zarejestruj się i wypełnij podstawowe informacje o sobie."
      />
      <Step
        icon={<FaSearch />}
        number="2"
        title="Dołącz do nas"
        description="Poznaj naszych podopiecznych, wybierz według swoich preferencji i odnajdź swojego przyjaciela."
      />
      <Step
        icon={<FaPaperPlane />}
        number="3"
        title="Wyślij zgłoszenie"
        description="Wypełnij zgłoszenie adopcyjne — skontaktujemy się z Tobą, by omówić kolejne kroki."
      />
    </div>
  );
}
