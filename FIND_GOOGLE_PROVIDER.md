# How to Find Google Provider in Supabase

## Location

The Google Provider settings are **NOT** in "OAuth Apps". They're in a different section.

## Steps to Find It

1. **In Supabase Dashboard**, look at the left sidebar
2. Under **"CONFIGURATION"** section, find:
   - **"Sign In / Providers"** ← Click this!
3. This will show you all the OAuth providers (Google, Apple, GitHub, etc.)
4. Find **"Google"** in the list
5. Toggle it ON if it's off
6. Configure the Client ID and Client Secret

## Full Path

```
Supabase Dashboard
  → Authentication (left sidebar)
    → CONFIGURATION
      → Sign In / Providers  ← HERE!
        → Google (in the list)
```

## What You'll See

When you click "Sign In / Providers", you'll see a list of providers:
- Email
- Phone
- Google ← This is what you need
- Apple
- GitHub
- etc.

Click on **"Google"** to configure it.

## What to Check

1. **Is it enabled?** (Toggle should be ON)
2. **Client ID** - Should match your Google Cloud Console Client ID
3. **Client Secret** - Should match your Google Cloud Console Client Secret
4. **Redirect URL** - Should show: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`

## Direct Link

You can also go directly to:
https://supabase.com/dashboard/project/wharallqyamfretztuas/auth/providers

This takes you straight to the providers page.

