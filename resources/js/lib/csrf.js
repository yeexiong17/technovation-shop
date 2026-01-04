// Helper function to get CSRF token
export function getCsrfToken() {
  // Try to get from meta tag first (most reliable)
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    const token = metaTag.getAttribute('content');
    if (token) return token;
  }
  
  // Fallback to cookie (Laravel stores it as XSRF-TOKEN)
  // The cookie value is URL encoded
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const parts = cookie.trim().split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = parts.slice(1).join('='); // Handle values with = in them
      
      if (name === 'XSRF-TOKEN') {
        try {
          return decodeURIComponent(value);
        } catch (e) {
          return value; // Return as-is if decoding fails
        }
      }
    }
  }
  
  return null;
}

