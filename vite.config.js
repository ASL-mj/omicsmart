import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import process from 'process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  const isMockEnabled = env.MOCK === 'true'
  const mockPort = env.MOCK_PORT || 15001

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 15000,
      open: true,
      host: '0.0.0.0',
      proxy: isMockEnabled ? {
        '/api': {
          target: `http://localhost:${mockPort}`,
          changeOrigin: true,
          secure: false
        }
      } : {}
    },
    define: {
      'import.meta.env.VITE_MOCK_ENABLED': JSON.stringify(isMockEnabled)
    }
  }
})
