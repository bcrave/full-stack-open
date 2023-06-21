import { useState, useEffect } from "react";

function Statistics({ stats }) {
  const { good, neutral, bad, total } = stats;
  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticLine label="Good" value={good} />
          <StatisticLine label="Neutral" value={neutral} />
          <StatisticLine label="Bad" value={bad} />
          <StatisticLine label="All" value={total} />
          <StatisticLine label="Average" value={(good - bad) / total} />
          <StatisticLine label="Positive" value={`${(good / total) * 100}%`} />
        </tbody>
      </table>
    </div>
  );
}

function StatisticLine({ label, value }) {
  return (
    <tr>
      <td>{label}</td>
      <td>{value}</td>
    </tr>
  );
}

function Button({ handleClick, text }) {
  return (
    <button onClick={() => handleClick((prev) => prev + 1)}>{text}</button>
  );
}

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const total = good + neutral + bad;
    setTotal(total);
  }, [good, neutral, bad]);

  return (
    <div>
      <h1>Give feedback</h1>

      <Button handleClick={setGood} text="Good">
        Good
      </Button>
      <Button handleClick={setNeutral} text="Neutral">
        Neutral
      </Button>
      <Button handleClick={setBad} text="Bad">
        Bad
      </Button>

      {total > 0 ? (
        <Statistics stats={{ good, neutral, bad, total }} />
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
}

export default App;
