# Clear Cache and Test OAuth

## Everything is Configured Correctly ✅

- ✅ Railway: `NEXT_PUBLIC_APP_URL` = production URL
- ✅ Google Cloud Console: Only Supabase callback URL
- ✅ Supabase: Site URL and Redirect URLs correct

## The Issue: Browser Cache or Supabase Session Cache

Since all configurations are correct, the `localhost:8080` redirect is likely from:
1. **Browser cache** - Old redirect URLs cached
2. **Supabase session cache** - Old OAuth flow state cached
3. **Browser cookies** - Old session data

## Solution: Clear Everything and Test

### Step 1: Clear Browser Data

1. **Open browser DevTools** (F12 or Cmd+Option+I)
2. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)
3. **Clear:**
   - Cookies (for your production domain)
   - Local Storage
   - Session Storage
   - Cache Storage

### Step 2: Test in Incognito/Private Window

1. **Open a new incognito/private window**
2. **Go to:** `https://clientdashboard-production-ff73.up.railway.app/auth/signin`
3. **Click "Sign in with Google"**
4. **Watch the browser console** (F12) for:
   - `[OAuth] Redirect URL:` - Should show production URL
   - `[Auth] getAuthRedirectUrl called (client):` - Should show production URL

### Step 3: Check Railway Logs

While testing, check Railway logs:

1. **Go to Railway Dashboard** → Your service → Logs
2. **Look for:**
   - `[OAuth] Redirect URL:` - Should show production URL
   - `[Callback] Environment check:` - Should show `NEXT_PUBLIC_APP_URL` = production URL
   - `[Callback] Using base URL from env:` - Should show production URL

### Step 4: Check the Actual Redirect

When you click "Sign in with Google", watch the browser's address bar:

1. **Should redirect to:** `https://accounts.google.com/...`
2. **After login, should redirect to:** `https://wharallqyamfretztuas.supabase.co/auth/v1/callback?code=...`
3. **Then Supabase should redirect to:** `https://clientdashboard-production-ff73.up.railway.app/auth/callback?code=...`
4. **Then your app should redirect to:** `https://clientdashboard-production-ff73.up.railway.app/onboarding/check`

**If it redirects to `localhost:8080` at any step, note which step!**

## Debugging: Check What Supabase is Actually Sending

The redirect to `localhost:8080` might be coming from Supabase's response. To check:

1. **Open browser DevTools** → Network tab
2. **Filter by:** `auth/v1/callback`
3. **Click "Sign in with Google"**
4. **After Google login, find the request to:** `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`
5. **Check the response:**
   - Look for a `Location` header
   - Look for redirect URLs in the response body
   - This will show what Supabase is actually redirecting to

## Alternative: Check Supabase Session

Supabase might have cached the old redirect URL in a session. Try:

1. **Go to Supabase Dashboard** → Authentication → Sessions
2. **Delete any active sessions** for your user
3. **Try OAuth login again**

## If Still Not Working

If after clearing cache and testing in incognito, you still get `localhost:8080`, then:

1. **Check Railway logs** - What does `[Callback] Environment check:` show?
2. **Check browser console** - What does `[OAuth] Redirect URL:` show?
3. **Check Network tab** - What URL is Supabase redirecting to?

This will tell us exactly where `localhost:8080` is coming from.

