import axios from 'axios';

// API基础URL
export const API_BASE_URL = '/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL, // 使用相对路径，通过Vite代理转发到后端
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 这里可以添加认证信息等
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
    // 处理错误响应
    const { response } = error;
    if (response) {
      // 服务器返回了错误信息
      console.error('API错误:', response.data);
    } else {
      // 网络错误或请求被取消
      console.error('网络错误或请求被取消');
    }
    return Promise.reject(error);
  }
);

export default api;