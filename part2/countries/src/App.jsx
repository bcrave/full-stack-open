import { useState } from "react";

import SearchForm from "./components/SearchForm";
import Country from "./components/Country";
import CountryList from "./components/CountryList";

function App() {
  const [countries, setCountries] = useState(null);
  const [singleCountry, setSingleCountry] = useState(null);
  const [notification, setNotification] = useState(null);

  return (
    <div>
      <SearchForm
        setCountries={setCountries}
        setSingleCountry={setSingleCountry}
        setNotification={setNotification}
      />

      {notification && <div>{notification.message}</div>}

      {singleCountry && <Country country={singleCountry} isSingle={true} />}

      {countries && <CountryList countries={countries} />}
    </div>
  );
}

export default App;
