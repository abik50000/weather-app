export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };

  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];

  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };

  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };

  visibility: number;

  clouds?: {
    all: number;
  };

  sys?: {
    country: string;
    sunrise: number;
    sunset: number;
  };

  timezone?: number;
  id: number;
  name: string;
  base?: string;
  cod?: number;
}

export interface WeatherError {
  cod: number | string;
  message: string;
}

export function isWeatherResponse(data: any): data is WeatherResponse {
  return data && typeof data === "object" && "main" in data;
}

export type WeatherApiResult = WeatherResponse | WeatherError;
