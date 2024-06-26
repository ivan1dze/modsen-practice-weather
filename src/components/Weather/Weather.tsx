import React, { useEffect, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getWeatherData as getOpenWeatherData } from '../../services/openWeatherService';
import Spinner from '../Spinner/Spinner';
import './Weather.css';
import { WeatherProps, WeatherData, Forecast } from '../../types/Weather';

const Weather: React.FC<WeatherProps> = ({ city }) => {
  const { coordinates, error: geoError } = useGeolocation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        let data;
        if (city) {
          data = await getOpenWeatherData(undefined, undefined, city);
        } else if (coordinates) {
          data = await getOpenWeatherData(
            coordinates.latitude,
            coordinates.longitude
          );
        }
        setWeatherData(data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Error fetching weather data');
      }
    };

    fetchWeatherData();
  }, [coordinates, city]);

  if (geoError || error) {
    return <div>Error: {geoError || error}</div>;
  }

  if (!weatherData) {
    return <Spinner />;
  }

  const hourlyForecasts = weatherData.list.slice(0, 5);

  return (
    <div className="weather-container">
      <h1>Weather Information</h1>
      <div className="hourly-forecast">
        {hourlyForecasts.map((forecast: Forecast, index: number) => {
          const { dt, main, weather } = forecast;
          const { temp } = main;
          const { description, icon } = weather[0];
          const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

          const date = new Date(dt * 1000);
          const hours = date.getHours();

          return (
            <div key={index} className="hourly-forecast-item">
              <div>{`${hours}:00`}</div>
              <img src={iconUrl} alt={description} />
              <div>{`${temp}°C`}</div>
              <div>{description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Weather;
