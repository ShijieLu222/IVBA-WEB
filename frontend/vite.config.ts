import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 读取 .env 文件的环境变量
  const env = loadEnv(mode, process.cwd());

  console.log("🚀 Loaded Env Variables:", env); // 调试日志，确保 VITE_API_URL 正确加载

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true
        }
      }
    }
  };
});
