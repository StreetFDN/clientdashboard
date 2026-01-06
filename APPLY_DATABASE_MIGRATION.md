# Apply Database Migration for supabaseId Field

## Status Check

✅ **Environment Variables:** Already set in Railway!
- `SUPABASE_URL` = Set ✅
- `SUPABASE_ANON_KEY` = Set ✅

⏳ **Database Migration:** Needs to be applied

## What is the Migration?

The Prisma schema has been updated to include `supabaseId` field in the User model. This field needs to be added to your actual database.

## How to Apply the Migration

### Option 1: Using Prisma Migrate (Recommended for Production)

1. **SSH into your Railway service** (or use Railway's console):
   - Go to Railway → `street-client` service
   - Click on "Settings" tab
   - Look for "Shell" or "Console" option
   - Or use Railway CLI: `railway shell`

2. **Run the migration:**
   ```bash
   npx prisma migrate deploy
   ```
   
   This applies all pending migrations to your production database.

### Option 2: Using Prisma DB Push (Faster, but less safe)

If you don't have migrations set up, you can use:

```bash
npx prisma db push
```

This pushes the schema directly to the database without creating migration files.

### Option 3: Run Migration Locally (If connected to same DB)

If your local environment connects to the same database:

```bash
cd /path/to/street-client
npx prisma migrate deploy
# or
npx prisma db push
```

## Verify Migration Applied

After running the migration, verify the field exists:

1. **Check via Prisma Studio:**
   ```bash
   npx prisma studio
   ```
   - Open User model
   - Check if `supabaseId` column exists

2. **Or check via SQL:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'User' AND column_name = 'supabaseId';
   ```

## What the Migration Does

Adds a new column to the `User` table:
```sql
ALTER TABLE "User" ADD COLUMN "supabaseId" TEXT;
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");
```

This allows the backend to link Supabase users to backend users.

## Troubleshooting

### "Migration already applied"
- Good! The field already exists, you're done ✅

### "No migrations found"
- Use `npx prisma db push` instead
- Or create a migration: `npx prisma migrate dev --name add_supabase_id`

### "Connection error"
- Make sure `DATABASE_URL` is set correctly in Railway
- Check that the database is accessible

## After Migration

Once the migration is applied:
1. ✅ Backend can link Supabase users to backend users
2. ✅ Frontend JWT tokens will work
3. ✅ No more 401 errors!

## Quick Check

After migration, test with:
```bash
# Should return your clients (not 401)
curl -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  https://street-client-production.up.railway.app/api/clients
```

