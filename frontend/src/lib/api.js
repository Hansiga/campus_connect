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

/**
 * Fetch comments for a notice.
 * @param {string|number} noticeId
 * @returns {Promise<{ data: { comments: array } }>}
 */
export function getComments(noticeId) {
  return api.get(`/comments/${noticeId}`);
}

/**
 * Post a new comment.
 * @param {{ notice_id: string|number, comment_text: string }} data
 * @param {string} token - JWT token for authorization
 * @returns {Promise<{ data: { message: string } }>}
 */
export function postComment(data, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return api.post("/comments", data, config);
}
