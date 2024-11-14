import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      '/server': {
        target: 'http://localhost:5000/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, ''), // Remove '/server' prefix
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
