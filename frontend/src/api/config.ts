import axios from 'axios';

// 使用环境变量确定 API 地址，强制使用HTTPS
export const API_BASE_URL = (() => {
  const url = import.meta.env.VITE_API_URL || 'https://ivba-web-production.up.railway.app';
  // 确保URL使用HTTPS
  return url.replace(/^http:/i, 'https:');
})();

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // 添加 /api 前缀以匹配后端路由
  timeout: 30000,
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
    // 确保所有请求都使用HTTPS
    if (config.url && config.url.startsWith('http:')) {
      config.url = config.url.replace(/^http:/i, 'https:');
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
      // 添加更详细的错误日志
      console.error('API错误:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        url: response.config?.url
      });
      // 如果是混合内容错误，提供更具体的错误信息
      if (response.status === 0 && error.message?.includes('Mixed Content')) {
        console.error('检测到混合内容错误:请确保所有资源都使用HTTPS');
      }
    } else {
      console.error('网络错误或请求被取消:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
