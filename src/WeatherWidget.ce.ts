import { defineCustomElement } from "vue";
import App from "./App.vue";

const WeatherWidget = defineCustomElement(App);

// Регистрируем тег
customElements.define("weather-widget", WeatherWidget);