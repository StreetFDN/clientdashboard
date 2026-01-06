# GitHub Integration Setup Guide

This guide explains how to set up the GitHub development activity integration for the client dashboard.

## Overview

The GitHub integration allows users to:
- Track their development activity from the `street-client` repository
- View commits, pull requests, issues, and releases
- See activity summaries by week, month, or all time
- Install the GitHub App directly from the dashboard

## Prerequisites

1. A GitHub App created for your organization
2. The `street-client` backend API running and accessible
3. Supabase database with the `github_installations` table created

## Setup Steps

### 1. Database Setup

Run the SQL migration to create the required table:

```bash
# In your Supabase SQL editor, run:
supabase-github-integration.sql
```

This creates:
- `github_installations` table to store user installations
- RLS policies for secure access
- Indexes for performance

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
# GitHub App Configuration
GITHUB_APP_ID=your_github_app_id
GITHUB_APP_INSTALL_URL=https://github.com/apps/your-app-name/installations/new
GITHUB_APP_PRIVATE_KEY=your_private_key_pem_format

# Backend API URL (street-client)
GITHUB_BACKEND_URL=https://api.streetlabs.dev/github
# Or for local development:
# GITHUB_BACKEND_URL=http://localhost:3001/github
```

### 3. GitHub App Configuration

1. Go to your GitHub organization settings
2. Navigate to "Developer settings" > "GitHub Apps"
3. Create a new GitHub App or use an existing one
4. Configure the following:

   **Webhook URL:**
   ```
   https://your-domain.com/api/github/webhook
   ```

   **Callback URL:**
   ```
   https://your-domain.com/api/github/callback
   ```

   **Permissions:**
   - Repository metadata: Read-only
   - Contents: Read-only
   - Pull requests: Read-only
   - Issues: Read-only
   - Commit statuses: Read-only (optional)

5. Generate a private key and save it
6. Note your App ID

### 4. Backend API (street-client) Requirements

The backend API should expose the following endpoint:

```
GET /github/activity?period=week|month|all&repository=optional
```

**Response Format:**
```json
{
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-07T23:59:59Z",
    "label": "This Week"
  },
  "total_activities": 42,
  "commits": 25,
  "pull_requests": 10,
  "issues": 5,
  "releases": 2,
  "activities": [
    {
      "id": "unique-id",
      "type": "commit",
      "title": "Fix authentication bug",
      "description": "Fixed issue with token refresh",
      "author": {
        "name": "John Doe",
        "username": "johndoe",
        "avatar": "https://..."
      },
      "repository": "street-client",
      "url": "https://github.com/...",
      "timestamp": "2024-01-05T10:30:00Z",
      "stats": {
        "additions": 50,
        "deletions": 20,
        "changed_files": 3
      }
    }
  ],
  "contributors": [
    {
      "username": "johndoe",
      "name": "John Doe",
      "avatar": "https://...",
      "contributions": 15
    }
  ],
  "repositories": [
    {
      "name": "street-client",
      "url": "https://github.com/...",
      "activity_count": 42
    }
  ]
}
```

## Features

### Dev Update Page (`/dev-update`)

- Displays GitHub activity summary
- Shows recent activities (commits, PRs, issues, releases)
- Period selector (Week, Month, All Time)
- Real-time refresh
- GitHub App installation prompt

### Settings Page (`/settings`)

- GitHub App installation section
- Installation status
- Quick access to connect/disconnect

### Main Dashboard

- Quick access card to GitHub activity
- Installation status indicator
- Direct link to Dev Update page

## API Routes

### `GET /api/github/activity`

Fetches GitHub activity data from the backend.

**Query Parameters:**
- `period`: `week` | `month` | `all` (default: `week`)
- `repository`: Optional repository filter

**Response:** GitHubActivitySummary object

### `GET /api/github/installation`

Checks if the user has installed the GitHub App.

**Response:**
```json
{
  "installed": true,
  "installation_id": "123456",
  "account": {
    "login": "username",
    "type": "User"
  },
  "install_url": "https://..."
}
```

### `POST /api/github/installation`

Saves GitHub App installation data.

**Body:**
```json
{
  "installation_id": "123456",
  "account": {
    "login": "username",
    "type": "User"
  }
}
```

### `GET /api/github/callback`

Handles GitHub App installation callback.

**Query Parameters:**
- `installation_id`: GitHub installation ID
- `setup_action`: Installation action type

## Components

### `GitHubAppInstall`

Installation component with status checking and installation flow.

**Props:**
- `onInstallComplete?: () => void` - Callback when installation completes
- `compact?: boolean` - Compact display mode

### `GitHubActivityCard`

Displays individual activity items (commits, PRs, etc.).

### `GitHubActivitySummaryCard`

Displays activity summary with statistics and contributors.

## Troubleshooting

### Installation not saving

- Check that the `github_installations` table exists
- Verify RLS policies are correct
- Check browser console for errors

### Activity not loading

- Verify `GITHUB_BACKEND_URL` is correct
- Check backend API is accessible
- Verify user has installed the GitHub App
- Check network tab for API errors

### Callback not working

- Verify callback URL in GitHub App settings
- Check that the route is accessible
- Verify authentication is working

## Security Notes

- All API routes require authentication
- RLS policies ensure users can only access their own data
- GitHub App private key should be stored securely
- Never commit `.env.local` to version control

## Next Steps

1. Set up the GitHub App
2. Configure environment variables
3. Run database migration
4. Test installation flow
5. Verify activity data is loading correctly

