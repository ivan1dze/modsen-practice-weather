import axios from 'axios';

const API_KEY = 'a704542036280897ad1a6a2bc5869897';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (latitude: number, longitude: number) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: API_KEY,
      units: 'metric',
    },
  });

  return response.data;
};
