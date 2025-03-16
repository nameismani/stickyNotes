import { useState, useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getServerSessionDetail } from "@/libs/action";

interface UseAxiosResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  get: (
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => Promise<T | undefined>;
  post: <D = any>(
    data?: D,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => Promise<T | undefined>;
  put: <D = any>(
    data?: D,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => Promise<T | undefined>;
  delete: (
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => Promise<T | undefined>;
}

interface PathParams {
  // Parameters that should be treated as path parameters (in order)
  path?: string[];
  // Parameters that should be treated as resource IDs (appended to the path)
  resource?: string[];
}

// #fsdaf

const useAxios = <T>(
  url: string,
  isAuthenticated: boolean = false,
  pathParamsConfig?: PathParams
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
      async (config) => {
        const session = await getServerSessionDetail();
        if (session && config.headers) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Build URL with path parameters and query parameters
  const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
    if (!params) return baseUrl;

    let processedUrl = baseUrl;
    const queryParams: Record<string, any> = { ...params };

    // 1. Handle configured path parameters first
    if (pathParamsConfig?.path && pathParamsConfig.path.length > 0) {
      pathParamsConfig.path.forEach((paramName) => {
        if (queryParams[paramName] !== undefined) {
          const placeholder = `:${paramName}`;

          // If placeholder exists in URL, replace it
          if (processedUrl.includes(placeholder)) {
            processedUrl = processedUrl.replace(
              placeholder,
              encodeURIComponent(String(queryParams[paramName]))
            );
          }
          // Otherwise, add it as a path segment
          else {
            // Remove trailing slash if it exists
            if (processedUrl.endsWith("/")) {
              processedUrl = processedUrl.slice(0, -1);
            }
            processedUrl = `${processedUrl}/${encodeURIComponent(
              String(queryParams[paramName])
            )}`;
          }

          // Remove from query params
          delete queryParams[paramName];
        }
      });
    }

    // 2. Handle resource IDs (appended to path)
    if (pathParamsConfig?.resource && pathParamsConfig.resource.length > 0) {
      pathParamsConfig.resource.forEach((paramName) => {
        if (queryParams[paramName] !== undefined) {
          // Remove trailing slash if it exists
          if (processedUrl.endsWith("/")) {
            processedUrl = processedUrl.slice(0, -1);
          }

          // Append to URL path
          processedUrl = `${processedUrl}/${encodeURIComponent(
            String(queryParams[paramName])
          )}`;

          // Remove from query params
          delete queryParams[paramName];
        }
      });
    }

    // 3. Handle 'id' parameter for backward compatibility
    if (queryParams.id !== undefined) {
      // Remove trailing slash if it exists
      if (processedUrl.endsWith("/")) {
        processedUrl = processedUrl.slice(0, -1);
      }

      // Append ID to the URL path
      processedUrl = `${processedUrl}/${encodeURIComponent(
        String(queryParams.id)
      )}`;

      // Remove id from query parameters
      delete queryParams.id;
    }

    // 4. Handle placeholder replacement in URL
    Object.entries(queryParams).forEach(([key, value]) => {
      const placeholder = `:${key}`;
      if (processedUrl.includes(placeholder)) {
        processedUrl = processedUrl.replace(
          placeholder,
          encodeURIComponent(String(value))
        );
        delete queryParams[key]; // Remove used path param
      }
    });

    // 5. Add remaining params as query parameters
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      processedUrl += (processedUrl.includes("?") ? "&" : "?") + queryString;
    }

    return processedUrl;
  };

  // Generic request handler
  const handleRequest = async <D>(
    requestConfig: AxiosRequestConfig & {
      method: string;
      data?: D;
      params?: Record<string, any>;
    }
  ): Promise<T | undefined> => {
    try {
      setLoading(true);
      setError(null);

      // Build URL with parameters if provided
      const requestUrl = requestConfig.params
        ? buildUrl(url, requestConfig.params)
        : url;

      // Remove params from config to avoid duplication
      const { params, ...configWithoutParams } = requestConfig;

      const response: AxiosResponse<T> = await axiosInstance({
        url: requestUrl,
        ...configWithoutParams,
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

  // HTTP methods implementation with params support
  const get = useCallback(
    async (params?: Record<string, any>, config?: AxiosRequestConfig) => {
      return handleRequest({ ...config, method: "GET", params });
    },
    [url]
  );

  const post = useCallback(
    async <D = any>(
      data?: D,
      params?: Record<string, any>,
      config?: AxiosRequestConfig
    ) => {
      return handleRequest({ ...config, method: "POST", data, params });
    },
    [url]
  );

  const put = useCallback(
    async <D = any>(
      data?: D,
      params?: Record<string, any>,
      config?: AxiosRequestConfig
    ) => {
      return handleRequest({ ...config, method: "PUT", data, params });
    },
    [url]
  );

  const deleteRequest = useCallback(
    async (params?: Record<string, any>, config?: AxiosRequestConfig) => {
      return handleRequest({ ...config, method: "DELETE", params });
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
