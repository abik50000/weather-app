<template>
  <div class="settings-panel">
    <div class="settings-header">
      <h2>Settings</h2>
      <button class="close-btn" @click="closeSettings">✕</button>
    </div>

    <draggable v-model="cities" handle=".handle" item-key="id" @end="onDragEnd">
      <template #item="{ element, index }">
        <div :key="element.id" class="city-item">
          <span class="handle">☰</span>
          <span class="city-name">{{ element.name }}, {{ element.country }}</span>
          <button @click="removeCity(index)" class="remove-btn"><img class="remove-icon" :src="trashIcon"
              alt="Remove" /></button>
        </div>
      </template>
    </draggable>

    <div class="add-city">
      <label>Add location</label>
      <div>
        <input v-model="newCity" placeholder="New York..." class="city-input" />
        <button @click="addCity" class="add-btn">+</button>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import draggable from "vuedraggable";
import trashIcon from "../assets/trash.svg";
import API from "../api/weather";
import type { CityConfig } from "../types";

const newCity = ref("");
const cities = ref<CityConfig[]>([]);
const emit = defineEmits(['update', 'close']);

const STORAGE_KEY = "weather_widget_config_v1";

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) cities.value = JSON.parse(saved);
});

watch(cities, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
}, { deep: true });

async function addCity() {
  const cityName = newCity.value.trim();
  if (!cityName) return;

  try {
    const coords = await API.getCoordsByCity(cityName);

    // Добавляем город с координатами
    cities.value.push({
      id: crypto.randomUUID(),
      name: coords.name,
      lat: coords.lat,
      lon: coords.lon,
      country: coords.country,
      description: "",
    });

    newCity.value = "";
  } catch (err: any) {
    console.error(err.message || err);
    alert("Город не найден");
  }
}

function onDragEnd() {
  cities.value = [...cities.value];
}

function removeCity(index: number) {
  cities.value.splice(index, 1);
}

function closeSettings() {
  emit('update', cities.value);
  emit('close');
}
</script>

<style scoped lang="scss">
.draggable-fallback {
  background-color: #f0f0f0;
}

.settings-panel {
  padding: 1rem;
  position: absolute;
  width: 100%;
  top: 0;
  right: 0;
  z-index: 50;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h2 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1rem;
      cursor: pointer;
    }
  }

  .add-city {
    margin-top: 2rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    &>div {
      display: flex;
    }

    .city-input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-right: none;
      border-radius: 0.25rem 0 0 0.25rem;
      outline: none;
    }

    .add-btn {
      background-color: #e1e3e6;
      padding: 0 1rem;
      border-radius: 0 0.25rem 0.25rem 0;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
    }


  }

  .city-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    .handle {
      cursor: move;
      margin-right: 0.5rem;
    }

    .city-name {
      flex: 1;
      font-size: 0.85rem;
    }

    .remove-btn {
      font-weight: 700;
      background: none;
      border: none;
      cursor: pointer;
      filter: grayscale(1);
      transition: all 0.2s ease-in-out;

      &:hover {
        filter: none;
      }

    }

    .remove-icon {
      width: 22px;
      height: 22px;
    }
  }
}
</style>