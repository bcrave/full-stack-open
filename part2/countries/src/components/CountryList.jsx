import Country from "./Country";

export default function CountryList({ countries }) {
  return (
    <div>
      {countries.map((country) => (
        <div key={country.cca3}>
          <Country country={country} />
        </div>
      ))}
    </div>
  );
}
