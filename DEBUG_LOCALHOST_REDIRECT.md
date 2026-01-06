# Debug: Localhost Redirect Issue

## The Problem
OAuth is redirecting to `localhost:8080` instead of production URL, even though `NEXT_PUBLIC_APP_URL` is set in Railway.

## Possible Causes

### 1. Supabase Site URL Still Has Localhost
Even if you updated it, check again:
- Go to: https://supabase.com/dashboard/project/wharallqyamfretztuas/auth/url-configuration
- **Site URL** should be: `https://clientdashboard-production-ff73.up.railway.app`
- **NOT** `http://localhost:3000` or `http://localhost:8080`

### 2. Supabase Redirect URLs
Check that redirect URLs include:
- `https://clientdashboard-production-ff73.up.railway.app/auth/callback`
- `https://clientdashboard-production-ff73.up.railway.app/**`

**Remove any localhost entries!**

### 3. Environment Variable Not Loading
The variable might not be available at runtime. Check:
- Railway logs to see if the variable is being read
- Browser console for the debug logs I added
- Server logs for the callback route logs

### 4. Port 8080 Mystery
Port 8080 is unusual. This might be:
- A proxy or tunnel configuration
- Supabase has localhost:8080 cached somewhere
- A browser extension or proxy

## Debugging Steps

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Click "Sign in with Google"
   - Look for logs starting with `[Auth]` and `[OAuth]`
   - These will show what redirect URL is being constructed

2. **Check Server Logs:**
   - In Railway, go to Logs
   - Look for `[Callback]` logs
   - These show what base URL is being used

3. **Verify Supabase Configuration:**
   - Double-check Site URL is production URL
   - Remove ALL localhost entries from Redirect URLs
   - Save and wait a few minutes for changes to propagate

4. **Clear Everything:**
   - Clear browser cache and cookies
   - Try in incognito/private window
   - Wait 2-3 minutes after changing Supabase settings

## Quick Fix to Try

1. **In Supabase URL Configuration:**
   - Set Site URL to: `https://clientdashboard-production-ff73.up.railway.app`
   - Add Redirect URL: `https://clientdashboard-production-ff73.up.railway.app/**`
   - Remove any `localhost` entries
   - Save

2. **In Railway:**
   - Verify `NEXT_PUBLIC_APP_URL` is exactly: `https://clientdashboard-production-ff73.up.railway.app`
   - No trailing slash
   - Redeploy if needed

3. **Test:**
   - Clear browser cache
   - Try OAuth login
   - Check console logs to see what's happening

