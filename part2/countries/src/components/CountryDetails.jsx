import { useEffect, useState } from "react";
import axios from "axios";

const openWeatherApiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

export default function CountryDetails({ country, setShowDetails, isSingle }) {
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    const [lat, lon] = country.latlng;
    axios
      .get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`
      )
      .then(({ data }) => {
        setWeatherInfo(data);
      });
  }, [country.latlng]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      {!isSingle && (
        <button onClick={() => setShowDetails(false)}>Hide details</button>
      )}
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area}</div>
      <h3>Languages:</h3>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>Weather in {country.capital}</h2>
      <div>Temperature: {weatherInfo?.current.temp} °C</div>
      <img
        src={`https://openweathermap.org/img/wn/${weatherInfo?.current.weather[0].icon}@2x.png`}
        alt=""
      />
      <div>Wind: {weatherInfo?.current.wind_speed} m/s</div>
    </div>
  );
}
