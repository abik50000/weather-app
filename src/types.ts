export interface CityConfig {
  id: string;
  name: string;
  lat: number;
  lon: number;

  temp?: number;
  description?: string;
  icon?: string;

  details?: {
    feelsLike: number;
    wind: number;
    humidity: number;
    pressure: number;
    visibility: number;
  };
}