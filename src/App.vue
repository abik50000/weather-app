<template>
  <div class="ww">
    <header class="ww__header">
      <h3>Погода</h3>
      <button class="ww__gear" @click="open = !open">⚙️</button>
    </header>

    <div v-if="loading" class="ww__loading">Загрузка...</div>

    <div v-else class="ww__list">
      <WeatherCard v-for="city in cities" :key="city.id" :city="city" />
    </div>

    <SettingsPanel v-if="open" :cities="cities" @update="onConfigUpdate" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import WeatherCard from "./components/WeatherCard.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import API from "./api/weather";
import type { CityConfig } from "./types";

const STORAGE_KEY = "weather_widget_config_v1";

export default defineComponent({
  components: { WeatherCard, SettingsPanel },

  setup() {
    const cities = ref<CityConfig[]>([]);
    const loading = ref(true);
    const open = ref(false);

    /** Сохранение в localStorage */
    const save = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities.value));
    };

    /** Загрузка из localStorage */
    const load = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw);

        // Гарантируем формат массива CityConfig[]
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

    /** Загрузка погоды по координатам */
    const loadWeather = async (list: CityConfig[]) => {
      const updated = await Promise.all(
        list.map(async (c) => {
          try {
            const data = await API.getWeatherByCoords(Number(c.lat), Number(c.lon));

            return {
              ...c,
              temp: Math.round(data.main.temp),
              description: data.weather[0].description,
            };
          } catch {
            return { ...c, temp: 0, description: "Ошибка" };
          }
        })
      );

      cities.value = updated;
      save();
    };

    /** Добавление города по геолокации */
    const addByGeolocation = () => {
      if (!navigator.geolocation || cities.value.length > 0) return;

      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const city = await API.getCityByCoords(latitude, longitude);

          cities.value = [
            {
              id: city.id,
              name: city.name,
              lat: city.lat,
              lon: city.lon,
              description: "",
            },
          ];

          await loadWeather(cities.value);
        } catch (err) {
          console.error(err);
        }
      });
    };


    onMounted(async () => {
      load(); // загружаем из localStorage

      if (cities.value.length > 0) {
        // Если есть города в localStorage — подгружаем погоду
        await loadWeather(cities.value);
      } else {
        // Если нет — пробуем определить по геолокации
        addByGeolocation();
      }

      loading.value = false;
    });

    /** Обновление списка городов из SettingsPanel */
    const onConfigUpdate = async (newList: CityConfig[]) => {
      cities.value = newList;
      save();
      await loadWeather(cities.value);
      open.value = false;
    };

    return { cities, loading, open, onConfigUpdate };
  },
});
</script>


<style scoped>
.ww {
  width: 320px;
  font-family: Arial, sans-serif;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}

.ww__header {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
}

.ww__loading {
  padding: 16px;
  text-align: center;
  color: #666;
}
</style>
