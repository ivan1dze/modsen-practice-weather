import React, { createContext, ReactNode, useContext, useState } from 'react';

type WeatherClass = 'clear' | 'cloud' | 'rain' | 'default';

interface WeatherContextType {
  weatherClass: WeatherClass;
  setWeatherClass: (weatherClass: WeatherClass) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [weatherClass, setWeatherClass] = useState<WeatherClass>('default');

  return (
    <WeatherContext.Provider value={{ weatherClass, setWeatherClass }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherContext = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within WeatherProvider');
  }
  return context;
};
