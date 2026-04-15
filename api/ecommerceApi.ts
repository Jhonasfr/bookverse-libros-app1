import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const REMOTE_API_URL = 'https://ecommerce-api.wittysky-ae597b7e.westus2.azurecontainerapps.io';
export const LOCAL_API_URL = 'http://localhost:8080';
export const LOCAL_IP_API_URL = 'http://127.0.0.1:8080';
const CORS_PROXY_URL = 'https://corsproxy.io/?';

const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));
const isAbsoluteUrl = (value = '') => /^https?:\/\//i.test(value);
const isLocalBaseUrl = (baseUrl = '') => /localhost|127\.0\.0\.1/.test(baseUrl);

const rawEnvUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const getApiCandidates = () => {
  if (isWeb) {
    return unique([
      rawEnvUrl && !isLocalBaseUrl(rawEnvUrl) ? rawEnvUrl : '',
      REMOTE_API_URL,
      rawEnvUrl,
      LOCAL_API_URL,
      LOCAL_IP_API_URL,
    ].filter(Boolean) as string[]);
  }

  return unique([
    rawEnvUrl || '',
    LOCAL_API_URL,
    LOCAL_IP_API_URL,
    REMOTE_API_URL,
  ].filter(Boolean) as string[]);
};

const buildAbsoluteUrl = (baseUrl: string, path = '') => {
  if (isAbsoluteUrl(path)) return path;
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const isRetryableNetworkError = (error: AxiosError) => {
  const code = error.code ?? '';
  return !error.response && ['ERR_NETWORK', 'ECONNABORTED', 'ENOTFOUND', 'ECONNREFUSED'].includes(code);
};

const shouldTryNextBaseUrl = (error: AxiosError, baseUrl: string) => {
  if (isRetryableNetworkError(error)) return true;
  const status = error.response?.status;
  return Boolean(isLocalBaseUrl(baseUrl) && status && [404, 405, 502, 503, 504].includes(status));
};

const canUseCorsProxy = (baseUrl: string) => isWeb && /^https:\/\//i.test(baseUrl) && !isLocalBaseUrl(baseUrl);

export const ecommerceApi = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  const candidates = getApiCandidates();
  let lastError: unknown;

  for (const baseUrl of candidates) {
    try {
      return await ecommerceApi.request<T>({
        ...config,
        baseURL: isAbsoluteUrl(config.url || '') ? undefined : baseUrl,
        url: config.url,
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers || {}),
        },
      });
    } catch (error) {
      lastError = error;
      const axiosError = error as AxiosError;

      if (canUseCorsProxy(baseUrl) && isRetryableNetworkError(axiosError) && config.url) {
        try {
          const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(buildAbsoluteUrl(baseUrl, config.url))}`;
          return await ecommerceApi.request<T>({
            ...config,
            baseURL: undefined,
            url: proxiedUrl,
            headers: {
              'Content-Type': 'application/json',
              ...(config.headers || {}),
            },
          });
        } catch (proxyError) {
          lastError = proxyError;
        }
      }

      if (!shouldTryNextBaseUrl(axiosError, baseUrl)) {
        break;
      }
    }
  }

  throw lastError;
}
