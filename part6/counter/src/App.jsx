function App({ store }) {
  return (
    <div>
      hello!
      <button onClick={(e) => store.dispatch({ type: 'DECREMENT' })}>
        Minus
      </button>
      <button onClick={(e) => store.dispatch({ type: 'INCREMENT' })}>
        Plus
      </button>
      <button onClick={(e) => store.dispatch({ type: 'ZERO' })}>Zero</button>
    </div>
  );
}

export default App;
