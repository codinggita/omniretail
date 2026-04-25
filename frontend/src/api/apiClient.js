/**
 * apiClient.js — Fetch-based API client
 *
 * Features:
 *  - Prepends VITE_API_BASE_URL to every request path
 *  - Attaches Bearer token from localStorage on every request
 *  - Attaches optional X-API-Key header from env
 *  - Throws a structured error on non-2xx responses
 *  - 401 refresh-token hook (uncomment when backend supports it)
 */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/** Build default headers for every request */
function buildHeaders(extra = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...extra,
  };

  const token = localStorage.getItem('accessToken');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const apiKey = import.meta.env.VITE_API_KEY;
  if (apiKey) headers['X-API-Key'] = apiKey;

  return headers;
}

/**
 * Core request function
 * @param {string} path         - Path relative to BASE_URL, e.g. '/products'
 * @param {RequestInit} options - Standard fetch options
 * @param {boolean} isRetry     - Internal 401-retry guard
 */
async function sendRequest(path, options = {}, isRetry = false) {
  const url = `${BASE_URL}${path}`;
  const config = { ...options, headers: buildHeaders(options.headers) };

  const response = await fetch(url, config);

  // 401 — attempt token refresh once
  if (response.status === 401 && !isRetry) {
    try {
      // Uncomment when backend refresh endpoint is ready:
      // const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
      // });
      // const { accessToken } = await refreshResponse.json();
      // localStorage.setItem('accessToken', accessToken);
      // return sendRequest(path, options, true);
    } catch {
      // Refresh failed — let caller handle redirect to /login
    }
  }

  // Non-2xx — throw a structured error
  if (!response.ok) {
    let errorBody = {};
    try { errorBody = await response.json(); } catch { /* not JSON */ }
    const error = new Error(errorBody.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = errorBody;
    throw error;
  }

  // 204 No Content — nothing to parse
  if (response.status === 204) return null;

  return response.json();
}

// ─── Public API ─────────────────────────────────────────────────────────────

const apiClient = {
  get:    (path, opts = {})       => sendRequest(path, { ...opts, method: 'GET' }),
  post:   (path, body, opts = {}) => sendRequest(path, { ...opts, method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body, opts = {}) => sendRequest(path, { ...opts, method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, body, opts = {}) => sendRequest(path, { ...opts, method: 'PATCH',  body: JSON.stringify(body) }),
  remove: (path, opts = {})       => sendRequest(path, { ...opts, method: 'DELETE' }),
  delete: (path, opts = {})       => sendRequest(path, { ...opts, method: 'DELETE' }),
};

export default apiClient;
