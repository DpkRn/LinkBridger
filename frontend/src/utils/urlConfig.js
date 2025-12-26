/**
 * Global tier configuration for LinkBridger frontend
 *
 * This module provides a global `tier` variable that can be used throughout the app
 * to determine if we're running in development ('dev') or production ('prod') mode.
 *
 * Tier Detection Priority:
 * 1. VITE_TIER environment variable (highest priority)
 * 2. Hostname check (localhost = dev, clickly.cv = prod)
 * 3. Vite's PROD flag
 * 4. Default to 'prod'
 *
 * Usage:
 * - Import { tier } from './utils/urlConfig'
 * - Access window.tier (globally available)
 * - Use isDevelopment() or isProduction() utility functions
 *
 * To set tier via environment:
 * - Development: VITE_TIER=dev npm run dev
 * - Production: VITE_TIER=prod npm run build
 */

// Global tier detection and configuration
const detectTier = () => {
  // Check Vite environment variable first (highest priority)
  if (import.meta.env?.VITE_TIER) {
    return import.meta.env.VITE_TIER;
  }

  // Check if running on localhost (development)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
      return 'dev';
    }

    // Check if running on production domain
    if (hostname.includes('clickly.cv')) {
      return 'prod';
    }
  }

  // Check import.meta.env.PROD (Vite's production flag)
  if (import.meta.env?.PROD) {
    return 'prod';
  }

  // Default to production
  return 'prod';
};

// Global tier variable - can be used anywhere in the app
export const tier = detectTier();

// Make tier globally available on window object for easy access
if (typeof window !== 'undefined') {
  window.tier = tier;
  // Debug log to show detected tier (remove in production)
  console.log('🌍 Detected tier:', tier);
}

export const serverUrl=(tierOverride)=>{
    const currentTier = tierOverride || tier;
    if(currentTier=='dev'){
        return "http://localhost:8080"
    }
    return "https://clickly.cv"
}

export const clientUrl=(tierOverride)=>{
    const currentTier = tierOverride || tier;
    if(currentTier=='dev'){
      return "http://localhost:5173"
    }
    return "https://clickly.cv/app"
  }

// Utility function to check if we're in development
export const isDevelopment = () => tier === 'dev';

// Utility function to check if we're in production
export const isProduction = () => tier === 'prod';
