export default function Total({ parts }) {
  return (
    <p style={{ fontWeight: "bold" }}>
      Total number of exercises {parts.reduce((a, b) => a + b.exercises, 0)}
    </p>
  );
}
