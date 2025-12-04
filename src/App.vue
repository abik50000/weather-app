<template>
  <div class="ww">
    <header class="ww__header">
      <h3>Weather</h3>
      <button class="ww__cog" @click="open = !open"><img class="cog-icon" :src="cogIcon" alt="Gear" /></button>
    </header>

    <div v-if="loading" class="ww__loading">Loading...</div>

    <div v-else class="ww__list">
      <WeatherCard v-for="city in cities" :key="city.id" :city="city.name" :country="city.country"
        :temp="round(city.weather?.main?.temp)" :description="city.description"
        :feelsLike="round(city.weather?.main?.feels_like)" :windSpeed="city.weather?.wind?.speed"
        :windDeg="city.weather?.wind?.deg" :humidity="city.weather?.main?.humidity"
        :pressure="city.weather?.main?.pressure" :visibility="city.weather?.visibility"
        :icon="city.weather?.weather?.[0]?.icon" />
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

onMounted(async () => {
  load();

  if (cities.value.length > 0) {
    const updated = await loadWeather(cities.value);
    cities.value = updated; // ← обязательно присвоить!
    save();
  } else {
    addByGeolocation();
  }

  loading.value = false;
});

/** Update list of cities from SettingsPanel */
const onConfigUpdate = async (newList: CityConfig[]) => {
  loading.value = true; // можно показать спиннер
  try {
    const updated = await loadWeather(newList); // возвращает массив с icon
    cities.value = updated; // теперь icon уже есть
    save();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    open.value = false;
  }
};

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
      country: c.country ?? "",
    }));
  } catch {
    cities.value = [];
  }
};

function round(num: number | undefined) {
  return Math.round(num ?? 0);
}

/** Load weather by coords */
const loadWeather = async (list: CityConfig[]) => {
  const updated = await Promise.all(
    list.map(async (c) => {
      try {
        const data = await API.getWeatherByCoords(Number(c.lat), Number(c.lon));
        return {
          ...c,
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          weather: data
        };
      } catch {
        return { ...c, temp: 0, description: "Ошибка", icon: '01d', weather: null };
      }
    })
  );
  return updated;
};

/** Add city by geolocation */
const addByGeolocation = () => {
  if (!navigator.geolocation || cities.value.length > 0) return;

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    try {
      const city = await API.getCityByCoords(latitude, longitude);
      const newCity: CityConfig = {
        id: city.id,
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        description: "",
        country: city.country
      };
      const updated = await loadWeather([newCity]); // загружаем погоду
      cities.value = updated; // ← присваиваем обновлённый массив
      save();
    } catch (err) {
      console.error(err);
    }
  });
};

</script>


<style scoped lang="scss">
* {
  font-family: 'Inter', sans-serif;
}

.ww {
  width: 260px;
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
  display: flex;
  align-items: center;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}

.cog-icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
