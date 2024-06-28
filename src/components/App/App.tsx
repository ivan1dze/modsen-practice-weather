import './App.css';

import React, { useEffect, useState } from 'react';

import { useGeolocation } from '../../hooks/useGeolocation';
import { getWeatherData } from '../../services/openWeatherService';
import CitySearch from '../CitySearch/CitySearch';
import CurrentCity from '../CurrentCity/CurrentCity';
import DateTime from '../DateTime/DateTime';
import Weather from '../Weather/Weather';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [currentCity, setCurrentCity] = useState<string>('');
  const { coordinates } = useGeolocation();

  useEffect(() => {
    if (coordinates) {
      const fetchCityName = async () => {
        const data = await getWeatherData(
          coordinates.latitude,
          coordinates.longitude,
        );
        setCurrentCity(data.city.name);
        setSelectedCity(data.city.name);
      };
      fetchCityName();
    }
  }, [coordinates]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCurrentCity(city);
  };

  return (
    <div className="app">
      <div className="header">
        <DateTime />
        <CurrentCity city={currentCity} />
        <div className="search">
          <CitySearch onCitySelect={handleCitySelect} />
        </div>
      </div>
      <div className="content">
        <Weather city={selectedCity} />
      </div>
    </div>
  );
};

export default App;
