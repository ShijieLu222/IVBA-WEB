import axios from 'axios';

// 使用环境变量确定 API 地址
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ivba-web-production.up.railway.app';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // 添加 /api 前缀以匹配后端路由
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage获取token并添加到请求头
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const { response } = error;
    if (response) {
      console.error('API错误:', response.data);
    } else {
      console.error('网络错误或请求被取消');
    }
    return Promise.reject(error);
  }
);

export default api;
