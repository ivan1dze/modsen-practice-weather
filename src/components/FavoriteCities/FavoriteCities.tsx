import './FavoriteCities.css';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
import { useFavorites } from '../../hooks/useFavorites';

interface FavoriteCitiesProps {
  onCitySelect: (city: string) => void;
  currentCity?: string;
}

const FavoriteCities: React.FC<FavoriteCitiesProps> = ({
  onCitySelect,
  currentCity,
}) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { t } = useLanguage();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="favorite-cities">
      <h3 className="favorites-title">{t('favoriteCities')}</h3>
      <div className="favorites-list">
        <AnimatePresence mode="popLayout">
          {favorites.map((favorite, index) => (
            <motion.div
              key={favorite.name}
              className={`favorite-city-item ${currentCity === favorite.name ? 'active' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCitySelect(favorite.name)}
            >
              <span className="favorite-city-name">{favorite.name}</span>
              <motion.button
                className="favorite-remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(favorite.name);
                }}
                type="button"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FavoriteCities;
