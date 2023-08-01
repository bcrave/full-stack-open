import { useState } from "react";
import CountryDetails from "./CountryDetails";

export default function Country({ country, isSingle = false }) {
  const [showDetails, setShowDetails] = useState(false);

  return isSingle || showDetails ? (
    <CountryDetails
      country={country}
      setShowDetails={setShowDetails}
      isSingle={isSingle}
    />
  ) : (
    <div>
      {country.name.common}
      <button onClick={() => setShowDetails(true)}>Show details</button>
    </div>
  );
}
