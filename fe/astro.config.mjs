// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    image: {
    domains: ['localhost:3000', 'localhost'], // Add the domain(s) of your image API/CDN
  },
});
