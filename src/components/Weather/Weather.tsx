import React, { useEffect, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getWeatherData as getOpenWeatherData } from '../../services/openWeatherService';
import { getWeatherData as getStormGlassData } from '../../services/stormGlassService';
import { WeatherData } from '../../types/Weather';

const Weather: React.FC = () => {
  const { coordinates, error } = useGeolocation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (coordinates) {
        try {
          const openWeatherData = await getOpenWeatherData(coordinates.latitude, coordinates.longitude);
          const stormGlassData = await getStormGlassData(coordinates.latitude, coordinates.longitude);
          setWeatherData({ openWeatherData, stormGlassData });
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchWeatherData();
  }, [coordinates]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Weather Information</h1>
      <div>
        <h2>OpenWeather</h2>
        <pre>{JSON.stringify(weatherData.openWeatherData, null, 10)}</pre>
      </div>
      <div>
        <h2>StormGlass</h2>
        <pre>{JSON.stringify(weatherData.stormGlassData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Weather;
