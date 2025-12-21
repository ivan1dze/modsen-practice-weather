const CACHE_PREFIX = 'weather_cache_';
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут
const STALE_CACHE_DURATION = 30 * 60 * 1000; // 30 минут - для фонового обновления

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export const cacheWeatherData = <T>(key: string, data: T): void => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedWeatherData = <T>(key: string): T | null => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cachedStr = localStorage.getItem(cacheKey);
    if (!cachedStr) return null;

    const cached: CachedData<T> = JSON.parse(cachedStr);
    const now = Date.now();
    const age = now - cached.timestamp;

    // Если кэш слишком старый, удаляем его
    if (age > STALE_CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return cached.data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

export const isCacheStale = (key: string): boolean => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cachedStr = localStorage.getItem(cacheKey);
    if (!cachedStr) return true;

    const cached: CachedData<unknown> = JSON.parse(cachedStr);
    const now = Date.now();
    const age = now - cached.timestamp;

    // Кэш считается устаревшим, если ему больше CACHE_DURATION
    return age > CACHE_DURATION;
  } catch {
    return true;
  }
};

export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const clearCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
