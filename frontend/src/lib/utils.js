import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Check if we're in production environment
 * @returns {boolean} True if production, false if development
 */
function isProduction() {
  // Check TIER environment variable first (explicit override)
  if (import.meta.env.VITE_TIER === 'prod' || import.meta.env.TIER === 'prod') {
    return true;
  }
  if (import.meta.env.VITE_TIER === 'dev' || import.meta.env.TIER === 'dev') {
    return false;
  }
  
  // Check Vite environment variable
  if (import.meta.env.PROD) {
    return true;
  }
  
  // Check if API URL is set to production
  if (import.meta.env.VITE_API_URL?.includes('clickly.cv')) {
    return true;
  }
  
  // Check current hostname (only if window is available - client-side only)
  if (typeof window !== 'undefined' && window.location?.hostname?.includes('clickly.cv')) {
    return true;
  }
  
  return false;
}

/**
 * Get the base domain and port for subdomain URLs
 * @returns {object} Object with domain and port
 */
function getSubdomainConfig() {
  if (isProduction()) {
    return {
      domain: 'clickly.cv',
      protocol: 'https',
      port: '' // No port in production
    };
  }
  
  // Development: Extract from API URL or use localhost:8080
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  try {
    const url = new URL(apiUrl);
    return {
      domain: 'localhost',
      protocol: url.protocol.replace(':', ''),
      port: url.port ? `:${url.port}` : ':8080'
    };
  } catch {
    return {
      domain: 'localhost',
      protocol: 'http',
      port: ':8080'
    };
  }
}

/**
 * Generate user link URL in subdomain format for both dev and prod
 * @param {string} username - User's username
 * @param {string} source - Optional source/platform name
 * @returns {string} Full URL (e.g., https://username.clickly.cv or http://username.localhost:8080)
 */
export function getUserLinkUrl(username, source = null) {
  if (!username) return '';
  
  const config = getSubdomainConfig();
  const baseUrl = `${config.protocol}://${username}.${config.domain}${config.port}`;
  return source ? `${baseUrl}/${source}` : baseUrl;
}

/**
 * Get the base URL for the application (main domain, not subdomain)
 * @returns {string} Base URL (production: https://clickly.cv, dev: http://localhost:8080)
 */
function getBaseUrl() {
  if (isProduction()) {
    return 'https://clickly.cv';
  }
  // In development, use API URL or localhost
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  // Remove protocol and extract host
  try {
    const url = new URL(apiUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    return 'http://localhost:8080';
  }
}

/**
 * Generate user link URL in legacy format (for backward compatibility or main domain)
 * @param {string} username - User's username
 * @param {string} source - Optional source/platform name
 * @returns {string} Full URL (e.g., https://clickly.cv/username or https://clickly.cv/username/source)
 */
export function getUserLinkUrlLegacy(username, source = null) {
  if (!username) return '';
  
  const baseUrl = getBaseUrl();
  return source ? `${baseUrl}/${username}/${source}` : `${baseUrl}/${username}`;
}
