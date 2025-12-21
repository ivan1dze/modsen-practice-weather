import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    searchPlaceholder: 'Search for a city...',
    weatherInformation: 'Weather Information',
    hourly: 'Hourly',
    daily: 'Daily',
    calendarEvents: 'Calendar Events',
    noEvents: 'No upcoming events',
    signIn: 'Sign In with Google',
    exit: 'Exit',
    noCitiesFound: 'No cities found',
    error: 'Error',
    timeLocale: 'en-US',
    dateLocale: 'en-US',
    settings: 'Settings',
    language: 'Language',
    temperatureUnit: 'Temperature Unit',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    blue: 'Blue',
    purple: 'Purple',
    green: 'Green',
    favoriteCities: 'Favorite Cities',
    loading: 'Loading...',
    widgetView: 'Widget View',
    fullView: 'Full View',
    noHourlyForecast: 'No hourly forecast available',
    noDailyForecast: 'No daily forecast available',
    currentLocation: 'Current location',
    welcome: 'Welcome!',
    welcomeBack: 'Welcome Back!',
    welcomeTitle: 'Welcome to Weather App',
    welcomeDescription:
      'Your personal weather assistant with calendar integration',
    welcomeFeatures: 'Features',
    feature1: 'Real-time weather forecasts',
    feature2: 'Google Calendar integration',
    feature3: 'Multiple language support',
    feature4: 'Customizable themes',
    getStarted: 'Get Started',
    skip: 'Skip',
    next: 'Next',
    finish: 'Finish',
    welcomeStep1: 'Choose Your Language',
    welcomeStep1Description:
      'Select the language you prefer for the application',
    welcomeStep2: 'Customize Your Experience',
    welcomeStep2Description:
      'Set up your preferences to get the most out of the app',
    welcomeStep2Features:
      'You can change these settings anytime in the settings menu',
  },
  ru: {
    searchPlaceholder: 'Поиск города...',
    weatherInformation: 'Информация о погоде',
    hourly: 'Почасовой',
    daily: 'Ежедневный',
    calendarEvents: 'События календаря',
    noEvents: 'Нет предстоящих событий',
    signIn: 'Войти через Google',
    exit: 'Выход',
    noCitiesFound: 'Города не найдены',
    error: 'Ошибка',
    timeLocale: 'ru-RU',
    dateLocale: 'ru-RU',
    settings: 'Настройки',
    language: 'Язык',
    temperatureUnit: 'Единицы температуры',
    theme: 'Тема',
    light: 'Светлая',
    dark: 'Темная',
    blue: 'Синяя',
    purple: 'Фиолетовая',
    green: 'Зеленая',
    favoriteCities: 'Избранные города',
    loading: 'Загрузка...',
    widgetView: 'Виджет',
    fullView: 'Полный вид',
    noHourlyForecast: 'Нет почасового прогноза',
    noDailyForecast: 'Нет ежедневного прогноза',
    currentLocation: 'Текущее местоположение',
    welcome: 'Добро пожаловать!',
    welcomeBack: 'С возвращением!',
    welcomeTitle: 'Добро пожаловать в Weather App',
    welcomeDescription: 'Ваш личный помощник погоды с интеграцией календаря',
    welcomeFeatures: 'Возможности',
    feature1: 'Прогноз погоды в реальном времени',
    feature2: 'Интеграция с Google Calendar',
    feature3: 'Поддержка нескольких языков',
    feature4: 'Настраиваемые темы',
    getStarted: 'Начать',
    skip: 'Пропустить',
    next: 'Далее',
    finish: 'Завершить',
    welcomeStep1: 'Выберите Язык',
    welcomeStep1Description: 'Выберите предпочитаемый язык для приложения',
    welcomeStep2: 'Настройте Опыт',
    welcomeStep2Description:
      'Настройте свои предпочтения для максимального удобства',
    welcomeStep2Features:
      'Вы можете изменить эти настройки в любое время в меню настроек',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const detectLanguage = (): Language => {
  const saved = localStorage.getItem('language');
  if (saved && (saved === 'en' || saved === 'ru')) {
    return saved as Language;
  }

  // Определяем язык браузера
  const browserLang =
    navigator.language ||
    (typeof navigator !== 'undefined' &&
      'userLanguage' in navigator &&
      (navigator as { userLanguage?: string }).userLanguage) ||
    'en';
  if (browserLang.startsWith('ru')) {
    return 'ru';
  }
  return 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(detectLanguage);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
