export default function AnimalsTab({ onAddClick }) {
  return (
    <div className="animals-tab">
      <button className="add-animal-btn" onClick={onAddClick}>
        ➕ Dodaj zwierzę
      </button>
      <p>Lista zwierząt</p>
    </div>
  );
}
