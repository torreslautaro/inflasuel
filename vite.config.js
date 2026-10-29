import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// En producción, vercel.json hace este mismo proxy (el CSV del INDEC no tiene CORS)
const proxy = {
  '/api/ipc': {
    target: 'https://www.indec.gob.ar',
    changeOrigin: true,
    rewrite: () => '/ftp/cuadros/economia/serie_ipc_divisiones.csv'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy },
  preview: { proxy }
})
