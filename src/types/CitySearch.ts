export interface CityOption {
  value: string;
  label: string;
}

export interface City {
  name: string;
  sys: {
    country: string;
  };
}
