import './ProgressIndicator.css';

import { motion } from 'framer-motion';
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-indicator">
      <div className="progress-steps">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`progress-step ${index < currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}
          >
            <motion.div
              className="progress-step-circle"
              initial={{ scale: 0.8 }}
              animate={{
                scale: index <= currentStep ? 1 : 0.8,
                backgroundColor:
                  index < currentStep
                    ? 'rgba(255, 255, 255, 0.9)'
                    : index === currentStep
                      ? 'rgba(255, 255, 255, 0.6)'
                      : 'rgba(255, 255, 255, 0.2)',
              }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? '✓' : index + 1}
            </motion.div>
            {index < totalSteps - 1 && (
              <motion.div
                className="progress-step-line"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: index < currentStep ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            )}
          </div>
        ))}
      </div>
      <motion.div
        className="progress-bar"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ProgressIndicator;
