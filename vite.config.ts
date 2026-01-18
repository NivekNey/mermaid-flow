import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: {
      '$app/environment': path.resolve(process.cwd(), 'src/mocks/app-environment.ts')
    }
  },
  optimizeDeps: {
    exclude: ['svelte-splitpanes']
  }
})
