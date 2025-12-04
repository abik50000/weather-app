<template>
  <div class="p-4 bg-gray-50 rounded-lg shadow-md w-96">
    <h2 class="text-lg font-bold mb-4">Настройки городов</h2>

    <div class="flex mb-4">
      <input
        v-model="newCity"
        placeholder="Добавить город"
        class="flex-1 p-2 border rounded-l"
      />
      <button @click="addCity" class="bg-blue-600 text-white px-4 rounded-r">
        +
      </button>
    </div>

    <draggable v-model="cities" handle=".handle" item-key="id">
      <template #item="{ element, index }">
        <div class="flex items-center justify-between mb-2 p-2 bg-white rounded shadow">
          <span class="handle cursor-move mr-2">☰</span>
          <span class="flex-1">{{ element.name }}</span>
          <button @click="removeCity(index)" class="text-red-500 font-bold">✕</button>
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

onMounted(() => {
  const saved = localStorage.getItem("weather_cities");
  if (saved) cities.value = JSON.parse(saved);
});

watch(cities, (val) => {
  localStorage.setItem("weather_cities", JSON.stringify(val));
}, { deep: true });

function addCity() {
  if (!newCity.value.trim()) return;
  cities.value.push({ id: Date.now(), name: newCity.value.trim() });
  newCity.value = "";
}

function removeCity(index) {
  cities.value.splice(index, 1);
}
</script>

<style scoped>
.draggable-fallback {
  background-color: #f0f0f0;
}
</style>
