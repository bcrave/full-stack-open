export default function Filter({ handleFilterChange, filterTerm }) {
  return (
    <div>
      filter shown with:{" "}
      <input type="text" onChange={handleFilterChange} value={filterTerm} />
    </div>
  );
}
