import './App.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';

import { useGeolocation } from '../../hooks/useGeolocation';
import { getWeatherData } from '../../services/openWeatherService';
import CitySearch from '../CitySearch/CitySearch';
import CurrentCity from '../CurrentCity/CurrentCity';
import DateTime from '../DateTime/DateTime';
import GoogleCalendarEvents from '../GoogleCalendarEvents/';
import GoogleLoginButton from '../GoogleLoginButton';
import Weather from '../Weather/Weather';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [currentCity, setCurrentCity] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const { coordinates } = useGeolocation();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

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

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
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
          <GoogleLoginButton
            onLoginSuccess={setToken}
            onLogout={handleLogout}
          />
          {token && <GoogleCalendarEvents token={token} />}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
