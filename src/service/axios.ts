import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://globus-nukus.uz/api';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let queue: Array<(err: any, token?: string) => void> = [];

const processQueue = (error: any, token: string | null = null) => {
  queue.forEach((cb) => cb(error, token ?? undefined));
  queue = [];
};

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers || {};
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// **Response interceptor**
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((err, token) => {
            if (err) return reject(err);
            originalRequest.headers!['Authorization'] = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refresh_token');

      return axios
        .post<{ access: string; refresh: string }>(
          `${BASE_URL}/token/refresh`,
          { refresh: refreshToken }
        )
        .then((res) => {
          const { access, refresh } = res.data;
          localStorage.setItem('token', access);
          localStorage.setItem('refresh_token', refresh);
          processQueue(null, access);
          originalRequest.headers!['Authorization'] = `Bearer ${access}`;
          return instance(originalRequest);
        })
        .catch((err) => {
          processQueue(err, null);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          return Promise.reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return Promise.reject(error);
  }
);

export default instance;
