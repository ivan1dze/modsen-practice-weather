// Словарь переводов описаний погоды
const weatherDescriptions: Record<string, { en: string; ru: string }> = {
  'clear sky': { en: 'Clear sky', ru: 'Ясное небо' },
  'few clouds': { en: 'Few clouds', ru: 'Небольшая облачность' },
  'scattered clouds': { en: 'Scattered clouds', ru: 'Рассеянные облака' },
  'broken clouds': { en: 'Broken clouds', ru: 'Переменная облачность' },
  'overcast clouds': { en: 'Overcast clouds', ru: 'Пасмурно' },
  'shower rain': { en: 'Shower rain', ru: 'Ливень' },
  'light rain': { en: 'Light rain', ru: 'Небольшой дождь' },
  'moderate rain': { en: 'Moderate rain', ru: 'Умеренный дождь' },
  'heavy intensity rain': { en: 'Heavy rain', ru: 'Сильный дождь' },
  'very heavy rain': { en: 'Very heavy rain', ru: 'Очень сильный дождь' },
  'extreme rain': { en: 'Extreme rain', ru: 'Экстремальный дождь' },
  'freezing rain': { en: 'Freezing rain', ru: 'Ледяной дождь' },
  'light intensity shower rain': {
    en: 'Light shower rain',
    ru: 'Небольшой ливневый дождь',
  },
  'heavy intensity shower rain': {
    en: 'Heavy shower rain',
    ru: 'Сильный ливневый дождь',
  },
  'ragged shower rain': { en: 'Ragged shower rain', ru: 'Неровный ливень' },
  'thunderstorm with light rain': {
    en: 'Thunderstorm with light rain',
    ru: 'Гроза с небольшим дождём',
  },
  'thunderstorm with rain': {
    en: 'Thunderstorm with rain',
    ru: 'Гроза с дождём',
  },
  'thunderstorm with heavy rain': {
    en: 'Thunderstorm with heavy rain',
    ru: 'Гроза с сильным дождём',
  },
  'light thunderstorm': { en: 'Light thunderstorm', ru: 'Слабая гроза' },
  thunderstorm: { en: 'Thunderstorm', ru: 'Гроза' },
  'heavy thunderstorm': { en: 'Heavy thunderstorm', ru: 'Сильная гроза' },
  'ragged thunderstorm': {
    en: 'Ragged thunderstorm',
    ru: 'Неровная гроза',
  },
  'thunderstorm with light drizzle': {
    en: 'Thunderstorm with light drizzle',
    ru: 'Гроза с лёгкой моросью',
  },
  'thunderstorm with drizzle': {
    en: 'Thunderstorm with drizzle',
    ru: 'Гроза с моросью',
  },
  'thunderstorm with heavy drizzle': {
    en: 'Thunderstorm with heavy drizzle',
    ru: 'Гроза с сильной моросью',
  },
  'light intensity drizzle': {
    en: 'Light drizzle',
    ru: 'Лёгкая морось',
  },
  drizzle: { en: 'Drizzle', ru: 'Морось' },
  'heavy intensity drizzle': {
    en: 'Heavy drizzle',
    ru: 'Сильная морось',
  },
  'light intensity drizzle rain': {
    en: 'Light drizzle rain',
    ru: 'Лёгкий моросящий дождь',
  },
  'drizzle rain': { en: 'Drizzle rain', ru: 'Моросящий дождь' },
  'heavy intensity drizzle rain': {
    en: 'Heavy drizzle rain',
    ru: 'Сильный моросящий дождь',
  },
  'shower rain and drizzle': {
    en: 'Shower rain and drizzle',
    ru: 'Ливень и морось',
  },
  'heavy shower rain and drizzle': {
    en: 'Heavy shower rain and drizzle',
    ru: 'Сильный ливень и морось',
  },
  'shower drizzle': { en: 'Shower drizzle', ru: 'Ливневая морось' },
  'light snow': { en: 'Light snow', ru: 'Небольшой снег' },
  snow: { en: 'Snow', ru: 'Снег' },
  'heavy snow': { en: 'Heavy snow', ru: 'Сильный снег' },
  sleet: { en: 'Sleet', ru: 'Снег с дождём' },
  'light shower sleet': {
    en: 'Light shower sleet',
    ru: 'Небольшой ливневый снег с дождём',
  },
  'shower sleet': { en: 'Shower sleet', ru: 'Ливневый снег с дождём' },
  'light rain and snow': {
    en: 'Light rain and snow',
    ru: 'Небольшой дождь со снегом',
  },
  'rain and snow': { en: 'Rain and snow', ru: 'Дождь со снегом' },
  'light shower snow': {
    en: 'Light shower snow',
    ru: 'Небольшой ливневый снег',
  },
  'shower snow': { en: 'Shower snow', ru: 'Ливневый снег' },
  'heavy shower snow': {
    en: 'Heavy shower snow',
    ru: 'Сильный ливневый снег',
  },
  mist: { en: 'Mist', ru: 'Дымка' },
  smoke: { en: 'Smoke', ru: 'Дым' },
  haze: { en: 'Haze', ru: 'Мгла' },
  'sand/dust whirls': { en: 'Sand/dust whirls', ru: 'Песчаные вихри' },
  fog: { en: 'Fog', ru: 'Туман' },
  sand: { en: 'Sand', ru: 'Песок' },
  dust: { en: 'Dust', ru: 'Пыль' },
  'volcanic ash': { en: 'Volcanic ash', ru: 'Вулканический пепел' },
  squalls: { en: 'Squalls', ru: 'Шквалы' },
  tornado: { en: 'Tornado', ru: 'Торнадо' },
};

export const translateWeatherDescription = (
  description: string,
  language: 'en' | 'ru',
): string => {
  const normalized = description.toLowerCase().trim();
  const translation = weatherDescriptions[normalized];

  if (translation) {
    return translation[language];
  }

  // Если точного совпадения нет, пытаемся найти частичное совпадение
  for (const [key, value] of Object.entries(weatherDescriptions)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value[language];
    }
  }

  // Если перевода нет, возвращаем оригинал с заглавной буквы
  return description.charAt(0).toUpperCase() + description.slice(1);
};
