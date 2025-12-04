<template>
  <div class="flex flex-wrap gap-4">
   <WeatherCard
      v-for="city in cities"
      :key="city.id"
      :city="city.name"
      :temp="city.temp"
      :description="city.description"
      :icon="city.icon"
    />
  </div>
</template>

<script setup lang="ts">
import WeatherCard from "./WeatherCard.vue";
import type { CityConfig } from "../types";

defineProps<{ cities: CityConfig[] }>();
</script>