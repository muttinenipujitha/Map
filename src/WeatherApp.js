import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [unit, setUnit] = useState('metric'); // Default unit is Celsius

  const API_KEY = '6922bdc7e4458d0bfdf2fdc6d7570643'; // Replace with your OpenWeatherMap API key

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`);
      setWeatherData(response.data);
      setError('');
      updateRecentSearches(city);
    } catch (error) {
      setWeatherData(null);
      setError('City not found');
    }
  };

  const updateRecentSearches = (searchedCity) => {
    setRecentSearches(prevSearches => {
      const updatedSearches = [searchedCity, ...prevSearches.slice(0, 4)];
      return updatedSearches.filter((search, index) => updatedSearches.indexOf(search) === index);
    });
  };

  const handleUnitToggle = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const toCelsius = (temperature) => {
    return (temperature - 32) * (5 / 9);
  };

  const toFahrenheit = (temperature) => {
    return (temperature * (9 / 5)) + 32;
  };

  useEffect(() => {
    // Load recent searches from localStorage on component mount
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    // Save recent searches to localStorage whenever it changes
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeatherData}>Search</button>
      <button onClick={handleUnitToggle}>{unit === 'metric' ? 'Switch to Imperial' : 'Switch to Metric'}</button>

      {error && <p>{error}</p>}

      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {unit === 'metric' ? toCelsius(weatherData.main.temp).toFixed(2) : toFahrenheit(weatherData.main.temp).toFixed(2)}°{unit === 'metric' ? 'C' : 'F'}</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}

      <div>
        <h2>Recent Searches</h2>
        <ul>
          {recentSearches.map((search, index) => (
            <li key={index}>{search}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WeatherApp;





