import axios from 'axios';

// 定义登录参数接口
interface LoginParams {
  username: string;
  password: string;
}

// 定义登录响应接口
interface LoginResponse {
  access_token: string;
  token_type: string;
}

// 定义用户信息接口
interface UserInfo {
  id: number;
  username: string;
  is_admin: number;
}

// 登录函数
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('username', params.username);
  formData.append('password', params.password);
  
  const response = await axios.post<LoginResponse>(
    `/api/auth/token`,
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<UserInfo> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('未登录');
  }
  
  const response = await axios.get<UserInfo>(
    `/api/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// 设置全局请求拦截器，自动添加认证头
export const setupAuthInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};