import { useState } from "react";
import axios, { AxiosResponse } from "axios";

const API_KEY = "Your API KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherAPIResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    icon: string;
  }[];
}

const useFetchWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string): Promise<void> => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<WeatherAPIResponse> = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      });

      const data = response.data;

      setWeatherData({
        location: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { weatherData, loading, error, fetchWeather };
};

export default useFetchWeather;
