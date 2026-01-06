/**
 * Get the correct redirect URL for authentication callbacks
 * Uses NEXTAUTH_URL or NEXT_PUBLIC_APP_URL in production, falls back to window.location.origin
 */
export function getAuthRedirectUrl(path: string = '/auth/callback'): string {
  // Always use environment variable if available (works in both server and client)
  // NEXT_PUBLIC_ variables are available in client-side code
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL
  
  if (envUrl) {
    // Remove trailing slash if present
    const baseUrl = envUrl.replace(/\/$/, '')
    const fullUrl = `${baseUrl}${path}`
    
    // Debug logging (remove in production if needed)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[Auth] Using redirect URL:', fullUrl, 'from env:', envUrl)
    }
    
    return fullUrl
  }

  // In client-side, use current origin (this should be production URL if on production)
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin
    const fullUrl = `${currentOrigin}${path}`
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Using redirect URL from window.location.origin:', fullUrl)
    }
    
    return fullUrl
  }

  // Server-side fallback
  return `http://localhost:3000${path}`
}

