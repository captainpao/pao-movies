/**
 * Centralized API Configuration
 * 
 * This file handles the logic for determining the backend URL based on the environment.
 * 
 * VITE_BACKEND_URL can be set in .env files or deployment configuration.
 * - If not set, it defaults to http://localhost:3001 for development.
 * - For production, it should be set to the deployed backend URL (e.g., https://mvbe.captainpao.com).
 */

// Get the backend URL from environment variables
const envBackendUrl = import.meta.env.VITE_BACKEND_URL;

// Determine the base URL.
// - If VITE_BACKEND_URL is explicitly set, use it (e.g. a separate backend host).
// - Otherwise: production builds call the same-origin Cloudflare Pages Functions
//   at /api/... (empty base), and dev falls back to the local Express server.
export const API_BASE_URL =
  envBackendUrl || (import.meta.env.PROD ? '' : 'http://localhost:3001');

export const TMDB_API_URL = `${API_BASE_URL}/api/tmdb`;
export const DEEPSEEK_API_URL = `${API_BASE_URL}/api/deepseek`;
