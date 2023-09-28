import { useSelector, useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state);

  const updateStats = (type) => {
    dispatch({
      type
    });
  };

  return (
    <div>
      <button onClick={() => updateStats('GOOD')}>good</button>
      <button onClick={() => updateStats('OK')}>ok</button>
      <button onClick={() => updateStats('BAD')}>bad</button>
      <button onClick={() => updateStats('ZERO')}>reset stats</button>
      <div>good {stats.good}</div>
      <div>ok {stats.ok}</div>
      <div>bad {stats.bad}</div>
    </div>
  )
}

export default App
