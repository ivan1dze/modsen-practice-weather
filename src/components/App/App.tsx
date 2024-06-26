import React, { useState } from 'react';
import Weather from '../Weather/Weather';
import DateTime from '../DateTime/DateTime';
import CitySearch from '../CitySearch/CitySearch';
import './App.css';

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
        {/* <Events /> */}
      </div>
    </div>
  );
};

export default App;
