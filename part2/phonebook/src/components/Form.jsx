export default function Form({
  handleSubmit,
  handleNameChange,
  handleNumberChange,
  name,
  number,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={name} />
      </div>

      <div>
        number: <input onChange={handleNumberChange} value={number} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}
