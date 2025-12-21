import './Weather.css';

import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
import { useTemperatureUnit } from '../../contexts/TemperatureUnitContext';
import { useWeatherContext } from '../../contexts/WeatherContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getWeatherData as getOpenWeatherData } from '../../services/openWeatherService';
import {
  WeatherData,
  WeatherForecastItem,
  WeatherProps,
} from '../../types/Weather';
import { translateWeatherDescription } from '../../utils/weatherTranslations';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const HOURLY_FORECAST_COUNT = 5;
const DAILY_FORECAST_COUNT = 5;

const getWeatherClass = (description: string): string => {
  const desc = description.toLowerCase();
  // Проверяем в порядке приоритета: rain > cloud > clear
  if (
    desc.includes('rain') ||
    desc.includes('drizzle') ||
    desc.includes('thunderstorm') ||
    desc.includes('shower')
  ) {
    return 'rain';
  }
  if (
    desc.includes('cloud') ||
    desc.includes('overcast') ||
    desc.includes('mist') ||
    desc.includes('fog') ||
    desc.includes('haze')
  ) {
    return 'cloud';
  }
  // Солнечная/ясная погода - проверяем различные варианты
  if (
    desc.includes('clear') ||
    desc.includes('sun') ||
    desc.includes('sunny') ||
    desc === 'clear sky'
  ) {
    return 'clear';
  }
  return 'default';
};

const groupForecastsByDate = (
  forecasts: WeatherForecastItem[],
): Map<string, WeatherForecastItem[]> => {
  const grouped = new Map<string, WeatherForecastItem[]>();

  forecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const dateKey = date.toDateString();

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(forecast);
  });

  return grouped;
};

const Weather: React.FC<WeatherProps> = ({ city }) => {
  const { coordinates, error: geoError } = useGeolocation();
  const { setWeatherClass } = useWeatherContext();
  const { t, language } = useLanguage();
  const { convertTemperature, getUnitSymbol } = useTemperatureUnit();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'hourly' | 'daily'>('hourly');

  useEffect(() => {
    if (!city && !coordinates) {
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    const fetchWeatherData = async () => {
      try {
        let result;
        if (city) {
          result = await getOpenWeatherData(undefined, undefined, city);
        } else if (coordinates) {
          result = await getOpenWeatherData(
            coordinates.latitude,
            coordinates.longitude,
          );
        } else {
          return;
        }

        if (!isMounted) return;

        const data = result.data;

        if (
          !data ||
          !data.list ||
          !Array.isArray(data.list) ||
          data.list.length === 0
        ) {
          setError('Invalid weather data received');
          return;
        }

        // Показываем данные сразу (из кэша или свежие)
        setWeatherData(data);
        setError(null);

        // Если данные из кэша, они могут обновиться в фоне автоматически
        // (обновление происходит в openWeatherService)
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching weather data:', err);
        setError('Error fetching weather data. Please try again.');
      }
    };

    fetchWeatherData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [coordinates, city]);

  useEffect(() => {
    if (!weatherData?.list || weatherData.list.length === 0) {
      setWeatherClass('default');
      return;
    }

    const currentWeather = weatherData.list[0];
    if (!currentWeather?.weather || currentWeather.weather.length === 0) {
      setWeatherClass('default');
      return;
    }

    const description = currentWeather.weather[0].description;
    const weatherClassValue = getWeatherClass(description) as
      | 'clear'
      | 'cloud'
      | 'rain'
      | 'default';
    setWeatherClass(weatherClassValue);
  }, [weatherData, setWeatherClass]);

  const hourlyForecasts = useMemo(() => {
    if (!weatherData?.list) return [];
    return weatherData.list.slice(0, HOURLY_FORECAST_COUNT);
  }, [weatherData]);

  const dailyForecasts = useMemo(() => {
    if (!weatherData?.list) return [];

    const grouped = groupForecastsByDate(weatherData.list);
    const dailyItems: WeatherForecastItem[] = [];

    grouped.forEach((dayForecasts) => {
      if (dayForecasts.length > 0) {
        // Берем первый прогноз дня (обычно это утро)
        dailyItems.push(dayForecasts[0]);
      }
    });

    return dailyItems.slice(0, DAILY_FORECAST_COUNT);
  }, [weatherData]);

  if (geoError && !city) {
    return (
      <div className="weather-error">
        <p>Error: {geoError}</p>
        <p>Please search for a city manually or enable location permissions.</p>
      </div>
    );
  }

  if (error) {
    return <div className="weather-error">Error: {error}</div>;
  }

  if (!weatherData) {
    return (
      <div className="weather-loading">
        <LoadingSpinner size="large" text={t('loading')} />
      </div>
    );
  }

  return (
    <div className="weather-container">
      <div className="view-toggle">
        <div className="view-toggle-wrapper">
          <button
            onClick={() => setView('hourly')}
            className={view === 'hourly' ? 'active' : ''}
            type="button"
          >
            {t('hourly')}
          </button>
          <button
            onClick={() => setView('daily')}
            className={view === 'daily' ? 'active' : ''}
            type="button"
          >
            {t('daily')}
          </button>
          <div
            className={`view-toggle-slider ${view === 'daily' ? 'slide-right' : 'slide-left'}`}
          />
        </div>
      </div>
      <h1 className="weather-title">{t('weatherInformation')}</h1>
      {view === 'hourly' ? (
        <div className="hourly-forecast">
          {hourlyForecasts.length === 0 ? (
            <div>{t('noHourlyForecast')}</div>
          ) : (
            hourlyForecasts.map((forecast, index) => {
              const { dt, main, weather } = forecast;
              if (!main || !weather || weather.length === 0) return null;

              const { temp } = main;
              const { description, icon } = weather[0];
              const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
              const date = new Date(dt * 1000);
              const hours = date.getHours();
              const translatedDescription = translateWeatherDescription(
                description,
                language,
              );

              return (
                <motion.div
                  key={dt}
                  className="hourly-forecast-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div>{hours}:00</div>
                  <img src={iconUrl} alt={translatedDescription} />
                  <div>
                    {convertTemperature(temp)}
                    {getUnitSymbol()}
                  </div>
                  <div>{translatedDescription}</div>
                </motion.div>
              );
            })
          )}
        </div>
      ) : (
        <div className="daily-forecast">
          {dailyForecasts.length === 0 ? (
            <div>{t('noDailyForecast')}</div>
          ) : (
            dailyForecasts.map((forecast, index) => {
              const { dt, main, weather } = forecast;
              if (!main || !weather || weather.length === 0) return null;

              const { temp } = main;
              const { description, icon } = weather[0];
              const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

              const date = new Date(dt * 1000);
              const day = date.toLocaleDateString(t('dateLocale'), {
                weekday: 'long',
              });
              const translatedDescription = translateWeatherDescription(
                description,
                language,
              );

              return (
                <motion.div
                  key={dt}
                  className="daily-forecast-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div>{day}</div>
                  <img src={iconUrl} alt={translatedDescription} />
                  <div>
                    {convertTemperature(temp)}
                    {getUnitSymbol()}
                  </div>
                  <div>{translatedDescription}</div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
