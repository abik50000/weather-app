<template>
  <div class="settings-panel">
    <div class="settings-header">
      <h2>Настройки городов</h2>
      <button class="close-btn" @click="closeSettings">x</button>
    </div>

    <div class="add-city">
      <input v-model="newCity" placeholder="Добавить город" class="city-input" />
      <button @click="addCity" class="add-btn">+</button>
    </div>

    <draggable v-model="cities" handle=".handle" item-key="id" @end="onDragEnd">
      <template #item="{ element, index }">
        <div :key="element.id" class="city-item">
          <span class="handle">☰</span>
          <span class="city-name">{{ element.name }}</span>
          <button @click="removeCity(index)" class="remove-btn">✕</button>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import draggable from "vuedraggable";

const newCity = ref("");
const cities = ref([]);

const emit = defineEmits(['update', 'close']);

function closeSettings() {
  emit('close'); // <-- это вызовет @close в родителе
}

onMounted(() => {
  const saved = localStorage.getItem("weather_cities");
  if (saved) cities.value = JSON.parse(saved);
});

watch(cities, (val) => {
  localStorage.setItem("weather_cities", JSON.stringify(val));
}, { deep: true });

function addCity() {
  if (!newCity.value.trim()) return;
  cities.value.push({ id: crypto.randomUUID(), name: newCity.value.trim() });
  newCity.value = "";
}

function onDragEnd() {
  // Форсируем Vue обновить реактивность
  cities.value = [...cities.value];
}

function removeCity(index) {
  cities.value.splice(index, 1);
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
      font-size: 1.125rem; // text-lg
      font-weight: 700; // font-bold
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1rem;
      cursor: pointer;
    }
  }

  .add-city {
    display: flex;
    margin-bottom: 1rem;

    .city-input {
      flex: 1;
      padding: 0.5rem; // p-2
      border: 1px solid #d1d5db; // border-gray-300
      border-right: none;
      border-radius: 0.25rem 0 0 0.25rem; // rounded-l
      outline: none;
    }

    .add-btn {
      background-color: #2563eb; // bg-blue-600
      color: #fff;
      padding: 0 1rem; // px-4
      border-radius: 0 0.25rem 0.25rem 0; // rounded-r
      border: none;
      cursor: pointer;
    }
  }

  .city-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem; // mb-2
    padding: 0.5rem; // p-2
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    .handle {
      cursor: move;
      margin-right: 0.5rem;
    }

    .city-name {
      flex: 1;
    }

    .remove-btn {
      color: #ef4444; // text-red-500
      font-weight: 700;
      background: none;
      border: none;
      cursor: pointer;
    }
  }
}
</style>