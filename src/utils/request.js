import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: '/api', // 使用Vite代理，所以这里用相对路径
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    console.error('Response Error:', error);
    if (error.response?.status === 401) {
      // 处理未授权错误，例如跳转到登录页
      console.log('Unauthorized, redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default request;