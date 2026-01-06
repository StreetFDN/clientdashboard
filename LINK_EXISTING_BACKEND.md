# Link Existing Backend to Frontend

## Quick Setup

Since your `street-client` backend is already working on Railway, just point this frontend to it!

## Step 1: Get Backend URL

From your Railway dashboard (the image you showed):
- Service: `street-client`
- URL: `street-client-production.up.railway.app`
- Full URL: `https://street-client-production.up.railway.app`

## Step 2: Set Environment Variable in clientdashboard

1. **Go to Railway Dashboard** → `clientdashboard` service → Variables
2. **Add/Update `GITHUB_BACKEND_URL`:**
   - Value: `https://street-client-production.up.railway.app`
   - (Make sure it includes `https://`)

## Step 3: Verify Backend Endpoint

The backend should have this endpoint:
- `GET /github/activity?period=week`

You can test it:
```bash
curl https://street-client-production.up.railway.app/github/activity?period=week
```

## That's It!

After setting `GITHUB_BACKEND_URL` in Railway:
1. Railway will auto-redeploy
2. The frontend will call your existing backend
3. No need to set up anything new

## Optional: Check Backend Endpoints

Your existing backend should have:
- ✅ `GET /github/activity` - Returns GitHub activity data
- ✅ Any other endpoints your frontend needs

If the endpoint path is different (e.g., `/api/github/activity`), update the API route in `app/api/github/activity/route.ts` to match.

