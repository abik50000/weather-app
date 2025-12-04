import { WeatherResponse } from "./api/types/weather";

export interface CityConfig {
  id: string;
  name: string;
  lat: number;
  lon: number;

  description?: string;

  weather?: WeatherResponse;
}