# Fix: Google OAuth Redirecting to Localhost:8080

## The Issue

Google OAuth might have `localhost:8080` configured in Google Cloud Console, which would cause redirects to go there instead of your production URL.

## How OAuth Redirect Works

1. **Your app** → Calls `signInWithOAuth()` with `redirectTo: https://your-production-url/auth/callback`
2. **Supabase** → Receives the request and redirects to Google
3. **Google** → Shows login page
4. **After login** → Google redirects to the URL configured in **Google Cloud Console** (not what you pass to Supabase!)
5. **Supabase** → Processes the OAuth callback
6. **Supabase** → Redirects to your app using its Site URL + the path you specified

## The Problem

Google Cloud Console has **Authorized redirect URIs** that must include Supabase's callback URL. But if there's a localhost:8080 entry, Google might be using that.

## Fix: Check Google Cloud Console

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client:**
   - Look for the client ID that matches your Supabase Google provider
   - (The one you configured in Supabase)

3. **Check "Authorized redirect URIs":**
   - Should ONLY have: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`
   - **Remove any:**
     - ❌ `http://localhost:3000/**`
     - ❌ `http://localhost:8080/**`
     - ❌ `http://localhost:8080/auth/callback`
     - ❌ Any localhost entries

4. **Save the changes**

## Important Notes

- **Google redirects to Supabase first** (not directly to your app)
- The redirect URI in Google Console must be Supabase's callback URL
- Your app's callback URL is configured in Supabase, not Google
- If Google has localhost:8080, it might be redirecting there instead of Supabase

## Verification

After updating Google Cloud Console:
1. Wait 1-2 minutes for changes to propagate
2. Clear browser cache/cookies
3. Try OAuth login again
4. Check browser console for the debug logs to see what's happening

## Alternative: Check Supabase Google Provider Settings

Also verify in Supabase:
1. Go to: Authentication → Providers → Google
2. Check the Client ID and Client Secret
3. Make sure they match what's in Google Cloud Console
4. The redirect URL shown should be: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`

