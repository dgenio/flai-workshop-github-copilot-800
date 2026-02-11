/**
 * API Configuration Utility
 * Automatically detects GitHub Codespaces environment and builds correct API URLs
 */

/**
 * Detects if running in GitHub Codespaces and extracts the codespace name
 * @returns {string|null} Codespace name or null if not in Codespaces
 */
const getCodespaceName = () => {
  const hostname = window.location.hostname;
  
  // Check if we're running in a GitHub Codespace
  // Pattern: {codespace-name}-{port}.app.github.dev
  if (hostname.includes('.app.github.dev')) {
    // Extract codespace name by removing the port suffix
    const match = hostname.match(/^(.+)-\d+\.app\.github\.dev$/);
    return match ? match[1] : null;
  }
  
  return null;
};

/**
 * Builds the base API URL based on the current environment
 * @returns {string} Base API URL (without trailing slash)
 */
export const getApiBaseUrl = () => {
  const codespaceName = getCodespaceName();
  
  if (codespaceName) {
    // Running in GitHub Codespaces
    return `https://${codespaceName}-8000.app.github.dev`;
  }
  
  // Running locally
  return 'http://localhost:8000';
};

/**
 * Builds a complete API endpoint URL
 * @param {string} endpoint - API endpoint path (e.g., 'api/activities', '/api/users')
 * @returns {string} Complete API URL
 */
export const getApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  // Normalize endpoint to ensure single slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
};
