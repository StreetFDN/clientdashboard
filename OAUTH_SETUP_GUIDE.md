# OAuth Setup Guide - Google & Apple Login

This guide will walk you through setting up Google and Apple OAuth authentication for your application.

## Prerequisites

- Supabase project: `wharallqyamfretztuas`
- Production URL: `https://clientdashboard-production-ff73.up.railway.app`
- Local URL: `http://localhost:3000`

---

## Part 1: Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click "New Project" or select an existing one
   - Give it a name (e.g., "Client Dashboard")
   - Click "Create"

3. **Configure OAuth Consent Screen** (Required first step)
   - Go to "APIs & Services" > "OAuth consent screen"
   - If you haven't set this up, you'll be prompted to do so
   - User Type: External (or Internal if using Google Workspace)
   - App name: "Client Dashboard"
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Click "Save and Continue" (default scopes are fine for basic auth)
   - Test users: **IMPORTANT** - Add your email address here (e.g., `your-email@gmail.com`)
     - This prevents the scary warning screen during testing
     - Click "Save and Continue"
   - Click "Back to Dashboard"
   
   **Note:** If you see a big warning screen when testing, it means:
   - Your app is in "Testing" mode (normal for development)
   - You need to add test users in the OAuth consent screen
   - Or publish your app to remove the warning (for production use)

