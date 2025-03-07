import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.tsx'
import { setupAuthInterceptor } from './api/auth'

// 配置axios默认baseURL
axios.defaults.baseURL = 'http://localhost:8000'

// 设置认证拦截器
setupAuthInterceptor()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
