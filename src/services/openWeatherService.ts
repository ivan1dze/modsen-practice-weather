import axios from 'axios';

import { API_CONFIG } from '../config/api';
import { WeatherData } from '../types/Weather';
import {
  cacheWeatherData,
  getCachedWeatherData,
  isCacheStale,
  isOnline,
} from '../utils/cache';

const getCacheKey = (lat?: number, lon?: number, city?: string): string => {
  if (city) return `city_${city}`;
  if (lat && lon) return `coords_${lat}_${lon}`;
  return 'default';
};

export interface WeatherDataResult {
  data: WeatherData;
  fromCache: boolean;
}

export const getWeatherData = async (
  lat?: number,
  lon?: number,
  city?: string,
): Promise<WeatherDataResult> => {
  if (!API_CONFIG.OPENWEATHER_API_KEY) {
    throw new Error('OpenWeather API key is not configured');
  }

  const cacheKey = getCacheKey(lat, lon, city);

  // Проверяем кэш и возвращаем сразу, если есть
  const cached = getCachedWeatherData<WeatherData>(cacheKey);
  const cacheIsStale = isCacheStale(cacheKey);

  if (cached && !cacheIsStale) {
    // Если кэш свежий, возвращаем его сразу
    return { data: cached, fromCache: true };
  }

  if (cached && cacheIsStale && isOnline()) {
    // Если кэш устарел, возвращаем его сразу, но обновляем в фоне
    updateWeatherDataInBackground(lat, lon, city, cacheKey).catch(() => {
      // Игнорируем ошибки фонового обновления
    });
    return { data: cached, fromCache: true };
  }

  if (cached && !isOnline()) {
    // Если офлайн, возвращаем кэш даже если он устарел
    return { data: cached, fromCache: true };
  }

  // Если офлайн и нет кэша, выбрасываем ошибку
  if (!isOnline()) {
    throw new Error('No internet connection and no cached data available');
  }

  // Загружаем свежие данные
  const url = city
    ? `${API_CONFIG.OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_CONFIG.OPENWEATHER_API_KEY}`
    : `${API_CONFIG.OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_CONFIG.OPENWEATHER_API_KEY}`;

  const response = await axios.get(url);
  const data = response.data;

  // Кэшируем данные
  cacheWeatherData(cacheKey, data);

  return { data, fromCache: false };
};

// Функция для фонового обновления данных
const updateWeatherDataInBackground = async (
  lat: number | undefined,
  lon: number | undefined,
  city: string | undefined,
  cacheKey: string,
): Promise<WeatherData> => {
  const url = city
    ? `${API_CONFIG.OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_CONFIG.OPENWEATHER_API_KEY}`
    : `${API_CONFIG.OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_CONFIG.OPENWEATHER_API_KEY}`;

  const response = await axios.get(url);
  const data = response.data;

  // Обновляем кэш
  cacheWeatherData(cacheKey, data);

  return data;
};
