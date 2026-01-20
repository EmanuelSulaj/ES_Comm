import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // This is the key line that prevents "React is not defined"
      jsxRuntime: 'automatic', 
    }),
  ],
})