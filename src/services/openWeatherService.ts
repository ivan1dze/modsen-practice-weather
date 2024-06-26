import axios from 'axios';

const API_KEY = 'a704542036280897ad1a6a2bc5869897';

export const getWeatherData = async (
  lat?: number,
  lon?: number,
  city?: string
) => {
  const url = city
    ? `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    : `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  const response = await axios.get(url);
  return response.data;
};
