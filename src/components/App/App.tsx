import './App.css';

import React, { useState } from 'react';

import CitySearch from '../CitySearch/CitySearch';
import DateTime from '../DateTime/DateTime';
import Weather from '../Weather/Weather';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <div className="app">
      <div className="header">
        <DateTime />
        <div className="search">
          <CitySearch onCitySelect={handleCitySelect} />
        </div>
      </div>
      <div className="content">
        <Weather city={selectedCity || undefined} />
      </div>
    </div>
  );
};

export default App;
