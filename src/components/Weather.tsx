import React, { useRef } from "react";
import { useTheme } from "./ThemeContext";
import useFetchWeather from "./useFetchWeather";
import "./Weather.css";
import search_icon from "../Assets/search.png";
import humidity_icon from "../Assets/humidity.png";
import wind_icon from "../Assets/wind.png";

const Weather = () => {
  const inputRef = useRef<HTMLInputElement>(null); 
  const { theme, toggleTheme } = useTheme();
  const { loading, weatherData, error, fetchWeather } = useFetchWeather();

  const handleSearch = () => {
    if (inputRef.current?.value) {
      fetchWeather(inputRef.current.value);
    }
  };

  return (
    <div className={`weather ${theme}`}> 

      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search City" />
        <img src={search_icon} alt="Search" onClick={handleSearch} />
      </div>


      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}

    
      {weatherData && (
        <>
          <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>

          <div className="weather_data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind Speed" />
              <div>
                <p>{weatherData.windSpeed} km/hr</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>

      
          <button onClick={toggleTheme} className="toggle-theme">
            {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </>
      )}
    </div>
  );
};

export default Weather;
