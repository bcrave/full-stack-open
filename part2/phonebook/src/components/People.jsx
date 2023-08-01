export default function People({ peopleToShow, handleDelete }) {
  return (
    <div>
      {peopleToShow.map((person) => (
        <div key={person.name}>
          {person.name}: {person.number}
          <button onClick={() => handleDelete(person.id, person.name)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
