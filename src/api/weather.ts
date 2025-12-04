import axios from "axios";
import { WeatherApiResult } from "./types/weather";
import type { CityConfig } from "../types";
import type { GeoResponse } from "./types/city";

const API_KEY = (import.meta as any).env.VITE_OPENWEATHER_KEY;

async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherApiResult> {
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  try {
    const { data } = await axios.get(url, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
        lang: "en"
      }
    });

    return data;
  } catch (err) {
    throw new Error("Не удалось получить погоду");
  }
}

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

  if (!data.length) throw new Error("City not found");

  const c = data[0];

  return {
    id: `${c.lat}_${c.lon}`,
    name: c.local_names?.en || c.name || "Unknown",
    lat: c.lat,
    lon: c.lon,
  };
}

async function getCoordsByCity(city: string): Promise<CityConfig> {
  const url = "http://api.openweathermap.org/geo/1.0/direct";
  const limit = 1;

  const { data } = await axios.get(url, {
    params: {
      q: city,
      limit,
      appid: API_KEY,
    },
  });

  if (data.length === 0) throw new Error("City not found");

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    country: data[0].country,
  };
}

export default { getWeatherByCoords, getCityByCoords, getCoordsByCity };
