import './WelcomeBackScreen.css';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface WelcomeBackScreenProps {
  onContinue: () => void;
}

const WelcomeBackScreen: React.FC<WelcomeBackScreenProps> = ({
  onContinue,
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) {
      const timer = setTimeout(() => {
        onContinue();
      }, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, onContinue]);

  return (
    <AnimatePresence onExitComplete={onContinue}>
      {show && (
        <motion.div
          className={`welcome-back-screen ${theme}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <motion.div
            className="welcome-back-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className="welcome-back-icon"
              animate={{
                rotate: [0, 20, -20, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              👋
            </motion.div>
            <motion.h1
              className="welcome-back-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {t('welcomeBack')}
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBackScreen;
