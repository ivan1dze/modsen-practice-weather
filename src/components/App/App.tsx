import './App.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { API_CONFIG } from '../../config/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useWeatherContext } from '../../contexts/WeatherContext';
import { useFirstVisit } from '../../hooks/useFirstVisit';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getWeatherData } from '../../services/openWeatherService';
import CitySearch from '../CitySearch/CitySearch';
import CurrentCity from '../CurrentCity/CurrentCity';
import DateTime from '../DateTime/DateTime';
import FavoriteCities from '../FavoriteCities/FavoriteCities';
import GoogleCalendarEvents from '../GoogleCalendarEvents/';
import GoogleLoginButton from '../GoogleLoginButton';
import SettingsButton from '../SettingsButton/SettingsButton';
import SettingsModal from '../SettingsModal/SettingsModal';
import Weather from '../Weather/Weather';
import WeatherWidget from '../WeatherWidget/WeatherWidget';
import WelcomeBackScreen from '../WelcomeBackScreen/WelcomeBackScreen';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';

const AppContent: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [currentCity, setCurrentCity] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [showWidget, setShowWidget] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { coordinates } = useGeolocation();
  const { weatherClass } = useWeatherContext();
  const { t } = useLanguage();

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    const fetchCityName = async () => {
      try {
        const result = await getWeatherData(
          coordinates.latitude,
          coordinates.longitude,
        );

        if (!isMounted) return;

        const data = result.data;

        if (data?.city?.name) {
          setCurrentCity(data.city.name);
          setSelectedCity(data.city.name);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching city name:', error);
      }
    };

    fetchCityName();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [coordinates]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCurrentCity(city);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const appContent = (
    <div className={`app ${weatherClass}`}>
      <div className="header">
        <DateTime />
        <div className="header-center">
          <CurrentCity city={currentCity} />
          <FavoriteCities
            onCitySelect={handleCitySelect}
            currentCity={currentCity}
          />
        </div>
        <div className="header-right">
          <div className="search">
            <CitySearch onCitySelect={handleCitySelect} />
          </div>
          <SettingsButton onClick={() => setShowSettings(true)} />
        </div>
      </div>
      <div className="content">
        {showWidget ? (
          <div className="widget-section">
            <div className="widget-header-controls">
              <button
                className="back-to-full-button"
                onClick={() => setShowWidget(false)}
                type="button"
              >
                ← {t('fullView')}
              </button>
            </div>
            <WeatherWidget city={selectedCity || undefined} />
          </div>
        ) : (
          <div className="weather-section">
            <div className="weather-header-controls">
              <button
                className="back-to-widget-button"
                onClick={() => setShowWidget(true)}
                type="button"
              >
                ← {t('widgetView')}
              </button>
            </div>
            <Weather city={selectedCity} />
          </div>
        )}
        {API_CONFIG.GOOGLE_CLIENT_ID && (
          <div className="google-section">
            <div className="google-auth-wrapper">
              <GoogleLoginButton
                onLoginSuccess={setToken}
                onLogout={handleLogout}
              />
            </div>
            {token && (
              <div className="google-calendar-wrapper">
                <GoogleCalendarEvents token={token} />
              </div>
            )}
          </div>
        )}
        {!API_CONFIG.GOOGLE_CLIENT_ID && (
          <div className="google-calendar-placeholder">
            <p>Google Calendar integration is not configured.</p>
            <p>
              Add REACT_APP_GOOGLE_CLIENT_ID to your .env file to enable it.
            </p>
          </div>
        )}
      </div>
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );

  if (!API_CONFIG.GOOGLE_CLIENT_ID) {
    return appContent;
  }

  return (
    <GoogleOAuthProvider clientId={API_CONFIG.GOOGLE_CLIENT_ID}>
      {appContent}
    </GoogleOAuthProvider>
  );
};

const App: React.FC = () => {
  const { isFirstVisit, markAsVisited } = useFirstVisit();
  const [showWelcomeBack, setShowWelcomeBack] = useState(!isFirstVisit);
  const [showWelcome, setShowWelcome] = useState(isFirstVisit);
  const [showApp, setShowApp] = useState(false);

  const handleGetStarted = () => {
    markAsVisited();
    setShowWelcome(false);
    setTimeout(() => setShowApp(true), 500);
  };

  const handleSkip = () => {
    markAsVisited();
    setShowWelcome(false);
    setTimeout(() => setShowApp(true), 500);
  };

  return (
    <>
      {showWelcome && (
        <WelcomeScreen onGetStarted={handleGetStarted} onSkip={handleSkip} />
      )}
      {showWelcomeBack && !showWelcome && (
        <WelcomeBackScreen onContinue={() => setShowWelcomeBack(false)} />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: showApp || (!showWelcome && !showWelcomeBack) ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          pointerEvents:
            showApp || (!showWelcome && !showWelcomeBack) ? 'auto' : 'none',
          position: 'relative',
          zIndex: showApp || (!showWelcome && !showWelcomeBack) ? 1 : -1,
        }}
      >
        <AppContent />
      </motion.div>
      <SpeedInsights />
    </>
  );
};

export default App;
