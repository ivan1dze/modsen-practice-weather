import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App/App';
import { LanguageProvider } from './contexts/LanguageContext';
import { TemperatureUnitProvider } from './contexts/TemperatureUnitContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WeatherProvider } from './contexts/WeatherContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <TemperatureUnitProvider>
          <WeatherProvider>
            <App />
          </WeatherProvider>
        </TemperatureUnitProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
