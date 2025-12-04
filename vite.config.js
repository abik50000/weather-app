import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue({ customElement: true })],
  define: {
    'process.env': {},
  },
  build: {
    lib: {
      entry: './src/WeatherWidget.ce.ts',
      name: 'WeatherWidget',
      formats: ['iife'],
      fileName: 'weather-widget',
    },
    rollupOptions: {
      external: [],
    },
    define: {
      'process.env': {}
    },
  }
});