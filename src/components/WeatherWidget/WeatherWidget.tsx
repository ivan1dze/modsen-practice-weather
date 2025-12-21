import './WeatherWidget.css';

import React, { useEffect, useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
import { useTemperatureUnit } from '../../contexts/TemperatureUnitContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getWeatherData } from '../../services/openWeatherService';
import { WeatherData } from '../../types/Weather';
import { translateWeatherDescription } from '../../utils/weatherTranslations';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface WeatherWidgetProps {
  city?: string;
  onExpand?: () => void;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ city, onExpand }) => {
  const { coordinates } = useGeolocation();
  const { t, language } = useLanguage();
  const { convertTemperature, getUnitSymbol } = useTemperatureUnit();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city && !coordinates) return;

    let isMounted = true;

    const fetchWeatherData = async () => {
      try {
        const result = await getWeatherData(
          coordinates?.latitude,
          coordinates?.longitude,
          city,
        );

        if (!isMounted) return;

        const data = result.data;

        if (!data || !data.list || data.list.length === 0) {
          setError('Invalid weather data received');
          return;
        }

        // Показываем данные сразу (из кэша или свежие)
        setWeatherData(data);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching weather data:', err);
        setError('Error fetching weather data');
      }
    };

    fetchWeatherData();

    return () => {
      isMounted = false;
    };
  }, [city, coordinates]);

  if (error) {
    return (
      <div className="weather-widget error">
        <p>{t('error')}</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-widget loading">
        <LoadingSpinner size="small" />
      </div>
    );
  }

  const currentWeather = weatherData.list[0];
  const { temp } = currentWeather.main;
  const weatherIcon = currentWeather.weather[0]?.main || 'Clear';
  const description = currentWeather.weather[0]?.description || 'N/A';
  const translatedDescription = translateWeatherDescription(
    description,
    language,
  );

  return (
    <div
      className="weather-widget"
      onClick={onExpand}
      role="button"
      tabIndex={0}
    >
      <div className="widget-content">
        <div className="widget-icon">{getWeatherIcon(weatherIcon)}</div>
        <div className="widget-info">
          <div className="widget-temp">
            {convertTemperature(temp)}
            {getUnitSymbol()}
          </div>
          <div className="widget-description">{translatedDescription}</div>
          <div className="widget-city">{city || t('currentLocation')}</div>
        </div>
      </div>
    </div>
  );
};

const getWeatherIcon = (main: string): string => {
  const iconMap: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
  };
  return iconMap[main] || '🌤️';
};

export default WeatherWidget;
