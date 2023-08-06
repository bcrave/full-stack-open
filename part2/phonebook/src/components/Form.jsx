export default function Form({
  handleSubmit,
  handleNameChange,
  handleNumberChange,
  name,
  number,
  inputRef,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={name} ref={inputRef} />
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
