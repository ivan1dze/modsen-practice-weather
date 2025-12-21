import './CurrentCity.css';

import { motion } from 'framer-motion';
import React from 'react';

import { useFavorites } from '../../hooks/useFavorites';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

interface CurrentCityProps {
  city: string;
}

const CurrentCity: React.FC<CurrentCityProps> = ({ city }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <motion.div
      className="current-city"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2>
        <span className="material-symbols-outlined">near_me</span>
        {city}
      </h2>
      {city && city !== 'Loading...' && (
        <FavoriteButton
          isFavorite={isFavorite(city)}
          onClick={() => toggleFavorite(city)}
        />
      )}
    </motion.div>
  );
};

export default CurrentCity;
