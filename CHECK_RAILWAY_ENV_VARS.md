# Check Railway Environment Variables

## The Issue

Supabase URL configuration is correct, but you're still being redirected to `localhost:8080`. This means the issue is likely:

1. **Railway environment variables** - `NEXT_PUBLIC_APP_URL` might not be set or might be wrong
2. **Google Cloud Console** - might have `localhost:8080` in authorized redirect URIs

## Step 1: Check Railway Environment Variables

1. **Go to Railway Dashboard:**
   - https://railway.app/dashboard
   - Select your `clientdashboard` project
   - Click on your service/deployment

2. **Go to Variables tab:**
   - Look for `NEXT_PUBLIC_APP_URL`
   - Should be: `https://clientdashboard-production-ff73.up.railway.app`
   - **NOT:** `http://localhost:8080` or `http://localhost:3000`

3. **If missing or wrong:**
   - Add/Update: `NEXT_PUBLIC_APP_URL`
   - Value: `https://clientdashboard-production-ff73.up.railway.app`
   - Save and redeploy

## Step 2: Check Google Cloud Console

Even though Supabase is correct, Google might be redirecting incorrectly.

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client:**
   - The one configured in Supabase Google provider

3. **Check "Authorized redirect URIs":**
   - Should ONLY have: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`
   - **Remove ANY:**
     - ❌ `http://localhost:3000/**`
     - ❌ `http://localhost:8080/**`
     - ❌ `http://localhost:8080/auth/callback`
     - ❌ Any localhost entries

4. **Save changes**

## Step 3: Check Railway Logs

After updating environment variables, check Railway logs when you try OAuth:

1. **Go to Railway Dashboard** → Your service → Logs
2. **Try OAuth login**
3. **Look for these log messages:**
   - `[Auth] getAuthRedirectUrl called (client):` - Shows what URL your code is using
   - `[Callback] Environment check:` - Shows what environment variables are available
   - `[Callback] Using base URL from env:` - Shows the final redirect URL

## Why Port 8080?

Port 8080 suggests:
- Railway might have used port 8080 during initial setup
- `NEXT_PUBLIC_APP_URL` might be set to `localhost:8080` in Railway
- Google Cloud Console might have `localhost:8080` cached

## Verification Checklist

- [ ] `NEXT_PUBLIC_APP_URL` is set in Railway to production URL
- [ ] Google Cloud Console only has Supabase callback URL (no localhost)
- [ ] Supabase URL config is correct (already verified ✅)
- [ ] Railway logs show correct environment variables
- [ ] Browser console shows correct redirect URL in `[Auth]` logs

## After Fixing

1. **Redeploy on Railway** (if you changed env vars)
2. **Wait 2-3 minutes** for changes to propagate
3. **Clear browser cache/cookies**
4. **Test in incognito window**
5. **Check browser console** for `[Auth]` and `[Callback]` logs

