# Fixing GitHub Integration Errors

## Error 1: "Failed to check installation status"

**Problem:** The `github_installations` table doesn't exist in Supabase yet.

**Solution:**
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `supabase-github-integration.sql`
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

**Verify it worked:**
- Go to **Table Editor** in Supabase
- You should see `github_installations` table listed

---

## Error 2: "Failed to load activity / Failed to fetch activity"

**Problem:** The backend API endpoint isn't responding or the URL is wrong.

**Check these:**

1. **Verify `GITHUB_BACKEND_URL` in `.env.local`:**
   ```env
   GITHUB_BACKEND_URL=https://your-backend-url/github
   ```
   - Should point to your `street-client` backend
   - Should end with `/github` (the endpoint path)

2. **Test if backend is accessible:**
   ```bash
   curl https://your-backend-url/github/activity?period=week
   ```
   - Replace with your actual backend URL
   - Should return JSON or an error message

3. **Check if backend endpoint exists:**
   - The backend should have `GET /github/activity` endpoint
   - See `BACKEND_API_SETUP.md` for implementation guide

4. **For local testing:**
   - If backend is on Railway, use the Railway URL
   - If backend is local, use `http://localhost:3001/github`
   - Make sure backend server is running

---

## Quick Fix Checklist

- [ ] Run `supabase-github-integration.sql` in Supabase SQL Editor
- [ ] Verify `GITHUB_BACKEND_URL` is correct in `.env.local`
- [ ] Restart dev server: `npm run dev`
- [ ] Test backend endpoint directly with curl
- [ ] Check browser console (F12) for detailed error messages

---

## After Fixing

1. Refresh the page: http://localhost:3000/dev-update
2. The "Failed to check installation status" should disappear
3. If backend is set up, activity should load
4. If backend isn't ready yet, you'll see "No activity found" instead of an error

