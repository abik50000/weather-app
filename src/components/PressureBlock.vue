<template>
  <div class="pressure-block">
  <img
    :src="pressureIcon"
    alt="Pressure"
    class="pressure-icon"
  />
  <span class="pressure-value">{{ pressure }} hPa</span>
</div>
</template>

<script setup>
import pressureIcon from '../assets/pressure.svg';

const props = defineProps({
  pressure: Number,
});
</script>

<style lang="scss" scoped>
.pressure-block {
  display: flex;
  align-items: center;
}

.pressure-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
</style>
