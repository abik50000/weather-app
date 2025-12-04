<template>
  <div class="wind-block">
  <img
    :src="windIcon"
    alt="Wind"
    class="wind-icon"
    :style="{ transform: `rotate(${windDeg}deg)` }"
  />
  <span class="wind-speed">{{ windSpeed }} m/s</span>
</div>
</template>

<script setup>
import windIcon from '../assets/wind.svg';

const props = defineProps({
  windSpeed: Number,
  windDeg: Number,
});
</script>

<style lang="scss" scoped>
.wind-block {
  display: flex;
  align-items: center;
}

.wind-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 8px;
}
</style>
