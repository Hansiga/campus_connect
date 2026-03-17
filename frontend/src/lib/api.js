import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Login user. Returns token and user data.
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ data: { token: string, user: object } }>}
 */
export function loginUser(data) {
  return api.post("/auth/login", data);
}

/**
 * Register new user.
 * @param {{ name: string, email: string, password: string, role?: string }} data
 * @returns {Promise<{ data: { message: string, user: object } }>}
 */
export function registerUser(data) {
  return api.post("/auth/register", data);
}

/**
 * Fetch all notices. Requires Authorization header with Bearer token.
 * @param {string} [token] - JWT token for authenticated requests
 * @returns {Promise<{ data: array }>}
 */
export function getNotices(token) {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return api.get("/notices", config);
}

/**
 * Fetch all events. Requires Authorization header with Bearer token.
 * @param {string} [token] - JWT token for authenticated requests
 * @returns {Promise<{ data: array }>}
 */
export function getEvents(token) {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return api.get("/events", config);
}
