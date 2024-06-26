export interface WeatherProps {
  city?: string;
}

export interface WeatherData {
  list: Forecast[];
}

export interface Forecast {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}
