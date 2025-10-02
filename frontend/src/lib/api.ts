// Centralized API client for the frontend
// - Reads base URL from Vite env, defaults to backend on :5000
// - Sends Authorization header if access token present
// - Auto-refreshes access token on 401 using refresh cookie and retries once

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5001/api';
const HOST_BASE = BASE_URL.replace(/\/api$/, '');

const ACCESS_TOKEN_KEY = 'auth:accessToken';

function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setAccessToken(token?: string) {
  try {
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  // Attach access token if available
  const token = getAccessToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    method: (options.method as HttpMethod) || 'GET',
    credentials: 'include', // include cookies for refresh token
    ...options,
    headers,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : (await res.text() as any);

  if (!res.ok) {
    // If unauthorized, try to refresh once
    if (res.status === 401 && retry) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const refreshJson = await refreshRes.json();
        if (refreshRes.ok && refreshJson?.data?.accessToken) {
          setAccessToken(refreshJson.data.accessToken);
          // Retry original request once with new token
          return await request<T>(path, options, false);
        }
      } catch {
        // ignore
      }
    }
    const message = (data && (data.message || data.error)) || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'PATCH', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: 'DELETE' }),
  health: () => request<{ status: string; message: string; timestamp: string }>(`${HOST_BASE}/health`),
};

export default api;

export const authStorage = {
  setAccessToken,
  getAccessToken,
};
