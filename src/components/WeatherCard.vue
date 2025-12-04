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

      <div class="flex-between">
        <WindBlock :windSpeed="windSpeed" :windDeg="windDeg" />
        <PressureBlock :pressure="pressure" />
      </div>

      <div class="flex-between">
        <div>
          <span class="label">Humidity:</span> {{ humidity }}%
        </div>
        <div>
          <span class="label">Dew Point:</span> {{ dew.toFixed(1) }}°C
        </div>
      </div>

      <div>
        <span class="label">Visibility:</span> {{ visibility }} km
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WindBlock from './WindBlock.vue';
import PressureBlock from './PressureBlock.vue';

const props = defineProps({
  city: String,
  temp: Number,
  description: String,
  feelsLike: Number,
  windSpeed: Number,
  windDeg: Number,
  humidity: Number,
  pressure: Number,
  visibility: Number,
  icon: { type: String, default: undefined }, // openweathermap icon code
});

function dewPoint(tempC: number, humidity: number) {
  return tempC - (100 - humidity) / 5;
}

const dew = dewPoint(10.29, 50);

const iconUrl = props.icon ? `https://openweathermap.org/img/wn/${props.icon}@2x.png` : '';
</script>

<style lang="scss" scoped>
.weather-card {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  padding: 18px;
  border-radius: 14px;
  text-align: center;
  transition: transform 0.2s;

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


.flex-between {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>
