# Quick Start: GitHub Integration Setup

This is a step-by-step checklist to get the GitHub integration working.

## ✅ Step 2: Configure Environment Variables

1. **Create or update `.env.local` file** in the project root:

```bash
# If file doesn't exist, create it:
touch .env.local
```

2. **Add these GitHub variables** (you'll get the values from Step 4):

```env
# GitHub App Configuration
GITHUB_APP_ID=your_app_id_here
GITHUB_APP_INSTALL_URL=https://github.com/apps/your-app-name/installations/new
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END RSA PRIVATE KEY-----"

# Backend API URL
GITHUB_BACKEND_URL=https://api.streetlabs.dev/github
# For local development, use:
# GITHUB_BACKEND_URL=http://localhost:3001/github
```

3. **Restart your dev server** after adding variables:
```bash
npm run dev
```

---

## ✅ Step 3: Set Up Backend API (street-client)

Your `street-client` backend needs to expose one endpoint:

### Required Endpoint: `GET /github/activity`

**See detailed guide:** `BACKEND_API_SETUP.md`

**Quick checklist:**
- [ ] Install `@octokit/rest` package
- [ ] Create route handler for `/github/activity`
- [ ] Implement authentication check
- [ ] Fetch GitHub data using Octokit
- [ ] Return data in the expected JSON format
- [ ] Test the endpoint with curl or Postman

**Minimal example:**
```javascript
// In your street-client backend
app.get('/github/activity', async (req, res) => {
  // 1. Check auth
  // 2. Get user's GitHub installation
  // 3. Fetch data from GitHub API
  // 4. Format and return JSON
  res.json({ /* activity data */ });
});
```

**Test it:**
```bash
curl http://localhost:3001/github/activity?period=week
```

---

## ✅ Step 4: Create GitHub App

**See detailed guide:** `GITHUB_APP_SETUP.md`

### Quick Steps:

1. **Go to GitHub App creation:**
   - Personal: https://github.com/settings/apps/new
   - Organization: Your Org → Settings → Developer settings → GitHub Apps → New GitHub App

2. **Fill in the form:**
   - **Name:** `Street Client Activity` (or your choice)
   - **Homepage URL:** `https://your-domain.com`
   - **Callback URL:** `https://your-domain.com/api/github/callback`
   - **Webhook URL:** `https://your-domain.com/api/github/webhook` (optional)

3. **Set Permissions:**
   - Repository: Metadata → Read-only ✅
   - Repository: Contents → Read-only ✅
   - Repository: Pull requests → Read-only ✅
   - Repository: Issues → Read-only ✅

4. **Create the App**

5. **Get your credentials:**
   - **App ID:** Copy from the app page (top)
   - **Installation URL:** Click "Public page" → Copy URL
   - **Private Key:** Click "Generate a private key" → Download `.pem` file

6. **Add to `.env.local`:**
   ```env
   GITHUB_APP_ID=123456  # Your App ID
   GITHUB_APP_INSTALL_URL=https://github.com/apps/your-app-name/installations/new
   GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n[paste key content]\n-----END RSA PRIVATE KEY-----"
   ```

---

## 🧪 Testing the Integration

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Dev Update page:**
   - Go to `http://localhost:3000/dev-update`

3. **Install GitHub App:**
   - Click "Install GitHub App" button
   - Select repositories
   - Complete installation

4. **Verify data loads:**
   - After installation, activity should load automatically
   - Check that commits, PRs, issues appear

---

## 🐛 Troubleshooting

### Environment variables not working?
- Make sure file is named `.env.local` (not `.env`)
- Restart dev server after changes
- Check for typos in variable names

### Backend API not responding?
- Verify backend is running
- Check `GITHUB_BACKEND_URL` is correct
- Test endpoint directly with curl
- Check backend logs for errors

### GitHub App installation fails?
- Verify callback URL in GitHub App settings
- Check that App ID and Install URL are correct
- Ensure private key format is correct (with BEGIN/END lines)

### No activity showing?
- Verify GitHub App has access to repositories
- Check backend API is returning data
- Open browser DevTools → Network tab to see API calls
- Check backend logs for GitHub API errors

---

## 📚 Full Documentation

- **GitHub App Setup:** `GITHUB_APP_SETUP.md`
- **Backend API Setup:** `BACKEND_API_SETUP.md`
- **Integration Guide:** `GITHUB_INTEGRATION_SETUP.md`

---

## ✅ Checklist

Before you're done, verify:

- [ ] `.env.local` has all GitHub variables
- [ ] GitHub App is created and configured
- [ ] Backend API endpoint `/github/activity` is working
- [ ] Database migration `supabase-github-integration.sql` is run
- [ ] Can install GitHub App from dashboard
- [ ] Activity data appears on Dev Update page

---

**Need help?** Check the detailed guides or review the error messages in browser console and server logs.

