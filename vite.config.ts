import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      '$app/environment': path.resolve(process.cwd(), 'src/mocks/app-environment.ts')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-app-environment',
          setup(build) {
            build.onResolve({ filter: /^\$app\/environment$/ }, _args => ({
              path: path.resolve(process.cwd(), 'src/mocks/app-environment.ts'),
            }))
          },
        },
      ],
    },
  }
})
