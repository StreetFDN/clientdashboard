# Fix: Supabase Redirecting to Localhost

## The Problem

Supabase is redirecting OAuth callbacks to `localhost:3000` even in production. This happens because Supabase uses its **Site URL** setting as the base for redirects.

## Solution: Update Supabase Site URL

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/wharallqyamfretztuas/settings/general

2. **Find "Site URL" section:**
   - Look for "Site URL" or "API Settings"
   - Current value is probably: `http://localhost:3000`

3. **Update to Production URL:**
   - Change to: `https://clientdashboard-production-ff73.up.railway.app`
   - (Use your actual Railway production URL)

4. **Also check "Redirect URLs":**
   - Add your production callback URL:
   - `https://clientdashboard-production-ff73.up.railway.app/auth/callback`
   - `https://clientdashboard-production-ff73.up.railway.app/**`

5. **Save the changes**

## Why This Happens

Supabase uses the Site URL as a fallback when constructing redirect URLs. Even if you pass `redirectTo` in the OAuth options, Supabase may override it with the Site URL if there's a mismatch.

## Additional Steps

1. **Add Environment Variable to Railway:**
   - Variable: `NEXT_PUBLIC_APP_URL`
   - Value: `https://clientdashboard-production-ff73.up.railway.app`

2. **Verify in Supabase Auth Settings:**
   - Go to: Authentication > URL Configuration
   - Site URL should match your production URL
   - Redirect URLs should include your callback path

## Testing

After updating:
1. Clear browser cache/cookies
2. Try OAuth login again
3. Should redirect to production URL, not localhost

