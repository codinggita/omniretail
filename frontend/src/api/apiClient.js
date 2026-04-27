/**
 * apiClient.js
 *
 * Think of this file as a "smart messenger" between our React app and the backend server.
 * Instead of writing the same repetitive fetch() code in every component,
 * we put all the networking logic here once — and every other file just calls
 * apiClient.get(), apiClient.post(), etc.
 *
 * What it does automatically for you:
 *   1. Always adds the correct server address (BASE_URL) to every request
 *   2. Attaches the user's login token so the server knows who you are
 *   3. Throws a clear error if the server replies with an error code
 */

// ─── Step 1: Know WHERE the backend server lives ────────────────────────────
//
// VITE_API_BASE_URL is an environment variable set in the .env file.
// If it's not set (e.g. on a developer's local machine), we fall back to
// localhost:5000 so the app still works while developing.
//
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';


// ─── Step 2: Build the request headers ──────────────────────────────────────
//
// "Headers" are like a cover letter attached to every network request.
// They tell the server:
//   - "Content-Type: application/json"  → I'm sending data as JSON
//   - "Authorization: Bearer <token>"   → Here is the logged-in user's token
//   - "X-API-Key: <key>"               → (optional) extra security key
//
// The `extra` parameter lets callers add any additional headers they need.
//
function buildHeaders(extra = {}) {
  // Start with the basics — we always send JSON
  const headers = {
    'Content-Type': 'application/json',
    ...extra, // Spread any extra headers the caller passed in
  };

  // Check if the user is logged in (we store their token in localStorage after login)
  const token = localStorage.getItem('accessToken');
  if (token) {
    // Attach it so the server can verify the user's identity
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Check for an optional API key stored in environment variables
  const apiKey = import.meta.env.VITE_API_KEY;
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  return headers;
}


// ─── Step 3: The core "send a request" function ──────────────────────────────
//
// All GET, POST, PUT, PATCH, DELETE calls eventually pass through here.
//
// Parameters:
//   path     → The endpoint path, e.g. '/products' or '/users/login'
//   options  → Standard fetch options (method, body, extra headers, etc.)
//   isRetry  → Internal flag to prevent infinite retry loops on 401 errors
//
async function sendRequest(path, options = {}, isRetry = false) {
  // Combine the base URL with the path to get the full URL
  const url = `${BASE_URL}${path}`;

  // Merge the caller's options with our auto-built headers
  const config = {
    ...options,
    headers: buildHeaders(options.headers),
  };

  // Actually send the HTTP request and wait for a response
  const response = await fetch(url, config);

  // ── Handle 401 Unauthorized ──────────────────────────────────────────────
  // A 401 means "you're not logged in" or "your token expired".
  // We could automatically try to refresh the token here (see commented code below).
  // For now we just let the error bubble up so the caller can redirect to /login.
  //
  if (response.status === 401 && !isRetry) {
    try {
      // TODO: Uncomment this block once the backend has a /auth/refresh endpoint:
      //
      // const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
      // });
      // const { accessToken } = await refreshResponse.json();
      // localStorage.setItem('accessToken', accessToken); // Save the new token
      // return sendRequest(path, options, true);           // Retry the original request
    } catch {
      // If refresh also fails, we fall through and let the error throw below
    }
  }

  // ── Handle any other error (4xx, 5xx) ───────────────────────────────────
  // response.ok is true only for status codes 200–299
  if (!response.ok) {
    let errorBody = {};

    try {
      // Try to read the error message the server sent back as JSON
      errorBody = await response.json();
    } catch {
      // The server didn't send JSON — that's fine, we'll use a generic message
    }

    // Create a proper JavaScript Error object so callers can use try/catch
    const error = new Error(errorBody.message || `HTTP Error ${response.status}`);
    error.status = response.status; // e.g. 404, 500
    error.data = errorBody;         // The full error body from the server
    throw error;
  }

  // ── Handle 204 No Content ────────────────────────────────────────────────
  // Some endpoints (like DELETE) return 204 with an empty body — nothing to parse
  if (response.status === 204) return null;

  // ── Success! Parse and return the JSON body ──────────────────────────────
  return response.json();
}


// ─── Step 4: Export a clean, easy-to-use API object ─────────────────────────
//
// This is what every other file in the project imports and uses.
// Example usage:
//   import apiClient from './apiClient';
//   const products = await apiClient.get('/products');
//   await apiClient.post('/products', { name: 'T-Shirt', price: 499 });
//
const apiClient = {
  // GET  — fetch data from the server (no body needed)
  get: (path, opts = {}) =>
    sendRequest(path, { ...opts, method: 'GET' }),

  // POST — send new data to the server (e.g. create a product, login)
  post: (path, body, opts = {}) =>
    sendRequest(path, { ...opts, method: 'POST', body: JSON.stringify(body) }),

  // PUT  — replace an existing resource entirely (e.g. fully update a product)
  put: (path, body, opts = {}) =>
    sendRequest(path, { ...opts, method: 'PUT', body: JSON.stringify(body) }),

  // PATCH — update only specific fields of a resource (partial update)
  patch: (path, body, opts = {}) =>
    sendRequest(path, { ...opts, method: 'PATCH', body: JSON.stringify(body) }),

  // DELETE — remove a resource (both names work, use whichever reads more clearly)
  remove: (path, opts = {}) =>
    sendRequest(path, { ...opts, method: 'DELETE' }),

  delete: (path, opts = {}) =>
    sendRequest(path, { ...opts, method: 'DELETE' }),
};

export default apiClient;
