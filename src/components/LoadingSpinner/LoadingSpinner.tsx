import './LoadingSpinner.css';

import { motion } from 'framer-motion';
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text,
}) => {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="spinner-wrapper">
        <motion.div
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </motion.div>
      </div>
      {text && (
        <motion.p
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
