import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Weather from "./Weather";
import { ThemeProvider } from "./ThemeContext";
import useFetchWeather from "./useFetchWeather";


jest.mock("./useFetchWeather");

describe("Weather Component", () => {
  beforeEach(() => {
    (useFetchWeather as jest.Mock).mockReturnValue({
      loading: false,
      weatherData: null,
      error: null,
      fetchWeather: jest.fn(),
    });
  });

  test("renders search bar and theme toggle button", () => {
    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>
    );

    expect(screen.getByPlaceholderText("Search City")).toBeInTheDocument();
    expect(screen.getByAltText("Search")).toBeInTheDocument();
    expect(screen.getByText(/Theme Dark Mode/i)).toBeInTheDocument();
  });

  test("calls fetchWeather when search icon is clicked", () => {
    const fetchWeatherMock = jest.fn();
    (useFetchWeather as jest.Mock).mockReturnValue({
      loading: false,
      weatherData: null,
      error: null,
      fetchWeather: fetchWeatherMock,
    });

    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>
    );

    const input = screen.getByPlaceholderText("Search City") as HTMLInputElement;
    const searchIcon = screen.getByAltText("Search");

    fireEvent.change(input, { target: { value: "New York" } });
    fireEvent.click(searchIcon);

    expect(fetchWeatherMock).toHaveBeenCalledWith("New York");
  });

  test("displays loading state when fetching data", () => {
    (useFetchWeather as jest.Mock).mockReturnValue({
      loading: true,
      weatherData: null,
      error: null,
      fetchWeather: jest.fn(),
    });

    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error message when API call fails", () => {
    (useFetchWeather as jest.Mock).mockReturnValue({
      loading: false,
      weatherData: null,
      error: "City not found",
      fetchWeather: jest.fn(),
    });

    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>
    );

    expect(screen.getByText("City not found")).toBeInTheDocument();
  });

  test("displays weather data when available", () => {
    (useFetchWeather as jest.Mock).mockReturnValue({
      loading: false,
      weatherData: {
        icon: "test-icon.png",
        temperature: 25,
        location: "London",
        humidity: 60,
        windSpeed: 15,
      },
      error: null,
      fetchWeather: jest.fn(),
    });

    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>
    );

    expect(screen.getByText("25°C")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("15 km/hr")).toBeInTheDocument();
  });

  test("toggles theme when button is clicked", () => {
    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>
    );

    const themeButton = screen.getByText(/Theme Dark Mode/i);
    fireEvent.click(themeButton);

    expect(screen.getByText(/Theme Light Mode/i)).toBeInTheDocument();
  });
});
