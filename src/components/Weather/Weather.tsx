import './Weather.css';

import React, { useEffect, useState } from 'react';

import { useGeolocation } from '../../hooks/useGeolocation';
import { getWeatherData as getOpenWeatherData } from '../../services/openWeatherService';
import { WeatherData, WeatherProps } from '../../types/Weather';
import Spinner from '../Spinner/Spinner';

const Weather: React.FC<WeatherProps> = ({ city }) => {
  const { coordinates, error: geoError } = useGeolocation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'hourly' | 'daily'>('hourly');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        let data;
        if (city) {
          data = await getOpenWeatherData(undefined, undefined, city);
        } else if (coordinates) {
          data = await getOpenWeatherData(
            coordinates.latitude,
            coordinates.longitude,
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
  const dailyForecasts = weatherData.list
    .filter((_, index) => index % 8 === 0)
    .slice(0, 5);

  return (
    <div className="weather-container">
      <div className="view-toggle">
        <button onClick={() => setView('hourly' as const)}>Hourly</button>
        <button onClick={() => setView('daily' as const)}>Daily</button>
      </div>
      <h1>Weather Information</h1>
      {view === 'hourly' ? (
        <div className="hourly-forecast">
          {hourlyForecasts.map((forecast, index) => {
            const { dt, main, weather } = forecast;
            const { temp } = main;
            const { description, icon } = weather[0];
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            const date = new Date(dt * 1000);
            const hours = date.getHours();

            return (
              <div key={index} className="hourly-forecast-item">
                <div>{hours}:00</div>
                <img src={iconUrl} alt={description} />
                <div>{temp}°C</div>
                <div>{description}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="daily-forecast">
          {dailyForecasts.map((forecast, index) => {
            const { dt, main, weather } = forecast;
            const { temp } = main;
            const { description, icon } = weather[0];
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            const date = new Date(dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });

            return (
              <div key={index} className="daily-forecast-item">
                <div>{day}</div>
                <img src={iconUrl} alt={description} />
                <div>{temp}°C</div>
                <div>{description}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Weather;
