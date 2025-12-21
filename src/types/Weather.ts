export interface WeatherProps {
  city?: string;
}

export interface WeatherForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like?: number;
    temp_min?: number;
    temp_max?: number;
    pressure?: number;
    humidity?: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds?: {
    all: number;
  };
  wind?: {
    speed: number;
    deg: number;
  };
  visibility?: number;
  dt_txt?: string;
}

export interface CityInfo {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population?: number;
  timezone?: number;
  sunrise?: number;
  sunset?: number;
}

export interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecastItem[];
  city: CityInfo;
}
