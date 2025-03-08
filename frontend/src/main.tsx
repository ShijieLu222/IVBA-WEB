import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App.tsx';
import { setupAuthInterceptor } from './api/auth';

// 通过 Vite 环境变量获取 API 地址
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://localhost:8000';

// 设置认证拦截器
setupAuthInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
