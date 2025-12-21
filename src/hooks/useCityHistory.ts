import { useEffect, useState } from 'react';

const HISTORY_KEY = 'citySearchHistory';
const MAX_HISTORY_ITEMS = 5;

export interface CityHistoryItem {
  name: string;
  timestamp: number;
}

export const useCityHistory = () => {
  const [history, setHistory] = useState<CityHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = (cityName: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.name !== cityName);
      const newHistory = [
        { name: cityName, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  return { history, addToHistory, clearHistory };
};
