<template>
  <div class="ww">
    <header class="ww__header">
      <h3>Weather</h3>
      <button class="ww__cog" @click="open = !open"><img class="cog-icon" :src="cogIcon" alt="Gear" /></button>
    </header>

    <div v-if="loading" class="ww__loading">Loading...</div>

    <div v-else class="ww__list">
      <WeatherCard v-for="city in cities" :key="city.id" :city="city.name" :temp="city.weather?.main?.temp"
        :description="city.description" :feelsLike="city.weather?.main?.feels_like"
        :windSpeed="city.weather?.wind?.speed" :windDeg="city.weather?.wind?.deg"
        :humidity="city.weather?.main?.humidity" :pressure="city.weather?.main?.pressure"
        :visibility="city.weather?.visibility" :icon="city.weather?.weather[0]?.icon" />
    </div>

    <SettingsPanel v-if="open" :cities="cities" @update="onConfigUpdate" @close="open = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import WeatherCard from "./components/WeatherCard.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import API from "./api/weather";
import type { CityConfig } from "./types";
import cogIcon from './assets/cog.svg';

const STORAGE_KEY = "weather_widget_config_v1";

const cities = ref<CityConfig[]>([]);
const loading = ref(true);
const open = ref(false);

/** Save to localStorage */
const save = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities.value));
};

/** Load from localStorage */
const load = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    cities.value = parsed.map((c: any) => ({
      id: c.id,
      name: c.name,
      lat: c.lat,
      lon: c.lon,
      temp: c.temp ?? null,
      description: c.description ?? "",
    }));
  } catch {
    cities.value = [];
  }
};

/** Load weather by coords */
const loadWeather = async (list: CityConfig[]) => {
  const updated = await Promise.all(
    list.map(async (c) => {
      try {
        const data = await API.getWeatherByCoords(Number(c.lat), Number(c.lon));
        return { ...c, temp: Math.round(data.main.temp), description: data.weather[0].description, weather: data };
      } catch {
        return { ...c, temp: 0, description: "Ошибка" };
      }
    })
  );

  cities.value = updated;
  save();
};

/** Add city by geolocation */
const addByGeolocation = () => {
  if (!navigator.geolocation || cities.value.length > 0) return;

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    try {
      const city = await API.getCityByCoords(latitude, longitude);
      const newCity: CityConfig = { id: city.id, name: city.name, lat: city.lat, lon: city.lon, description: "" };
      cities.value = [newCity];
      save();
      await loadWeather(cities.value);
    } catch (err) {
      console.error(err);
    }
  });
};

onMounted(async () => {
  load();
  if (cities.value.length > 0) await loadWeather(cities.value);
  else addByGeolocation();
  loading.value = false;
});

/** Update list of cities from SettingsPanel */
const onConfigUpdate = async (newList: CityConfig[]) => {
  cities.value = newList;
  save();
  await loadWeather(cities.value);
  open.value = false;
};
</script>


<style scoped lang="scss">
.ww {
  width: 300px;
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  position: relative;
}

.ww__header {
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  align-items: center;
  font-size: 1rem;
  border-bottom: 1px solid #f2f2f2;

  h3 {
     font-size: 1rem;
     font-weight: 600;
  }
}

.ww__loading {
  padding: 16px;
  text-align: center;
  color: #666;
}

.ww__cog {
  border: 0;
  border-radius: 0.5rem;
  padding: 0.25rem 0.4rem;
  display:flex;
  align-items: center;
}

.cog-icon {
  width: 24px;
  height: 24px;
}
</style>
