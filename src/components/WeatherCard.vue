<template>
  <div class="weather-card">
    <h3 class="city">{{ city }}</h3>

    <div class="temp-block">
      <img v-if="iconUrl" class="icon" :src="iconUrl" :alt="`Weather icon for ${city}`" />
      <span class="temp">{{ temp }}°C</span>
    </div>

    <p class="desc">{{ description }}</p>

    <div class="details">
      <div>
        <span class="label">Feels like:</span> {{ feelsLike }}°C
      </div>
      <div>
        <span class="label">Wind:</span> {{ wind }} m/s
      </div>
      <div>
        <span class="label">Humidity:</span> {{ humidity }}%
      </div>
      <div>
        <span class="label">Pressure:</span> {{ pressure }} hPa
      </div>
      <div>
        <span class="label">Visibility:</span> {{ visibility }} km
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  city: String,
  temp: Number,
  description: String,
  feelsLike: Number,
  wind: Number,
  humidity: Number,
  pressure: Number,
  visibility: Number,
  icon: { type: String, default: undefined }, // openweathermap icon code
});

const iconUrl = props.icon ? `https://openweathermap.org/img/wn/${props.icon}@2x.png` : '';
</script>

<style lang="scss" scoped>
.weather-card {
  width: 260px;
  background: #fff;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  .city {
    font-weight: 700;
    font-size: 18px;
  }

  .temp-block {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      width: 45px;
      height: 45px;
      margin-right: 8px;
    }

    .temp {
      font-size: 32px;
      font-weight: 700;
    }
  }

  .desc {
    margin-top: 4px;
    font-size: 14px;
    color: #666;
    text-transform: capitalize;
  }

  .details {
    margin-top: 14px;
    font-size: 13px;
    color: #444;
    text-align: left;

    .label {
      font-weight: 600;
    }

    div {
      margin-bottom: 4px;
    }
  }
}
</style>
