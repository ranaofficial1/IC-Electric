const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "hale_auth_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage unavailable (private browsing) — auth just won't persist
    // across reloads for this session, which is a reasonable degradation.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // See setToken — safe to ignore.
  }
}

/** Thrown on any non-2xx response. Carries the backend's message/details. */
export class ApiRequestError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/**
 * Thin fetch wrapper for the Hale API. Attaches the auth token (unless
 * `auth: false` is passed), sends/parses JSON, and throws ApiRequestError
 * with the backend's message/details on failure so callers can show
 * field-level validation errors where useful.
 */
export async function apiFetch(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const requestHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const token = getToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiRequestError(0, "Couldn't reach the server. Check your connection and try again.");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // No/invalid JSON body (e.g. a 204) — fall through with payload = null.
  }

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      payload?.message || "Something went wrong.",
      payload?.details
    );
  }

  return payload;
}

export const api = {
  get: (path, options) => apiFetch(path, { ...options, method: "GET" }),
  post: (path, body, options) => apiFetch(path, { ...options, method: "POST", body }),
  put: (path, body, options) => apiFetch(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => apiFetch(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => apiFetch(path, { ...options, method: "DELETE" }),
};
