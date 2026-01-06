# Check Your Backend Endpoint

## Quick Test Results

I tested these endpoints and all returned 404:
- ❌ `/api/github/activity` - 404
- ❌ `/github/activity` - 404  
- ❌ `/activity` - 404

This means either:
1. **The endpoint doesn't exist yet** - You need to implement it in `street-client`
2. **The endpoint path is different** - Check your backend code
3. **The endpoint requires authentication** - Try with auth headers

## How to Find the Correct Endpoint

### Option 1: Check Your street-client Repository

1. **Open your `street-client` repo** (the one on Railway)
2. **Search for "activity" or "github":**
   ```bash
   cd /path/to/street-client
   grep -r "activity" . --include="*.js" --include="*.ts"
   grep -r "/github" . --include="*.js" --include="*.ts"
   ```

3. **Look for route definitions:**
   - Express: `router.get('/activity', ...)`
   - Fastify: `fastify.get('/activity', ...)`
   - Next.js: `export async function GET(...)`

### Option 2: Check Railway Logs

1. Go to Railway → `street-client` service → **Logs**
2. Look for route registration messages on startup
3. Should see something like:
   ```
   Routes registered:
   - GET /api/github/activity
   - POST /api/github/webhook
   ```

### Option 3: Check Your Backend's Main File

Look at:
- `server.js`
- `app.js`
- `index.js`
- `main.ts`

Find where routes are registered:
```javascript
app.use('/api/github', githubRoutes);
// or
app.use('/github', githubRoutes);
```

### Option 4: Check Documentation

If you have:
- `README.md` in street-client
- API documentation
- Postman collection

These usually list all endpoints.

## If the Endpoint Doesn't Exist

You need to implement it in your `street-client` backend. See `BACKEND_API_SETUP.md` for implementation details.

The endpoint should:
1. Accept `GET` requests
2. Accept query params: `period` (week/month/all), `repository` (optional)
3. Return JSON with activity data
4. Verify user authentication

## Once You Find It

Tell me the exact endpoint path and I'll update the frontend code!

Examples:
- `/api/v1/github/activity`
- `/github/dev-activity`
- `/api/activity/github`
- etc.

