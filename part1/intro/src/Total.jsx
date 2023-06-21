export default function Total({ parts }) {
  return (
    <p>
      Total number of exercises{" "}
      {parts[0].exercises + parts[1].exercises + parts[2].exercises}
    </p>
  );
}
