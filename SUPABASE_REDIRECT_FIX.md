# Fix: Supabase Redirecting to Localhost:8080

## The Real Issue

Supabase is redirecting to `localhost:8080` even though your code is correct. This means **Supabase itself** has localhost configured somewhere.

## Critical Check: Supabase URL Configuration

Go to: https://supabase.com/dashboard/project/wharallqyamfretztuas/auth/url-configuration

### 1. Site URL
**MUST be:**
```
https://clientdashboard-production-ff73.up.railway.app
```

**Check for:**
- ❌ `http://localhost:3000`
- ❌ `http://localhost:8080`
- ❌ Any localhost entry

### 2. Redirect URLs
**Must include:**
```
https://clientdashboard-production-ff73.up.railway.app/auth/callback
https://clientdashboard-production-ff73.up.railway.app/**
```

**Must REMOVE:**
- ❌ `http://localhost:3000/**`
- ❌ `http://localhost:8080/**`
- ❌ Any localhost entries

### 3. Save and Wait
- Click "Save changes"
- Wait 2-3 minutes for changes to propagate
- Supabase caches these settings

## Why Port 8080?

Port 8080 suggests:
1. **Supabase has localhost:8080 cached** from a previous configuration
2. **A proxy or tunnel** is running on 8080
3. **Browser extension** is redirecting (unlikely but possible)

## Verification Steps

1. **Check Supabase Dashboard:**
   - Go to URL Configuration
   - Screenshot the page
   - Verify NO localhost entries exist

2. **Check Browser Console:**
   - After Railway redeploys with debug logs
   - Click "Sign in with Google"
   - Look for `[Auth]` and `[OAuth]` logs
   - These show what URL your code is constructing

3. **Check Railway Logs:**
   - After OAuth attempt
   - Look for `[Callback]` logs
   - These show what base URL the callback route is using

## If Still Not Working

If you've verified:
- ✅ Site URL is production URL
- ✅ No localhost in Redirect URLs
- ✅ `NEXT_PUBLIC_APP_URL` is set in Railway
- ✅ Waited 3+ minutes after changes

Then try:
1. **Clear Supabase cache:**
   - Temporarily change Site URL to something else
   - Save
   - Change it back to production URL
   - Save again

2. **Check Google OAuth Settings:**
   - Google Cloud Console
   - Make sure authorized redirect URIs only have Supabase URL
   - No localhost entries

3. **Test in Incognito:**
   - Clear all cookies
   - Try in private/incognito window
   - This eliminates browser cache issues