4. **Create OAuth 2.0 Credentials**
   - Application type: **Web application**
   - Name: "Client Dashboard Web"
   - **Authorized redirect URIs** - Add this EXACT URL (Supabase's callback endpoint):
     ```
     https://wharallqyamfretztuas.supabase.co/auth/v1/callback
     ```
   - **Note:** This is Supabase's callback URL, not your app's URL. Supabase will handle the OAuth callback and then redirect to your app.
   - Click "Create"
   - **Copy the Client ID and Client Secret** (you'll need these for Supabase)
   - **Note:** You don't need to enable any specific API (like the old Google+ API which was shut down). OAuth 2.0 credentials work directly.

### Step 2: Configure Google in Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/wharallqyamfretztuas/auth/providers

2. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it ON
   - Enter:
     - **Client ID (for OAuth)**: Paste your Google Client ID
     - **Client Secret (for OAuth)**: Paste your Google Client Secret
   - Click "Save"

3. **Verify Redirect URL**
   - Supabase automatically uses: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`
   - Make sure this EXACT URL is in your Google Cloud Console authorized redirect URIs

---

## Part 2: Apple OAuth Setup

### Step 1: Create Apple Service ID

1. **Go to Apple Developer Portal**
   - Visit: https://developer.apple.com/account/
   - Sign in with your Apple Developer account
   - (Note: You need a paid Apple Developer account - $99/year)

2. **Create an App ID**
   - Go to "Certificates, Identifiers & Profiles"
   - Click "Identifiers" > "+" button
   - Select "App IDs" > Continue
   - Select "App" > Continue
   - Description: "Client Dashboard"
   - Bundle ID: `com.yourcompany.clientdashboard` (use reverse domain notation)
   - Enable "Sign in with Apple"
   - Click "Continue" > "Register"

3. **Create a Service ID**
   - Still in "Identifiers"
   - Click "+" button
   - Select "Services IDs" > Continue
   - Description: "Client Dashboard Web"
   - Identifier: `com.yourcompany.clientdashboard.web`
   - Enable "Sign in with Apple"
   - Click "Configure"
   - Primary App ID: Select the App ID you just created
   - **Website URLs** - Add:
     - Domains: `wharallqyamfretztuas.supabase.co`
     - Return URLs: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`
   - **Note:** This is Supabase's callback URL. Supabase will handle the OAuth callback and then redirect to your app.
   - Click "Save" > "Continue" > "Register"

4. **Create a Key for Sign in with Apple**
   - Go to "Keys" section
   - Click "+" button
   - Key Name: "Client Dashboard Sign in with Apple"
   - Enable "Sign in with Apple"
   - Click "Configure"
   - Select your Primary App ID
   - Click "Save" > "Continue" > "Register"
   - **Download the key file** (.p8 file) - You can only download it once!
   - **Note the Key ID** (shown after creation)

5. **Get Your Team ID**
   - In Apple Developer Portal, top right corner
   - Your Team ID is displayed (e.g., "ABC123DEF4")

### Step 2: Configure Apple in Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/wharallqyamfretztuas/auth/providers

2. **Enable Apple Provider**
   - Find "Apple" in the list
   - Toggle it ON
   - Enter:
     - **Services ID**: `com.yourcompany.clientdashboard.web` (your Service ID)
     - **Team ID**: Your Apple Team ID (from top right of Apple Developer Portal)
     - **Key ID**: The Key ID from the key you created
     - **Private Key**: Open the .p8 file you downloaded, copy the entire contents (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
   - Click "Save"

---

## Part 3: Understanding the OAuth Flow

### How OAuth Redirect Works:

1. **User clicks Google/Apple button** → Your app calls `signInWithOAuth()`
2. **User redirected to OAuth provider** → Google/Apple login page
3. **User authenticates** → OAuth provider redirects to Supabase
4. **Supabase processes OAuth** → At `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`
5. **Supabase redirects to your app** → At the URL you specified in `redirectTo` option (`/auth/callback`)
6. **Your app receives the session** → User is logged in

### Important: Redirect URLs must match exactly!

**The OAuth providers (Google/Apple) must have Supabase's callback URL:**
```
https://wharallqyamfretztuas.supabase.co/auth/v1/callback
```

**Your app's callback route** (already set up in code):
- Local: `http://localhost:3000/auth/callback`
- Production: `https://clientdashboard-production-ff73.up.railway.app/auth/callback`

**Make sure Supabase's callback URL is added to:**

1. **Google Cloud Console:**
   - APIs & Services > Credentials > Your OAuth Client
   - Authorized redirect URIs section
   - Add: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`

2. **Apple Developer Portal:**
   - Certificates, Identifiers & Profiles > Identifiers > Your Service ID
   - Sign in with Apple > Configure
   - Return URLs section
   - Add: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`

---

## Part 4: Test the Setup

1. **Start your local server:**
   ```bash
   npm run dev
   ```

2. **Test Google Login:**
   - Go to http://localhost:3000/auth/signin
   - Click the Google button
   - You should be redirected to Google's login page
   - After logging in, you should be redirected back to your app

3. **Test Apple Login:**
   - Click the Apple button
   - You should be redirected to Apple's login page
   - After logging in, you should be redirected back to your app

---

## Troubleshooting

### Google OAuth Issues:

- **"redirect_uri_mismatch" error:**
  - Check that the redirect URI in Google Console matches exactly: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`
  - No trailing slashes, exact match required

- **"invalid_client" error:**
  - Verify Client ID and Client Secret are correct in Supabase
  - Make sure you copied the entire Client Secret

### Apple OAuth Issues:

- **"invalid_client" error:**
  - Verify Service ID, Team ID, Key ID are correct
  - Check that the Private Key is copied completely (including BEGIN/END lines)

- **"redirect_uri_mismatch" error:**
  - Verify the Return URL in Apple Developer Portal matches: `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`

### General Issues:

- **Buttons don't do anything:**
  - Check browser console for errors
  - Verify providers are enabled in Supabase dashboard
  - Make sure you're using the correct Supabase project

- **Redirects to wrong page:**
  - Check your callback route at `/app/auth/callback/route.ts`
  - Verify `NEXTAUTH_URL` environment variable is set correctly

---

## Quick Reference

**Supabase Dashboard:**
- https://supabase.com/dashboard/project/wharallqyamfretztuas/auth/providers

**Google Cloud Console:**
- https://console.cloud.google.com/apis/credentials

**Apple Developer Portal:**
- https://developer.apple.com/account/resources/identifiers/list

**Supabase Redirect URL (use this everywhere):**
- `https://wharallqyamfretztuas.supabase.co/auth/v1/callback`

---

## Notes

- Apple OAuth requires a paid Apple Developer account ($99/year)
- Google OAuth is free
- Redirect URLs are case-sensitive and must match exactly
- It may take a few minutes for changes to propagate
- Test in an incognito/private window to avoid cached sessions

