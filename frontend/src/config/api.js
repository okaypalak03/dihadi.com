/**
 * API base URL. Use VITE_API_URL in production (e.g. Render backend URL).
 * Always ends with /api so routes like /auth/login resolve correctly.
 * @see https://vite.dev/guide/env-and-mode
 */
let base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
base = base.replace(/\/*$/, '');
if (!base.endsWith('/api')) base = base + '/api';
const API_BASE = base;
export default API_BASE;
