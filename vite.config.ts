import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteEslint from 'vite-plugin-eslint'
import glsl from 'vite-plugin-glsl'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteEslint(), glsl()]
})
