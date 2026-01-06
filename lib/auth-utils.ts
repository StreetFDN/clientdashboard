/**
 * Get the correct redirect URL for authentication callbacks
 * Uses NEXTAUTH_URL or NEXT_PUBLIC_APP_URL in production, falls back to window.location.origin
 */
export function getAuthRedirectUrl(path: string = '/auth/callback'): string {
  // Always use environment variable if available (works in both server and client)
  // NEXT_PUBLIC_ variables are available in client-side code
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL
  
  // Always log for debugging (helps identify the issue)
  if (typeof window !== 'undefined') {
    console.log('[Auth] getAuthRedirectUrl called (client):', {
      envUrl,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      path,
      windowOrigin: window.location.origin,
      windowHref: window.location.href,
    })
  }
  
  if (envUrl) {
    // Remove trailing slash if present
    const baseUrl = envUrl.replace(/\/$/, '')
    const fullUrl = `${baseUrl}${path}`
    
    console.log('[Auth] Using redirect URL from env:', fullUrl)
    return fullUrl
  }

  // In client-side, use current origin (this should be production URL if on production)
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin
    const fullUrl = `${currentOrigin}${path}`
    
    console.log('[Auth] Using redirect URL from window.location.origin:', fullUrl)
    return fullUrl
  }

  // Server-side fallback
  console.warn('[Auth] No env URL found, using localhost fallback')
  return `http://localhost:3000${path}`
}

