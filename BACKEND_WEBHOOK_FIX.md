# Backend Webhook Fix - Link Installations to Supabase Users

## Problem

When a user installs the GitHub App:
1. GitHub sends a webhook to the backend
2. The backend webhook handler (`handleInstallationCreated` in `src/routes/webhooks.ts`) tries to find a user by `githubLogin`
3. If no user is found, it creates a client with `userId: null`
4. When the frontend user (authenticated with Supabase) checks for installations, the backend's `trySupabaseAuth` creates/finds a user, but that user doesn't have any clients because the client was created with `userId: null`

## Solution

Update the backend webhook handler to also check for users by **email** when linking installations. This way, if a Supabase user has the same email as their GitHub account, the installation will be linked automatically.

## Backend Changes Needed

In `street-client/src/routes/webhooks.ts`, update `handleInstallationCreated`:

```typescript
async function handleInstallationCreated(payload: any): Promise<void> {
  const installation = payload.installation;
  const account = payload.installation.account;

  // Try to find user by GitHub login first
  let user = await prisma.user.findUnique({
    where: { githubLogin: account.login },
  });

  // If not found, try to find by email (from GitHub account)
  if (!user && account.email) {
    user = await prisma.user.findFirst({
      where: { email: account.email },
    });
  }

  // If still not found, try to find by Supabase ID (if GitHub account email matches Supabase user)
  // This requires checking Supabase users by email
  if (!user && account.email && config.supabase.url && config.supabase.anonKey) {
    const supabase = createClient(config.supabase.url, config.supabase.anonKey);
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (!error && users) {
      const supabaseUser = users.find(u => u.email === account.email);
      if (supabaseUser) {
        // Find or create backend user linked to this Supabase user
        user = await prisma.user.findUnique({
          where: { supabaseId: supabaseUser.id },
        });
        
        // If still not found, create a new user linked to Supabase
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: account.email,
              name: account.name || account.login,
              githubLogin: account.login,
              avatarUrl: account.avatar_url,
              supabaseId: supabaseUser.id,
            },
          });
        }
      }
    }
  }

  // Find or create client
  let client = await prisma.client.findFirst({
    where: {
      installations: {
        some: {
          accountLogin: account.login,
        },
      },
    },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        name: `${account.login} (GitHub)`,
        userId: user?.id || null, // Link to user if found
      },
    });
  } else if (user && !client.userId) {
    // Link existing client to user if user just logged in
    client = await prisma.client.update({
      where: { id: client.id },
      data: { userId: user.id },
    });
  }

  // ... rest of the function
}
```

## Alternative: Manual Linking Endpoint

If the above is too complex, create a manual linking endpoint that the frontend can call:

```typescript
// In street-client/src/routes/installations.ts
router.post('/link', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    
    // Find all clients with userId: null that have installations
    const orphanedClients = await prisma.client.findMany({
      where: {
        userId: null,
        installations: {
          some: {},
        },
      },
      include: {
        installations: true,
      },
    });

    // Link clients to current user if they match by email or githubLogin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      for (const client of orphanedClients) {
        for (const installation of client.installations) {
          // Check if installation matches user's GitHub login or email
          if (
            installation.accountLogin === user.githubLogin ||
            (user.email && /* check if installation account email matches */)
          ) {
            await prisma.client.update({
              where: { id: client.id },
              data: { userId: user.id },
            });
            break;
          }
        }
      }
    }

    res.json({ success: true, linked: orphanedClients.length });
  } catch (error) {
    console.error('Error linking installations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Testing

After implementing the fix:
1. Uninstall the GitHub App
2. Install it again
3. The installation should be automatically linked to your Supabase user
4. The frontend should detect it within a few seconds

