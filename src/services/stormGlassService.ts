import axios from 'axios';

const API_KEY = '715ffdb4-2d6d-11ef-aa85-0242ac130004-715ffe36-2d6d-11ef-aa85-0242ac130004';
const BASE_URL = 'https://api.stormglass.io/v2';

export const getWeatherData = async (latitude: number, longitude: number) => {
  const response = await axios.get(`${BASE_URL}/weather/point`, {
    params: {
      lat: latitude,
      lng: longitude,
      params: 'airTemperature',
      source: 'sg',
    },
    headers: {
      Authorization: API_KEY,
    },
  });

  return response.data;
};
