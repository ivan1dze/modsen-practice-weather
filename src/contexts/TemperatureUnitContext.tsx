import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface TemperatureUnitContextType {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  convertTemperature: (celsius: number) => number;
  getUnitSymbol: () => string;
}

const TemperatureUnitContext = createContext<
  TemperatureUnitContextType | undefined
>(undefined);

export const TemperatureUnitProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem('temperatureUnit');
    return (saved as TemperatureUnit) || 'celsius';
  });

  useEffect(() => {
    localStorage.setItem('temperatureUnit', unit);
  }, [unit]);

  const convertTemperature = (celsius: number): number => {
    if (unit === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const getUnitSymbol = (): string => {
    return unit === 'fahrenheit' ? '°F' : '°C';
  };

  return (
    <TemperatureUnitContext.Provider
      value={{ unit, setUnit, convertTemperature, getUnitSymbol }}
    >
      {children}
    </TemperatureUnitContext.Provider>
  );
};

export const useTemperatureUnit = (): TemperatureUnitContextType => {
  const context = useContext(TemperatureUnitContext);
  if (!context) {
    throw new Error(
      'useTemperatureUnit must be used within TemperatureUnitProvider',
    );
  }
  return context;
};
