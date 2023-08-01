import { useState } from "react";
import axios from "axios";

export default function SearchForm({
  setCountries,
  setNotification,
  setSingleCountry,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCountries(null);
    setSingleCountry(null);
    setNotification(null);

    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(({ data }) => {
        const filteredCountries = data.filter((country) => {
          const { common, official } = country.name;

          return (
            common.toLowerCase().includes(searchTerm.toLowerCase()) ||
            official.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        if (filteredCountries.length > 10) {
          setNotification({
            message: "Too many matches.  Specify another filter.",
            type: "error",
          });
        } else if (filteredCountries.length === 1) {
          setSingleCountry(filteredCountries[0]);
        } else if (filteredCountries.length === 0) {
          setNotification({
            message: "No matches. Specify another filter.",
            type: "error",
          });
        } else {
          setCountries(filteredCountries);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        find countries
        <input type="text" onChange={handleChange} value={searchTerm} />
      </label>
    </form>
  );
}
