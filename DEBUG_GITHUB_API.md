# Debug GitHub API Issues

## Check Railway Logs

1. **Go to Railway Dashboard** → `clientdashboard` service → **Logs**
2. **Look for these error messages:**
   - `Error checking GitHub installation:` - Shows database/auth errors
   - `Error fetching GitHub activity:` - Shows backend connection errors
   - `[Callback] Environment check:` - Shows if env vars are loaded

## Common Issues

### 1. "Failed to check installation status"

**Check:**
- Database table `github_installations` exists in Supabase
- User is authenticated (check cookies)
- Supabase env vars are set in Railway

**Fix:**
1. Run `supabase-github-integration.sql` in Supabase SQL Editor
2. Verify table exists: Supabase → Table Editor → `github_installations`
3. Check Railway logs for specific error

### 2. "Failed to fetch activity"

**Check:**
- `GITHUB_BACKEND_URL` is set in Railway
- Backend is accessible: `curl https://street-client-production.up.railway.app/github/activity`
- Backend endpoint path matches (might be `/api/github/activity` not `/activity`)

**Fix:**
1. Verify `GITHUB_BACKEND_URL` in Railway Variables
2. Test backend endpoint directly
3. Check if endpoint path is different (e.g., `/api/github/activity`)

## Quick Test

Test the backend directly:
```bash
curl https://street-client-production.up.railway.app/github/activity?period=week
```

If this works, the issue is in the frontend API route.
If this fails, the issue is in the backend.

## Check What Endpoint Your Backend Uses

The code currently calls: `${GITHUB_BACKEND_URL}/activity`

But your backend might use:
- `/api/github/activity`
- `/github/activity`
- `/activity`

Check your `street-client` repo to see the exact route path.

