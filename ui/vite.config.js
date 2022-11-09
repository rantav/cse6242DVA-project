import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: '/_vite/'
// })

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      base: '/_vite/'
    }
  } else {
    // command === 'build'
    return {
      plugins: [react()],
    }
  }
})