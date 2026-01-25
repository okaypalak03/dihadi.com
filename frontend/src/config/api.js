/**
 * API base URL. Use VITE_API_URL in production (e.g. Render backend URL).
 * @see https://vite.dev/guide/env-and-mode
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export default API_BASE;
