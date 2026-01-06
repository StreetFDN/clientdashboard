# Backend API Setup Guide (street-client)

This guide explains how to set up the backend API endpoint that the dashboard will call to fetch GitHub activity data.

## Overview

The dashboard expects your `street-client` backend to expose a GitHub activity endpoint that aggregates and returns development activity data.

## Required Endpoint

### `GET /github/activity`

Fetches GitHub development activity data.

**Query Parameters:**
- `period` (optional): `week` | `month` | `all` (default: `week`)
- `repository` (optional): Filter by specific repository name

**Authentication:**
- Should verify the user is authenticated (via session/token)
- Should check that user has installed the GitHub App

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
      "id": "unique-id-1",
      "type": "commit",
      "title": "Fix authentication bug",
      "description": "Fixed issue with token refresh mechanism",
      "author": {
        "name": "John Doe",
        "username": "johndoe",
        "avatar": "https://avatars.githubusercontent.com/u/123456?v=4"
      },
      "repository": "street-client",
      "url": "https://github.com/StreetFDN/street-client/commit/abc123",
      "timestamp": "2024-01-05T10:30:00Z",
      "stats": {
        "additions": 50,
        "deletions": 20,
        "changed_files": 3,
        "comments": 0
      }
    },
    {
      "id": "unique-id-2",
      "type": "pull_request",
      "title": "Add new feature: GitHub integration",
      "description": "Implements GitHub activity tracking",
      "author": {
        "name": "Jane Smith",
        "username": "janesmith",
        "avatar": "https://avatars.githubusercontent.com/u/789012?v=4"
      },
      "repository": "street-client",
      "url": "https://github.com/StreetFDN/street-client/pull/42",
      "timestamp": "2024-01-04T14:20:00Z",
      "stats": {
        "additions": 200,
        "deletions": 50,
        "changed_files": 8,
        "comments": 5
      }
    },
    {
      "id": "unique-id-3",
      "type": "issue",
      "title": "Bug: Login not working",
      "description": "Users unable to log in after update",
      "author": {
        "name": "Bob Wilson",
        "username": "bobwilson",
        "avatar": "https://avatars.githubusercontent.com/u/345678?v=4"
      },
      "repository": "street-client",
      "url": "https://github.com/StreetFDN/street-client/issues/15",
      "timestamp": "2024-01-03T09:15:00Z",
      "stats": {
        "comments": 3
      }
    }
  ],
  "contributors": [
    {
      "username": "johndoe",
      "name": "John Doe",
      "avatar": "https://avatars.githubusercontent.com/u/123456?v=4",
      "contributions": 15
    },
    {
      "username": "janesmith",
      "name": "Jane Smith",
      "avatar": "https://avatars.githubusercontent.com/u/789012?v=4",
      "contributions": 12
    }
  ],
  "repositories": [
    {
      "name": "street-client",
      "url": "https://github.com/StreetFDN/street-client",
      "activity_count": 42
    }
  ]
}
```

## Implementation Example

### Using Node.js/Express

```javascript
// routes/github.js
const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');

// Get GitHub installation token for user
async function getInstallationToken(userId) {
  // Fetch installation_id from your database
  const installation = await db.getInstallation(userId);
  
  // Create Octokit instance with app credentials
  const app = new Octokit({
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
      installationId: installation.installation_id,
    },
  });
  
  return app;
}

