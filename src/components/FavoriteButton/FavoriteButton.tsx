import './FavoriteButton.css';

import { motion } from 'framer-motion';
import React from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onClick,
}) => {
  return (
    <motion.button
      className={`favorite-button ${isFavorite ? 'active' : ''}`}
      onClick={onClick}
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        scale: isFavorite ? [1, 1.2, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        animate={{ rotate: isFavorite ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </motion.span>
    </motion.button>
  );
};

export default FavoriteButton;
