import './SettingsModal.css';

import { motion } from 'framer-motion';
import React from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
import { useTemperatureUnit } from '../../contexts/TemperatureUnitContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const { unit, setUnit } = useTemperatureUnit();
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h2>{t('settings')}</h2>
          <button className="close-button" onClick={onClose} type="button">
            ✕
          </button>
        </div>
        <div className="settings-modal-content">
          <div className="setting-item">
            <label className="setting-label">{t('language')}</label>
            <div className="toggle-wrapper">
              <button
                className={`toggle-button ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                type="button"
              >
                <span className="flag">🇺🇸</span>
                <span>EN</span>
              </button>
              <button
                className={`toggle-button ${language === 'ru' ? 'active' : ''}`}
                onClick={() => setLanguage('ru')}
                type="button"
              >
                <span className="flag">🇷🇺</span>
                <span>RU</span>
              </button>
              <div
                className={`toggle-slider ${language === 'ru' ? 'slide-right' : 'slide-left'}`}
              />
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">{t('temperatureUnit')}</label>
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

          <div className="setting-item">
            <label className="setting-label">{t('theme')}</label>
            <div className="theme-grid">
              {[
                { value: 'light', icon: '☀️', label: t('light') },
                { value: 'dark', icon: '🌙', label: t('dark') },
                { value: 'blue', icon: '💙', label: t('blue') },
                { value: 'purple', icon: '💜', label: t('purple') },
                { value: 'green', icon: '💚', label: t('green') },
              ].map((themeOption) => (
                <motion.button
                  key={themeOption.value}
                  className={`theme-option ${theme === themeOption.value ? 'active' : ''}`}
                  onClick={() =>
                    setTheme(
                      themeOption.value as
                        | 'light'
                        | 'dark'
                        | 'blue'
                        | 'purple'
                        | 'green',
                    )
                  }
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="theme-option-icon">{themeOption.icon}</span>
                  <span className="theme-option-label">
                    {themeOption.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