router.get('/activity', async (req, res) => {
  try {
    // 1. Verify user authentication
    const userId = req.user.id; // From your auth middleware
    
    // 2. Get GitHub installation
    const installation = await db.getInstallation(userId);
    if (!installation) {
      return res.status(403).json({ error: 'GitHub App not installed' });
    }
    
    // 3. Create GitHub client
    const octokit = await getInstallationToken(userId);
    
    // 4. Calculate date range
    const period = req.query.period || 'week';
    const { start, end } = getDateRange(period);
    
    // 5. Fetch activities
    const activities = await fetchActivities(octokit, start, end, req.query.repository);
    
    // 6. Aggregate data
    const summary = aggregateActivities(activities, start, end, period);
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

function getDateRange(period) {
  const end = new Date();
  let start = new Date();
  
  switch (period) {
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'all':
      start = new Date(0); // Beginning of time
      break;
  }
  
  return { start: start.toISOString(), end: end.toISOString() };
}

async function fetchActivities(octokit, start, end, repository) {
  const activities = [];
  
  // Fetch commits
  const commits = await octokit.repos.listCommits({
    owner: 'StreetFDN',
    repo: repository || 'street-client',
    since: start,
    until: end,
    per_page: 100,
  });
  
  commits.data.forEach(commit => {
    activities.push({
      id: `commit-${commit.sha}`,
      type: 'commit',
      title: commit.commit.message.split('\n')[0],
      description: commit.commit.message.split('\n').slice(1).join('\n') || undefined,
      author: {
        name: commit.commit.author.name,
        username: commit.author?.login,
        avatar: commit.author?.avatar_url,
      },
      repository: repository || 'street-client',
      url: commit.html_url,
      timestamp: commit.commit.author.date,
      stats: {
        additions: 0, // Calculate from commit diff
        deletions: 0,
        changed_files: commit.stats?.total || 0,
      },
    });
  });
  
  // Fetch pull requests
  const prs = await octokit.pulls.list({
    owner: 'StreetFDN',
    repo: repository || 'street-client',
    state: 'all',
    sort: 'updated',
    per_page: 100,
  });
  
  prs.data
    .filter(pr => {
      const updated = new Date(pr.updated_at);
      return updated >= start && updated <= end;
    })
    .forEach(pr => {
      activities.push({
        id: `pr-${pr.number}`,
        type: 'pull_request',
        title: pr.title,
        description: pr.body || undefined,
        author: {
          name: pr.user.name || pr.user.login,
          username: pr.user.login,
          avatar: pr.user.avatar_url,
        },
        repository: repository || 'street-client',
        url: pr.html_url,
        timestamp: pr.updated_at,
        stats: {
          additions: pr.additions || 0,
          deletions: pr.deletions || 0,
          changed_files: pr.changed_files || 0,
          comments: pr.comments || 0,
        },
      });
    });
  
  // Fetch issues
  const issues = await octokit.issues.listForRepo({
    owner: 'StreetFDN',
    repo: repository || 'street-client',
    state: 'all',
    sort: 'updated',
    per_page: 100,
  });
  
  issues.data
    .filter(issue => !issue.pull_request) // Exclude PRs
    .filter(issue => {
      const updated = new Date(issue.updated_at);
      return updated >= start && updated <= end;
    })
    .forEach(issue => {
      activities.push({
        id: `issue-${issue.number}`,
        type: 'issue',
        title: issue.title,
        description: issue.body || undefined,
        author: {
          name: issue.user.name || issue.user.login,
          username: issue.user.login,
          avatar: issue.user.avatar_url,
        },
        repository: repository || 'street-client',
        url: issue.html_url,
        timestamp: issue.updated_at,
        stats: {
          comments: issue.comments || 0,
        },
      });
    });
  
  // Sort by timestamp (newest first)
  return activities.sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
}

function aggregateActivities(activities, start, end, period) {
  const commits = activities.filter(a => a.type === 'commit').length;
  const pull_requests = activities.filter(a => a.type === 'pull_request').length;
  const issues = activities.filter(a => a.type === 'issue').length;
  const releases = activities.filter(a => a.type === 'release').length;
  
  // Get unique contributors
  const contributorMap = new Map();
  activities.forEach(activity => {
    const key = activity.author.username;
    if (!contributorMap.has(key)) {
      contributorMap.set(key, {
        username: activity.author.username,
        name: activity.author.name,
        avatar: activity.author.avatar,
        contributions: 0,
      });
    }
    contributorMap.get(key).contributions++;
  });
  
  // Get unique repositories
  const repoMap = new Map();
  activities.forEach(activity => {
    const key = activity.repository;
    if (!repoMap.has(key)) {
      repoMap.set(key, {
        name: activity.repository,
        url: `https://github.com/StreetFDN/${activity.repository}`,
        activity_count: 0,
      });
    }
    repoMap.get(key).activity_count++;
  });
  
  // Generate period label
  let label = 'All Time';
  if (period === 'week') {
    label = 'This Week';
  } else if (period === 'month') {
    label = 'This Month';
  }
  
  return {
    period: {
      start,
      end,
      label,
    },
    total_activities: activities.length,
    commits,
    pull_requests,
    issues,
    releases,
    activities,
    contributors: Array.from(contributorMap.values())
      .sort((a, b) => b.contributions - a.contributions),
    repositories: Array.from(repoMap.values())
      .sort((a, b) => b.activity_count - a.activity_count),
  };
}

module.exports = router;
```

## Required Dependencies

```bash
npm install @octokit/rest
# or
yarn add @octokit/rest
```

## Environment Variables (Backend)

```env
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
```

## Testing the Endpoint

```bash
# Test locally
curl http://localhost:3001/github/activity?period=week \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return JSON response matching the format above
```

## Error Handling

Return appropriate HTTP status codes:

- `200` - Success
- `401` - Unauthorized (user not authenticated)
- `403` - Forbidden (GitHub App not installed)
- `500` - Server error

Error response format:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Performance Considerations

1. **Caching**: Cache GitHub API responses (5-10 minutes)
2. **Pagination**: Handle pagination for large result sets
3. **Rate Limiting**: Respect GitHub API rate limits
4. **Background Jobs**: Consider fetching data in background jobs

## Next Steps

1. Implement the endpoint in your `street-client` backend
2. Test with the dashboard
3. Monitor for errors and performance issues

