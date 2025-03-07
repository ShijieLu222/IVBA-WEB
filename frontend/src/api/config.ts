import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000', // 确保这里的URL与您的后端服务地址匹配
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