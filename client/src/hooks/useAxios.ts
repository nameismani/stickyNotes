import { useState, useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface UseAxiosResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  get: (config?: AxiosRequestConfig) => Promise<T | undefined>;
  post: <D = any>(
    data?: D,
    config?: AxiosRequestConfig
  ) => Promise<T | undefined>;
  put: <D = any>(
    data?: D,
    config?: AxiosRequestConfig
  ) => Promise<T | undefined>;
  delete: (config?: AxiosRequestConfig) => Promise<T | undefined>;
}

const useAxios = <T>(
  url: string,
  isAuthenticated: boolean = false
): UseAxiosResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create axios instance with base configuration
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add auth interceptor if required
  if (isAuthenticated) {
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Generic request handler
  const handleRequest = async <D>(
    requestConfig: AxiosRequestConfig & { method: string; data?: D }
  ): Promise<T | undefined> => {
    try {
      setLoading(true);
      setError(null);

      const response: AxiosResponse<T> = await axiosInstance({
        url,
        ...requestConfig,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      let errorMessage = "An unexpected error occurred";

      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.detail || err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // HTTP methods implementation
  const get = useCallback(
    async (config?: AxiosRequestConfig) => {
      return handleRequest({ ...config, method: "GET" });
    },
    [url]
  );

  const post = useCallback(
    async <D = any>(data?: D, config?: AxiosRequestConfig) => {
      return handleRequest({ ...config, method: "POST", data });
    },
    [url]
  );

  const put = useCallback(
    async <D = any>(data?: D, config?: AxiosRequestConfig) => {
      return handleRequest({ ...config, method: "PUT", data });
    },
    [url]
  );

  const deleteRequest = useCallback(
    async (config?: AxiosRequestConfig) => {
      return handleRequest({ ...config, method: "DELETE" });
    },
    [url]
  );

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    delete: deleteRequest,
  };
};

export default useAxios;
