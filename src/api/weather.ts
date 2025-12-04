import axios from "axios";
import { WeatherApiResult } from "./types/weather";
import type { CityConfig } from "../types";

const API_KEY = (import.meta as any).env.VITE_OPENWEATHER_KEY;

async function getWeatherByCity(city: string): Promise<WeatherApiResult> {
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  try {
    const { data } = await axios.get<WeatherApiResult>(url, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
        lang: "ru"
      }
    });

    return data;
  } catch (err: any) {
    if (err.response?.data) {
      return err.response.data as WeatherApiResult;
    }

    return {
      cod: "network_error",
      message: "Ошибка сети"
    };
  }
}

async function getWeatherByCoords(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/weather`;

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

export default { getWeatherByCity, getWeatherByCoords, getCityByCoords, getCoordsByCity };
