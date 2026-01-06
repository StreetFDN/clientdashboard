# Testing GitHub Integration

## Quick Test Checklist

### 1. Check Environment Variables
- [ ] `.env.local` has all GitHub variables filled
- [ ] `GITHUB_APP_ID` is set
- [ ] `GITHUB_APP_PRIVATE_KEY` is set (full key)
- [ ] `GITHUB_APP_INSTALL_URL` is set
- [ ] `GITHUB_BACKEND_URL` is set

### 2. Test API Endpoints

**Test Installation Status:**
```bash
curl http://localhost:3000/api/github/installation
```

**Test Activity Endpoint (will fail if not authenticated):**
```bash
curl http://localhost:3000/api/github/activity?period=week
```

### 3. Test in Browser

1. **Go to Dev Update Page:**
   - Navigate to: http://localhost:3000/dev-update
   - Should see GitHub App installation component

2. **Check Installation Status:**
   - Component should show "Install GitHub App" or "GitHub App Installed"
   - If installed, should show connected account

3. **Test Activity Fetch:**
   - Click refresh button
   - Check browser console (F12) for errors
   - Check Network tab for API calls

### 4. Common Issues

**"Failed to fetch GitHub activity"**
- Check `GITHUB_BACKEND_URL` is correct
- Verify backend is running
- Check backend logs

**"GitHub App not installed"**
- Click "Install GitHub App" button
- Complete installation on GitHub
- Should redirect back to dashboard

**"Unauthorized" error**
- Make sure you're logged in
- Check Supabase auth is working

