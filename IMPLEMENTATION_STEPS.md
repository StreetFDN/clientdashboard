# Implementation Steps: Unified Supabase Auth

## Overview

This guide walks through implementing unified authentication between the frontend (Supabase) and backend (street-client).

## Part 1: Backend Changes (street-client)

### Step 1: Install Dependencies

In your `street-client` repository:

```bash
npm install @supabase/supabase-js
```

### Step 2: Add Environment Variables

In Railway (`street-client` service), add:
- `SUPABASE_URL` - Your Supabase project URL (e.g., `https://wharallqyamfretztuas.supabase.co`)
- `SUPABASE_ANON_KEY` - Your Supabase anon key

### Step 3: Update Prisma Schema

Add `supabaseId` field to your `User` model:

```prisma
model User {
  // ... existing fields
  supabaseId  String?  @unique  // Add this line
  // ... rest of fields
}
```

Then run migration:
```bash
npx prisma migrate dev --name add_supabase_id
# or
npx prisma db push
```

### Step 4: Create Supabase Auth Middleware

1. Copy `street-client-supabase-auth-middleware.ts` to:
   `street-client/src/middleware/supabaseAuth.ts`

2. Update `src/middleware/auth.ts` to use the new middleware:

```typescript
// Replace the existing requireAuth with:
import { requireAuth } from './supabaseAuth';
export { requireAuth };
```

Or update it to import and use:

```typescript
import { requireAuth as supabaseRequireAuth } from './supabaseAuth';

// Use supabaseRequireAuth instead of the old requireAuth
export { supabaseRequireAuth as requireAuth };
```

### Step 5: Deploy Backend

Commit and push changes to `street-client`, Railway will auto-deploy.

## Part 2: Frontend Changes (clientdashboard)

### Already Done! ✅

The frontend has been updated to:
- Get Supabase JWT token from session
- Send token in `Authorization: Bearer <token>` header
- Fallback to cookies if no token

## Part 3: Testing

### Test 1: Verify Backend Accepts JWT

1. Get your Supabase JWT token (from browser DevTools → Application → Cookies → `sb-*-auth-token`)
2. Test with curl:

```bash
curl -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  https://street-client-production.up.railway.app/api/clients
```

Should return your clients (not 401).

### Test 2: Test from Frontend

1. Make sure you're logged in to the frontend (Supabase)
2. Go to `/dev-update`
3. Should load activity data without needing backend GitHub OAuth

## How It Works

1. **Frontend** gets Supabase JWT token from session
2. **Frontend** sends token in `Authorization: Bearer <token>` header
3. **Backend** receives token and verifies with Supabase
4. **Backend** looks up or creates user by email/GitHub login
5. **Backend** links Supabase user to backend user via `supabaseId`
6. **Backend** sets `req.userId` and continues

## Backward Compatibility

The middleware maintains backward compatibility:
- If Supabase token is provided → uses Supabase auth
- If no token but session exists → uses session auth (GitHub OAuth)
- If neither → returns 401

This means existing GitHub OAuth flows still work!

## Troubleshooting

### "Supabase credentials not configured"
- Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in Railway

### "Failed to authenticate" (500 error)
- Check backend logs for database errors
- Verify Prisma schema includes `supabaseId` field
- Check if user creation is failing

### Still getting 401
- Verify JWT token is being sent (check Network tab)
- Check backend logs to see if token is being received
- Verify Supabase credentials are correct

## Next Steps After Implementation

1. Test with a real user
2. Monitor backend logs for any errors
3. Consider adding logging for auth attempts
4. Update any other API calls to use Supabase JWT

