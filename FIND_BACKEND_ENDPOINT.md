# How to Find Your Backend Endpoint

## Quick Test (Easiest)

Test different endpoint paths directly:

```bash
# Try these URLs in your browser or with curl:
curl https://street-client-production.up.railway.app/api/github/activity?period=week
curl https://street-client-production.up.railway.app/github/activity?period=week
curl https://street-client-production.up.railway.app/activity?period=week
```

The one that returns JSON (not 404) is the correct endpoint!

## Check Your Backend Code

### 1. Look for Route Files

In your `street-client` repository, check:

**Express.js:**
- `routes/github.js`
- `routes/api.js`
- `src/routes/github.ts`

**Fastify:**
- `routes/github.js`
- `plugins/github.js`

**Next.js API Routes:**
- `app/api/github/activity/route.ts`
- `pages/api/github/activity.ts`

**NestJS:**
- `src/github/github.controller.ts`

### 2. Search for "activity" or "github"

```bash
# In your street-client repo:
cd /path/to/street-client
grep -r "activity" . --include="*.js" --include="*.ts"
grep -r "/github" . --include="*.js" --include="*.ts"
```

### 3. Common Patterns to Look For

**Express:**
```javascript
router.get('/activity', async (req, res) => {
  // ...
});
```

**Fastify:**
```javascript
fastify.get('/activity', async (request, reply) => {
  // ...
});
```

**Next.js:**
```typescript
export async function GET(request: NextRequest) {
  // ...
}
```

### 4. Check Your Backend's Main File

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

## Check Railway Logs

1. Go to Railway → `street-client` service → Logs
2. Look for route registration messages on startup
3. Should see something like:
   - `Server listening on port...`
   - `Routes registered: /api/github/activity`

## Check Your Backend Documentation

If you have:
- `README.md` in street-client
- API documentation
- Postman collection
- OpenAPI/Swagger docs

These usually list all endpoints.

## Still Can't Find It?

1. **Check if the endpoint exists:**
   - The backend might not have this endpoint yet
   - You might need to implement it first

2. **Check the backend URL:**
   - Make sure `GITHUB_BACKEND_URL` in Railway points to the right service
   - Should be: `https://street-client-production.up.railway.app`

3. **Test with a simple endpoint:**
   ```bash
   curl https://street-client-production.up.railway.app/
   curl https://street-client-production.up.railway.app/health
   ```
   If these work, the backend is running and you just need to find the right path.

## Once You Find It

Update the frontend code in `app/api/github/activity/route.ts` to use the correct endpoint path, or let me know what it is and I'll update it!

