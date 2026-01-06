# How to Get Runtime Logs

## The Issue

The "Deploy Logs" tab only shows startup messages. We need to see what happens when you actually visit `/dev-update` and the API calls are made.

## Steps to Get Runtime Logs

### Step 1: Trigger the API Calls

1. **Open your app in a browser:**
   - Go to: `https://clientdashboard-production-ff73.up.railway.app/dev-update`
   - This will trigger the API calls

### Step 2: Check Real-Time Logs

1. **In Railway Dashboard:**
   - Go to your `clientdashboard` service
   - Click on **"Logs"** tab (not "Deploy Logs")
   - Or look for **"HTTP Logs"** or **"Real-time Logs"**

2. **Refresh the `/dev-update` page** while watching the logs
   - You should see new log entries appear in real-time

### Step 3: Look for These Log Messages

After refreshing `/dev-update`, you should see:

**For Installation Check:**
- `[GitHub Installation] Auth check:` - Shows if user is authenticated
- `[GitHub Installation] Checking database:` - Shows if table exists
- `Error checking GitHub installation:` - Shows any errors

**For Activity Fetch:**
- `[GitHub Activity] Fetching from:` - Shows the backend URL being called
- `[GitHub Activity] Backend URL env:` - Shows the env variable value
- `Error fetching GitHub activity:` - Shows any errors

### Alternative: Check Browser Console

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Go to Network tab**
4. **Visit `/dev-update` page**
5. **Look for:**
   - Failed requests to `/api/github/installation`
   - Failed requests to `/api/github/activity`
   - Check the response/error for each request

## What to Look For

### If you see "Unauthorized" errors:
- User authentication is failing
- Check if cookies are being sent
- Try logging out and back in

### If you see "Database table not found":
- Run `supabase-github-integration.sql` in Supabase SQL Editor

### If you see "Cannot connect to backend":
- Check `GITHUB_BACKEND_URL` in Railway Variables
- Verify backend is accessible: `curl https://street-client-production.up.railway.app/github/activity`

### If you see "404" or "Not Found":
- Backend endpoint path might be wrong
- Check what endpoint your `street-client` backend actually uses

## Quick Test

Test the backend directly:
```bash
curl https://street-client-production.up.railway.app/github/activity?period=week
```

If this works, the backend is fine and the issue is in the frontend.
If this fails, check what endpoint path your backend actually uses.

