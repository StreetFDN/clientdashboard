# Backend Supabase Auth Integration

## Overview

This guide shows how to modify the `street-client` backend to accept Supabase JWT tokens, allowing unified authentication between the frontend (Supabase) and backend.

## Solution: Accept Supabase JWT Tokens

### Step 1: Install Dependencies

In `street-client`, install the Supabase client:

```bash
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Auth Middleware

Create a new file: `src/middleware/supabaseAuth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

/**
 * Middleware to authenticate using Supabase JWT tokens
 * Falls back to session auth if no token provided
 */
export async function supabaseAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Try to get Supabase JWT from Authorization header
  const authHeader = req.headers.authorization;
  let supabaseUser = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      // Verify the JWT token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (!error && user) {
        supabaseUser = user;
      }
    } catch (error) {
      console.error('Error verifying Supabase token:', error);
    }
  }

  // If we have a Supabase user, try to find or create backend user
  if (supabaseUser) {
    try {
      const { prisma } = await import('../db');
      
      // Try to find user by email
      let backendUser = await prisma.user.findFirst({
        where: {
          email: supabaseUser.email,
        },
      });

      // If not found, try to find by GitHub login (if user has GitHub provider)
      if (!backendUser && supabaseUser.app_metadata?.provider === 'github') {
        const githubLogin = supabaseUser.user_metadata?.user_name || 
                           supabaseUser.user_metadata?.preferred_username;
        
        if (githubLogin) {
          backendUser = await prisma.user.findFirst({
            where: {
              githubLogin: githubLogin,
            },
          });
        }
      }

      // If still not found, create a new user
      if (!backendUser) {
        const githubLogin = supabaseUser.user_metadata?.user_name || 
                           supabaseUser.user_metadata?.preferred_username ||
                           supabaseUser.email?.split('@')[0];

        backendUser = await prisma.user.create({
          data: {
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || 
                  supabaseUser.user_metadata?.name ||
                  supabaseUser.email?.split('@')[0] || 
                  'User',
            githubLogin: githubLogin,
            avatarUrl: supabaseUser.user_metadata?.avatar_url,
            // Link to Supabase user
            supabaseId: supabaseUser.id,
          },
        });
      } else if (!backendUser.supabaseId) {
        // Link existing user to Supabase
        backendUser = await prisma.user.update({
          where: { id: backendUser.id },
          data: { supabaseId: supabaseUser.id },
        });
      }

      // Set userId for the request (same as session auth)
      req.userId = backendUser.id;
      req.user = {
        id: backendUser.id,
        githubLogin: backendUser.githubLogin || '',
        name: backendUser.name || undefined,
        email: backendUser.email || undefined,
        avatarUrl: backendUser.avatarUrl || undefined,
      };

      return next();
    } catch (error) {
      console.error('Error linking Supabase user to backend user:', error);
      return res.status(500).json({ error: 'Failed to authenticate' });
    }
  }

  // Fall back to session auth if no Supabase token
  // This maintains backward compatibility
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }

  // No authentication found
  res.status(401).json({ error: 'Authentication required' });
}

/**
 * Combined middleware: tries Supabase auth first, then session auth
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // First try Supabase auth (async)
  supabaseAuth(req, res, next).catch(() => {
    // If Supabase auth fails, try session auth
    if (req.session && req.session.userId) {
      req.userId = req.session.userId;
      return next();
    }
    res.status(401).json({ error: 'Authentication required' });
  });
}
```

### Step 3: Update Config

Add Supabase config to `src/config.ts`:

```typescript
export const config = {
  // ... existing config
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
  // ... rest of config
};
```

### Step 4: Update Environment Variables

In Railway (`street-client` service), add:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key

### Step 5: Update Database Schema

Add `supabaseId` field to the `User` model in Prisma:

```prisma
model User {
  id          String   @id @default(uuid())
  githubId    Int?     @unique
  supabaseId  String?  @unique  // Add this
  email       String?  @unique
  githubLogin String?
  name        String?
  avatarUrl   String?
  // ... rest of fields
}
```

Then run migration:
```bash
npx prisma migrate dev --name add_supabase_id
```

### Step 6: Update Frontend to Send JWT

Update `app/api/github/activity/route.ts` to send Supabase JWT:

```typescript
// Get Supabase JWT token
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// Send token to backend
const clientsResponse = await fetch(`${backendUrl}/api/clients`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  },
  credentials: 'include',
})
```

## Alternative: Link by Email (Simpler)

If you don't want to verify JWT tokens, you can link users by email:

1. Frontend sends Supabase user email
2. Backend looks up user by email
3. Creates session automatically

This is simpler but less secure (anyone with an email could potentially access).

## Testing

1. Get Supabase JWT from frontend
2. Test with curl:
```bash
curl -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  https://street-client-production.up.railway.app/api/clients
```

## Migration Path

1. Deploy backend changes
2. Update frontend to send JWT tokens
3. Existing session-based auth still works (backward compatible)
4. New requests use Supabase JWT

