# Backend Authentication Issue

## The Problem

The `street-client` backend uses **GitHub OAuth with express-session**, while the frontend uses **Supabase authentication**. These are two separate authentication systems.

When the frontend tries to call the backend API, it gets `401 Unauthorized` because:
- Frontend has Supabase auth cookies
- Backend expects GitHub OAuth session cookies
- These don't match!

## Solutions

### Option 1: Authenticate with Backend Separately (Quick Fix)

Users need to authenticate with the backend's GitHub OAuth flow:

1. Redirect users to: `https://street-client-production.up.railway.app/api/auth/github`
2. This will create a backend session
3. Then the frontend can call backend APIs

**Pros:** Works immediately, no backend changes
**Cons:** Users need to authenticate twice (Supabase + Backend)

### Option 2: Link Supabase Users to Backend Users (Better UX)

Modify the backend to:
1. Accept Supabase JWT tokens
2. Look up backend user by email/GitHub login
3. Create session automatically

**Pros:** Single sign-on experience
**Cons:** Requires backend changes

### Option 3: Use API Keys/Tokens (Most Secure)

1. Backend generates API tokens for users
2. Frontend stores tokens
3. Frontend sends tokens in Authorization header

**Pros:** Secure, works across domains
**Cons:** Requires backend changes, token management

## Current Implementation

The code now returns a helpful error message when backend auth fails, including the auth URL.

## Recommended Next Steps

1. **Short term:** Show users a message to authenticate with backend
2. **Long term:** Modify backend to accept Supabase JWT tokens or create a linking mechanism

