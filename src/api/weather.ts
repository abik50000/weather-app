import axios from "axios";
import { WeatherApiResult } from "./types/weather";
import type { CityConfig } from "../types";

const API_KEY = (import.meta as any).env.VITE_OPENWEATHER_KEY;


async function getWeatherByCoords(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  return {
    "coord": {
        "lon": 69.5883,
        "lat": 42.3147
    },
    "weather": [
        {
            "id": 800,
            "main": "Clear",
            "description": "ясно",
            "icon": "01d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 10.29,
        "feels_like": 8.68,
        "temp_min": 10.29,
        "temp_max": 10.29,
        "pressure": 1025,
        "humidity": 50,
        "sea_level": 1025,
        "grnd_level": 966
    },
    "visibility": 10000,
    "wind": {
        "speed": 3,
        "deg": 45
    },
    "clouds": {
        "all": 0
    },
    "dt": 1764830440,
    "sys": {
        "type": 1,
        "id": 8824,
        "country": "KZ",
        "sunrise": 1764815650,
        "sunset": 1764848988
    },
    "timezone": 18000,
    "id": 1518980,
    "name": "Шымкент",
    "cod": 200
}


  try {
    const { data } = await axios.get(url, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
        lang: "ru"
      }
    });

    return data;
  } catch (err) {
    throw new Error("Не удалось получить погоду");
  }
}

import type { GeoResponse } from "./types/city";

async function getCityByCoords(lat: number, lon: number): Promise<CityConfig> {
  const url = `https://api.openweathermap.org/geo/1.0/reverse`;

  const { data } = await axios.get<GeoResponse>(url, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      limit: 1,
    },
  });

  if (!data.length) throw new Error("Город не найден");

  const c = data[0];

  return {
    id: `${c.lat}_${c.lon}`,
    name: c.local_names?.ru || c.local_names?.en || c.name || "Unknown",
    lat: c.lat,
    lon: c.lon,
  };
}

async function getCoordsByCity(city: string) {
  const url = "http://api.openweathermap.org/geo/1.0/direct";
  const limit = 1;

  const { data } = await axios.get(url, {
    params: {
      q: city,  // "Almaty,KZ"
      limit,
      appid: API_KEY,
    },
  });

  if (data.length === 0) throw new Error("Город не найден");

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    country: data[0].country,
  };
}

export default { getWeatherByCoords, getCityByCoords, getCoordsByCity };
