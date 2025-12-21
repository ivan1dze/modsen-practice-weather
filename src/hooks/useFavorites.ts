import { useEffect, useState } from 'react';

const FAVORITES_KEY = 'favoriteCities';
const MAX_FAVORITES = 5;

export interface FavoriteCity {
  name: string;
  timestamp: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addFavorite = (cityName: string) => {
    setFavorites((prev) => {
      const filtered = prev.filter((fav) => fav.name !== cityName);
      const newFavorites = [
        { name: cityName, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_FAVORITES);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (cityName: string) => {
    setFavorites((prev) => {
      const filtered = prev.filter((fav) => fav.name !== cityName);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
      return filtered;
    });
  };

  const isFavorite = (cityName: string): boolean => {
    return favorites.some((fav) => fav.name === cityName);
  };

  const toggleFavorite = (cityName: string) => {
    if (isFavorite(cityName)) {
      removeFavorite(cityName);
    } else {
      addFavorite(cityName);
    }
  };

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
};
