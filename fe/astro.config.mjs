// @ts-check
import {defineConfig} from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  image: {
      domains: ['localhost:3000', 'localhost'], // Add the domain(s) of your image API/CDN
  },
  redirects: {
    "/category/interviews": {
      status: 301,
      destination: "/interviews"
    },
    "/interviews/page/2": {
      status: 301,
      destination: "/interviews/2"
    },
    "/interviews/page/3": {
      status: 301,
      destination: "/interviews/3"
    },
    "/interviews/page/4": {
      status: 301,
      destination: "/interviews/4"
    },
    "/interviews/page/5": {
      status: 301,
      destination: "/interviews/5"
    },
    "/interviews/page/6": {
      status: 301,
      destination: "/interviews/6"
    },
    "/interviews/page/7": {
      status: 301,
      destination: "/interviews/7"
    },
    "/interviews/page/8": {
      status: 301,
      destination: "/interviews/8"
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});