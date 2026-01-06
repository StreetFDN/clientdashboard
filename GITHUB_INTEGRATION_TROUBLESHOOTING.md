# GitHub Integration Troubleshooting

## Common Issues

### 1. "Failed to check installation status"

**Cause:** API route can't authenticate user or database table doesn't exist.

**Solutions:**
1. **Check if database table exists:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the migration: `supabase-github-integration.sql`
   - Or manually create the `github_installations` table

2. **Check Railway environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Should be your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Should be your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Should be your Supabase service role key

3. **Check if user is logged in:**
   - Make sure you're authenticated before accessing `/dev-update`
   - Try logging out and back in

### 2. "Failed to load activity" / "Failed to fetch activity"

**Cause:** Backend API is not accessible or not configured correctly.

**Solutions:**
1. **Check `GITHUB_BACKEND_URL` in Railway:**
   - Should be: `https://street-client-production.up.railway.app` (with `https://`)
   - Or: `https://api.streetlabs.dev/github` (if using that endpoint)
   - **Must include protocol** (`https://`)

2. **Verify backend is running:**
   - Check Railway logs for `street-client` service
   - Make sure the backend has the `/github/activity` endpoint
   - Test the endpoint directly: `curl https://your-backend-url/github/activity`

3. **Check backend endpoint:**
   - The backend should accept `GET /github/activity?period=week`
   - Should return JSON with `summary` and `activities` fields
   - See `BACKEND_API_SETUP.md` for implementation details

### 3. Database Table Missing

**Error:** `relation "github_installations" does not exist`

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the migration script: `supabase-github-integration.sql`
3. Verify table exists: Check Tables → `github_installations`

### 4. Authentication Issues

**Error:** `Unauthorized` or `401`

**Solutions:**
1. **Check if cookies are being sent:**
   - Open browser DevTools → Application → Cookies
   - Should see Supabase auth cookies

2. **Check Railway logs:**
   - Look for `[Callback] Environment check:` logs
   - Should show environment variables are set

3. **Try logging out and back in:**
   - Clear browser cache
   - Log out completely
   - Log back in

## Verification Steps

### 1. Check Environment Variables in Railway

Go to Railway Dashboard → Your service → Variables:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `GITHUB_BACKEND_URL` (with `https://` protocol)
- ✅ `GITHUB_APP_ID` (optional, for installation)
- ✅ `GITHUB_APP_INSTALL_URL` (optional, for installation)

### 2. Check Database Table

Go to Supabase Dashboard → Table Editor → `github_installations`:
- Should exist with columns: `user_id`, `installation_id`, `account`, `updated_at`
- Should have RLS policies enabled

### 3. Test Backend API Directly

```bash
# Test if backend is accessible
curl https://your-backend-url/github/activity?period=week

# Should return JSON with activity data
```

### 4. Check Railway Logs

When you try to load `/dev-update`, check Railway logs for:
- `[Callback] Environment check:` - Shows env vars
- `Error fetching GitHub activity:` - Shows backend errors
- `Error checking GitHub installation:` - Shows database errors

## Quick Fixes

### Fix 1: Add Protocol to GITHUB_BACKEND_URL

If `GITHUB_BACKEND_URL` is missing `https://`:

1. Go to Railway → Variables
2. Update `GITHUB_BACKEND_URL` to: `https://street-client-production.up.railway.app`
3. Redeploy

### Fix 2: Run Database Migration

1. Go to Supabase → SQL Editor
2. Copy contents of `supabase-github-integration.sql`
3. Run the SQL
4. Verify table exists in Table Editor

### Fix 3: Clear Cache and Retry

1. Clear browser cache/cookies
2. Log out and log back in
3. Try `/dev-update` again

## Still Not Working?

Check Railway logs for specific error messages:
- Database errors → Check table exists and RLS policies
- Backend connection errors → Check `GITHUB_BACKEND_URL` and backend status
- Authentication errors → Check Supabase env vars and user session

