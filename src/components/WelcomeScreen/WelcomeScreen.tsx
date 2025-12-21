import './WelcomeScreen.css';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
import { useTemperatureUnit } from '../../contexts/TemperatureUnitContext';
import { useTheme } from '../../contexts/ThemeContext';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onSkip,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { unit, setUnit } = useTemperatureUnit();
  const { theme, setTheme } = useTheme();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else {
      onGetStarted();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        className="welcome-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className="welcome-content" variants={itemVariants}>
          <ProgressIndicator currentStep={step} totalSteps={3} />
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="welcome-icon"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🌤️
              </motion.div>
              <motion.h1
                className="welcome-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {t('welcomeTitle')}
              </motion.h1>
              <motion.p
                className="welcome-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t('welcomeDescription')}
              </motion.p>

              <motion.div
                className="welcome-features"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.h2
                  className="features-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {t('welcomeFeatures')}
                </motion.h2>
                <div className="features-list">
                  {[
                    { icon: '🌡️', text: t('feature1') },
                    { icon: '📅', text: t('feature2') },
                    { icon: '🌍', text: t('feature3') },
                    { icon: '🎨', text: t('feature4') },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="feature-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      <span className="feature-icon">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="welcome-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button
                  className="get-started-button"
                  onClick={handleNext}
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('getStarted')}
                </motion.button>
                <motion.button
                  className="skip-button"
                  onClick={onSkip}
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('skip')}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="welcome-icon"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🌍
              </motion.div>
              <motion.h1
                className="welcome-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {t('welcomeStep1')}
              </motion.h1>
              <motion.p
                className="welcome-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t('welcomeStep1Description')}
              </motion.p>

              <motion.div
                className="language-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="language-toggle-wrapper">
                  <button
                    className={`language-toggle-button ${language === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                    type="button"
                  >
                    <span className="flag">🇺🇸</span>
                    <span>English</span>
                  </button>
                  <button
                    className={`language-toggle-button ${language === 'ru' ? 'active' : ''}`}
                    onClick={() => setLanguage('ru')}
                    type="button"
                  >
                    <span className="flag">🇷🇺</span>
                    <span>Русский</span>
                  </button>
                  <div
                    className={`language-toggle-slider ${language === 'ru' ? 'slide-right' : 'slide-left'}`}
                  />
                </div>
              </motion.div>

              <motion.div
                className="welcome-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  className="get-started-button"
                  onClick={handleNext}
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('next')}
                </motion.button>
                <motion.button
                  className="skip-button"
                  onClick={onSkip}
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('skip')}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="welcome-icon"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ⚙️
              </motion.div>
              <motion.h1
                className="welcome-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {t('welcomeStep2')}
              </motion.h1>
              <motion.p
                className="welcome-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t('welcomeStep2Description')}
              </motion.p>

              <motion.div
                className="settings-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="setting-preview-item">
                  <label className="setting-preview-label">
                    {t('temperatureUnit')}
                  </label>
                  <div className="toggle-wrapper">
                    <button
                      className={`toggle-button ${unit === 'celsius' ? 'active' : ''}`}
                      onClick={() => setUnit('celsius')}
                      type="button"
                    >
                      °C
                    </button>
                    <button
                      className={`toggle-button ${unit === 'fahrenheit' ? 'active' : ''}`}
                      onClick={() => setUnit('fahrenheit')}
                      type="button"
                    >
                      °F
                    </button>
                    <div
                      className={`toggle-slider ${unit === 'fahrenheit' ? 'slide-right' : 'slide-left'}`}
                    />
                  </div>
                </div>

                <div className="setting-preview-item">
                  <label className="setting-preview-label">{t('theme')}</label>
                  <div className="toggle-wrapper">
                    <button
                      className={`toggle-button ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => setTheme('light')}
                      type="button"
                    >
                      ☀️ {t('light')}
                    </button>
                    <button
                      className={`toggle-button ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setTheme('dark')}
                      type="button"
                    >
                      🌙 {t('dark')}
                    </button>
                    <div
                      className={`toggle-slider ${theme === 'dark' ? 'slide-right' : 'slide-left'}`}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.p
                className="settings-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {t('welcomeStep2Features')}
              </motion.p>

              <motion.div
                className="welcome-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  className="get-started-button"
                  onClick={handleNext}
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('finish')}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeScreen;
