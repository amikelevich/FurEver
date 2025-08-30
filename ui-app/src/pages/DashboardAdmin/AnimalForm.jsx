import { useState } from "react";

export default function AnimalForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    short_traits: [],
    description: "",
    gender: "unknown",
    age: "",
    breed: "",
    location: "",
    human_friendly: "",
    animal_friendly: "",
    best_home: "",
    sterilized: false,
    vaccinated: false,
    dewormed: false,
    chipped: false,
    health_status: "",
    examinations: "",
    last_vet_visit: "",
    adoption_date: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      for (let key in formData) {
        if (key === "short_traits") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }
      images.forEach((img) => data.append("images", img));

      const response = await fetch("http://localhost:8000/api/animals/", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Zwierzę zostało dodane ✅");
        onClose();
      } else {
        alert("Błąd przy dodawaniu zwierzęcia ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Błąd połączenia z backendem ❌");
    }
  };

  const traitsOptions = [
    { value: "calm", label: "Spokojny" },
    { value: "afraid_of_loud_sounds", label: "Boi się głośnych dźwięków" },
    { value: "active", label: "Aktywny" },
    { value: "likes_company", label: "Lubi towarzystwo" },
    { value: "independent", label: "Niezależne" },
  ];

  return (
    <>
      <h2
        style={{
          color: "#24360e",
          fontSize: "26px",
          marginBottom: "20px",
          fontWeight: 600,
        }}
      >
        Dodaj zwierzę
      </h2>

      <form onSubmit={handleSubmit} className="animal-form">
        <small>Podaj imię zwierzęcia.</small>
        <input
          type="text"
          name="name"
          placeholder="Imię"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <small>Dodaj zdjęcia zwierzęcia.</small>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />

        <div className="checkbox-group">
          <small>Krótka charakterystyka:</small>
          {traitsOptions.map((trait) => (
            <label key={trait.value} className="checkbox-item">
              <input
                type="checkbox"
                value={trait.value}
                checked={formData.short_traits.includes(trait.value)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  let updated = [...formData.short_traits];
                  if (checked) updated.push(trait.value);
                  else updated = updated.filter((v) => v !== trait.value);
                  setFormData({ ...formData, short_traits: updated });
                }}
              />
              {trait.label}
            </label>
          ))}
        </div>

        <small>Krótki opis zwierzęcia, jego zachowanie i potrzeby.</small>
        <textarea
          name="description"
          placeholder="Opis"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <small>Wybierz płeć zwierzęcia.</small>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="unknown">Nieznany</option>
          <option value="male">Samiec</option>
          <option value="female">Samica</option>
        </select>

        <small>Podaj wiek w pełnych latach.</small>
        <input
          type="number"
          name="age"
          placeholder="Wiek (lata)"
          value={formData.age}
          onChange={handleChange}
        />

        <small>Jeśli znana, podaj rasę zwierzęcia.</small>
        <input
          type="text"
          name="breed"
          placeholder="Rasa"
          value={formData.breed}
          onChange={handleChange}
        />

        <small>Wybierz miejsce pobytu zwierzęcia.</small>
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
        >
          <option value="">--Lokalizacja--</option>
          <option value="shelter-Warsaw-Warszawska-15">
            Schronisko w Warszawie
          </option>
          <option value="shelter-Krakow-Warszawska-15">
            Schronisko w Krakowie
          </option>
          <option value="shelter-Poznan-Warszawska-15">
            Schronisko w Poznaniu
          </option>
          <option value="foster-home">Dom tymczasowy</option>
        </select>

        <small>Określ, jak zwierzę reaguje na ludzi.</small>
        <select
          name="human_friendly"
          value={formData.human_friendly}
          onChange={handleChange}
        >
          <option value="">--Stosunek do ludzi--</option>
          <option value="friendly">Przyjazny</option>
          <option value="neutral">Neutralny</option>
          <option value="fearful">Boi się ludzi</option>
        </select>

        <small>Określ, jak zwierzę reaguje na inne zwierzęta.</small>
        <select
          name="animal_friendly"
          value={formData.animal_friendly}
          onChange={handleChange}
        >
          <option value="">--Stosunek do zwierząt--</option>
          <option value="friendly">Przyjazny</option>
          <option value="neutral">Neutralny</option>
          <option value="aggressive">Agresywny wobec innych zwierząt</option>
        </select>

        <small>Wybierz najbardziej odpowiednie środowisko domowe.</small>
        <select
          name="best_home"
          value={formData.best_home}
          onChange={handleChange}
        >
          <option value="">--Najlepszy dom--</option>
          <option value="no_kids">Dom bez małych dzieci</option>
          <option value="no_other_pets">Dom bez innych zwierząt</option>
          <option value="any">Dowolny dom</option>
        </select>

        <small>Czy zwierzę jest wysterylizowane/kastrowane.</small>
        <label>
          <input
            type="checkbox"
            name="sterilized"
            checked={formData.sterilized}
            onChange={handleChange}
          />{" "}
          Sterylizacja/kastracja
        </label>

        <small>Czy zwierzę posiada aktualne szczepienia.</small>
        <label>
          <input
            type="checkbox"
            name="vaccinated"
            checked={formData.vaccinated}
            onChange={handleChange}
          />{" "}
          Szczepienia
        </label>

        <small>Czy zwierzę było odrobaczone.</small>
        <label>
          <input
            type="checkbox"
            name="dewormed"
            checked={formData.dewormed}
            onChange={handleChange}
          />{" "}
          Odrobaczenie
        </label>

        <small>Czy zwierzę posiada mikroczip identyfikacyjny.</small>
        <label>
          <input
            type="checkbox"
            name="chipped"
            checked={formData.chipped}
            onChange={handleChange}
          />{" "}
          Mikroczip
        </label>

        <small>Wybierz aktualny stan zdrowia zwierzęcia.</small>
        <select
          name="health_status"
          value={formData.health_status}
          onChange={handleChange}
        >
          <option value="">--Stan zdrowia--</option>
          <option value="healthy">Zdrowy</option>
          <option value="minor_issues">Drobne problemy zdrowotne</option>
          <option value="chronic">Choroby przewlekłe</option>
        </select>

        <small>Określ zakres przeprowadzonych badań.</small>
        <select
          name="examinations"
          value={formData.examinations}
          onChange={handleChange}
        >
          <option value="">--Badania--</option>
          <option value="none">Brak</option>
          <option value="basic">Podstawowe</option>
          <option value="full">Pełne</option>
        </select>

        <small>Data ostatniej wizyty u weterynarza.</small>
        <input
          type="date"
          name="last_vet_visit"
          value={formData.last_vet_visit}
          onChange={handleChange}
        />

        <small>Data adopcji (jeśli już nastąpiła).</small>
        <input
          type="date"
          name="adoption_date"
          value={formData.adoption_date}
          onChange={handleChange}
        />

        <div className="form-buttons">
          <button type="submit">Zapisz</button>
          <button type="button" onClick={onClose}>
            Anuluj
          </button>
        </div>
      </form>
    </>
  );
}
