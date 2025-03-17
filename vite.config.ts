import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    // proxy: {
    //   '/payments': {
    //     target: 'http://localhost:5000', // Rediriger vers le serveur pour la page index.html
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/payments/, '/payments'), // Assurez-vous que le chemin est correct
    //   },
    // },
  },
});