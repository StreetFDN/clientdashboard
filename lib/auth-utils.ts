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
    return `${baseUrl}${path}`
  }

  // In client-side, fallback to current origin
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`
  }

  // Server-side fallback
  return `http://localhost:3000${path}`
}

