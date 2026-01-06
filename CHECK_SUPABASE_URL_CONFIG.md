# Check Supabase URL Configuration

## The Issue

Supabase's callback URL is correct (`https://wharallqyamfretztuas.supabase.co/auth/v1/callback`), but after processing OAuth, Supabase redirects to your app using its **Site URL** or **Redirect URLs** settings. If these have `localhost:8080`, that's where you'll be redirected.

## Where to Check

Go to: **https://supabase.com/dashboard/project/wharallqyamfretztuas/auth/url-configuration**

## What to Check

### 1. Site URL
**MUST be:**
```
https://clientdashboard-production-ff73.up.railway.app
```

**Remove if you see:**
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
- ❌ `http://localhost:8080/auth/callback`
- ❌ Any localhost entries

## How OAuth Flow Works

1. User clicks "Sign in with Google"
2. Your app → Supabase (with `redirectTo: https://production-url/auth/callback`)
3. Supabase → Google OAuth
4. Google → Supabase callback (`https://wharallqyamfretztuas.supabase.co/auth/v1/callback`) ✅ This is correct
5. Supabase processes OAuth → **Uses Site URL + redirectTo path** ← **This is where localhost:8080 might be coming from!**
6. Supabase → Your app (should be production URL, but might be localhost:8080 if Site URL is wrong)

## Action Steps

1. **Go to URL Configuration:**
   - https://supabase.com/dashboard/project/wharallqyamfretztuas/auth/url-configuration

2. **Check Site URL:**
   - Should be: `https://clientdashboard-production-ff73.up.railway.app`
   - If it's `localhost:8080`, change it!

3. **Check Redirect URLs:**
   - Should include your production callback URL
   - Remove ALL localhost entries

4. **Save changes**

5. **Wait 2-3 minutes** for Supabase to update its cache

6. **Test again** in an incognito window

## Why Port 8080?

Port 8080 suggests:
- Supabase has `localhost:8080` cached from a previous configuration
- A proxy or tunnel was running on 8080 during setup
- Railway might have used 8080 during initial deployment

## Verification

After updating, check:
- Site URL = production URL ✅
- Redirect URLs = production URLs only ✅
- No localhost entries anywhere ✅

Then test OAuth login again.

