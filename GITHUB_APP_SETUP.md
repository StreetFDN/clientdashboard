# GitHub App Setup Guide

This guide walks you through creating and configuring a GitHub App for the development activity integration.

## Step 1: Create a GitHub App

1. **Go to GitHub Settings**
   - Navigate to: https://github.com/settings/apps
   - Or: Your Organization → Settings → Developer settings → GitHub Apps

2. **Click "New GitHub App"**

3. **Fill in Basic Information**

   **GitHub App name:**
   ```
   Street Client Activity Tracker
   ```
   (or any name you prefer)

   **Homepage URL:**
   ```
   https://your-domain.com
   ```

   **User authorization callback URL:**
   ```
   https://your-domain.com/api/github/callback
   ```
   ⚠️ **Important:** This must match your production domain

   **Webhook URL:**
   ```
   https://your-domain.com/api/github/webhook
   ```
   (Optional, for real-time updates)

   **Webhook secret:**
   ```
   [Generate a random secret - save this!]
   ```
   You can generate one with:
   ```bash
   openssl rand -hex 32
   ```

4. **Configure Permissions**

   Under "Repository permissions", set:

   - **Metadata:** `Read-only` ✅
   - **Contents:** `Read-only` ✅
   - **Pull requests:** `Read-only` ✅
   - **Issues:** `Read-only` ✅
   - **Commit statuses:** `Read-only` ✅ (optional)

   Under "Account permissions":
   - **Email addresses:** `Read-only` ✅ (optional)

5. **Subscribe to Events** (Optional)

   - Pull request
   - Push
   - Issues
   - Issue comment

6. **Where can this GitHub App be installed?**

   Choose one:
   - ✅ **Only on this account** (if personal)
   - ✅ **Any account** (if organization-wide)

7. **Click "Create GitHub App"**

## Step 2: Get Your App Credentials

After creating the app, you'll see the app page. Note down:

1. **App ID** (e.g., `123456`)
   - Found at the top of the app page
   - Add to `.env` as `GITHUB_APP_ID`

2. **Installation URL**
   - Click "Public page" or "Install App"
   - Copy the URL (format: `https://github.com/apps/your-app-name/installations/new`)
   - Add to `.env` as `GITHUB_APP_INSTALL_URL`

3. **Generate Private Key**
   - Scroll to "Private keys" section
   - Click "Generate a private key"
   - Download the `.pem` file
   - ⚠️ **Save this securely - you can only download it once!**

## Step 3: Configure Environment Variables

1. **Copy the private key content**
   - Open the downloaded `.pem` file
   - Copy the entire content including:
     ```
     -----BEGIN RSA PRIVATE KEY-----
     [key content]
     -----END RSA PRIVATE KEY-----
     ```

2. **Add to your `.env.local` file:**

   ```env
   GITHUB_APP_ID=123456
   GITHUB_APP_INSTALL_URL=https://github.com/apps/your-app-name/installations/new
   GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
   MIIEpAIBAAKCAQEA...
   [paste full key here]
   ...
   -----END RSA PRIVATE KEY-----"
   ```

   ⚠️ **Important:** 
   - Keep the quotes around the private key
   - Include the BEGIN and END lines
   - For multi-line in `.env`, you may need to use `\n` or keep it as-is (some systems handle it automatically)

3. **For production (Vercel/Netlify/etc.):**
   - Add these variables in your platform's dashboard
   - Never commit `.env.local` to git

## Step 4: Update Callback URL

1. Go back to your GitHub App settings
2. Under "User authorization callback URL", ensure it's:
   ```
   https://your-domain.com/api/github/callback
   ```
3. For local development, you can use:
   ```
   http://localhost:3000/api/github/callback
   ```
   (But GitHub requires HTTPS in production)

## Step 5: Test Installation

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Settings or Dev Update page**
   - Go to `/settings` or `/dev-update`
   - You should see the GitHub App installation component

3. **Click "Install GitHub App"**
   - This will open GitHub's installation page
   - Select repositories you want to grant access to
   - Click "Install"

4. **Verify callback**
   - After installation, GitHub redirects to `/api/github/callback`
   - You should be redirected to `/dev-update?installed=true`
   - Check that installation status shows as installed

## Troubleshooting

### "Installation failed" error

- Check that `GITHUB_APP_INSTALL_URL` is correct
- Verify callback URL in GitHub App settings matches your domain
- Check browser console for errors

### Private key format issues

If you get authentication errors:
- Ensure the private key includes BEGIN and END lines
- Check for extra spaces or line breaks
- Try wrapping in quotes in `.env`
- For production, some platforms require base64 encoding

### Callback not working

- Verify the callback URL in GitHub App settings
- Check that your domain is accessible
- Ensure HTTPS is enabled (GitHub requires it)
- Check server logs for callback errors

## Security Best Practices

1. ✅ **Never commit private keys to git**
   - Already in `.gitignore`
   - Double-check before committing

2. ✅ **Use environment variables**
   - Never hardcode credentials
   - Use `.env.local` for local development

3. ✅ **Rotate keys if compromised**
   - Generate new private key in GitHub App settings
   - Update all environments immediately

4. ✅ **Limit repository access**
   - Only grant access to necessary repositories
   - Use organization-level installation for better control

## Next Steps

After setting up the GitHub App:

1. ✅ Configure the backend API (see `BACKEND_API_SETUP.md`)
2. ✅ Run database migration (`supabase-github-integration.sql`)
3. ✅ Test the full integration flow

