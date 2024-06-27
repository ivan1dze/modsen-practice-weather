export interface WeatherProps {
  city?: string;
}

export interface WeatherData {
  list: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
  }[];
}
