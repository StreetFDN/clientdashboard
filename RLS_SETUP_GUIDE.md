# Row Level Security (RLS) Setup Guide

## 🔐 What is RLS and Why Do You Need It?

**Row Level Security (RLS)** is a database-level security feature that controls who can access which rows in your database tables.

**Without RLS:**
- ❌ Anyone with your anon key can access ALL data
- ❌ Users can read/write any row in any table
- ❌ No data protection at the database level

**With RLS:**
- ✅ Users can only access data they're allowed to see
- ✅ Database enforces security policies
- ✅ Even if your anon key is exposed, data is protected

**Think of it as:** Database-level access control that works automatically.

---

## 🚀 Step-by-Step Setup

### Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `wharallqyamfretztuas`

### Step 2: Navigate to Table Editor

1. In the left sidebar, click **"Table Editor"**
2. You'll see your database tables (if any exist)

### Step 3: Create a Test Table (If You Don't Have One)

For this guide, let's create a simple `clients` table:

1. Click **"New table"** (or **"Create a new table"**)
2. Name it: `clients`
3. Add columns:
   - `id` - UUID, Primary Key, Default: `gen_random_uuid()`
   - `user_id` - UUID, References `auth.users(id)` (links to Supabase auth user)
   - `name` - Text
   - `email` - Text
   - `created_at` - Timestamp, Default: `now()`
4. Click **"Save"**

### Step 4: Enable RLS on Your Table

1. In the Table Editor, click on your `clients` table
2. Look for the **"RLS"** toggle or **"Enable RLS"** button
3. **Enable RLS** - This turns on Row Level Security
4. You'll see a warning: "RLS is enabled but no policies exist" - That's expected!

**What this does:**
- Enables RLS on the table
- **By default, all access is DENIED** (secure by default)
- You must create policies to allow access

### Step 5: Create Your First Policy

Let's create a policy so users can only see their own data:

#### Option A: Using SQL Editor (Recommended)

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Policy: Users can view their own clients
CREATE POLICY "Users can view own clients"
ON clients
FOR SELECT
USING (auth.uid() = user_id);
```

4. Click **"Run"** (or press Cmd/Ctrl + Enter)

**What this does:**
- Allows users to SELECT (read) rows where `user_id` matches their authenticated user ID
- `auth.uid()` returns the current user's ID from Supabase Auth

#### Option B: Using Policy Editor (Visual)

1. In Table Editor, click on your `clients` table
2. Click the **"Policies"** tab
3. Click **"New Policy"**
4. Choose **"For full customization"**
5. Configure:
   - **Policy name:** `Users can view own clients`
   - **Allowed operation:** `SELECT`
   - **Policy definition:** `auth.uid() = user_id`
6. Click **"Save"**

### Step 6: Create More Policies

You'll need policies for different operations:

#### Policy 2: Users can insert their own clients

```sql
CREATE POLICY "Users can insert own clients"
ON clients
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### Policy 3: Users can update their own clients

```sql
CREATE POLICY "Users can update own clients"
ON clients
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### Policy 4: Users can delete their own clients

```sql
CREATE POLICY "Users can delete own clients"
ON clients
FOR DELETE
USING (auth.uid() = user_id);
```

### Step 7: Test Your Policies

Let's test that RLS is working:

1. **Test as authenticated user:**
   ```typescript
   // In your Next.js app
   import { supabase } from '@/lib/supabase'
   
   // Sign in first
   const { data: { user } } = await supabase.auth.signInWithPassword({
     email: 'test@example.com',
     password: 'password'
   })
   
   // Try to read clients
   const { data, error } = await supabase
     .from('clients')
     .select('*')
   
   // Should only return clients where user_id = current user's id
   ```

2. **Test as unauthenticated user:**
   ```typescript
   // Sign out
   await supabase.auth.signOut()
   
   // Try to read clients
   const { data, error } = await supabase
     .from('clients')
     .select('*')
   
   // Should return empty array or error (no access)
   ```

---

## 📋 Common RLS Patterns

### Pattern 1: User Owns Data (Most Common)

**Use case:** Each user has their own data (clients, projects, etc.)

```sql
-- View own data
CREATE POLICY "Users can view own data"
ON your_table
FOR SELECT
USING (auth.uid() = user_id);

-- Insert own data
CREATE POLICY "Users can insert own data"
ON your_table
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update own data
CREATE POLICY "Users can update own data"
ON your_table
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Delete own data
CREATE POLICY "Users can delete own data"
ON your_table
FOR DELETE
USING (auth.uid() = user_id);
```

### Pattern 2: Public Read, Authenticated Write

**Use case:** Anyone can read, only authenticated users can write

```sql
-- Anyone can read
CREATE POLICY "Public read access"
ON your_table
FOR SELECT
TO public
USING (true);

-- Only authenticated users can write
CREATE POLICY "Authenticated users can write"
ON your_table
FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Pattern 3: Team/Organization Based

**Use case:** Users in same organization can access shared data

```sql
-- Users can view data from their organization
CREATE POLICY "Users can view organization data"
ON your_table
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_organizations
    WHERE user_organizations.user_id = auth.uid()
    AND user_organizations.organization_id = your_table.organization_id
  )
);
```

### Pattern 4: Admin Only

**Use case:** Only admins can access certain tables

```sql
-- Only admins can access
CREATE POLICY "Admins only"
ON your_table
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);
```

### Pattern 5: Time-Based Access

**Use case:** Users can only access data within certain time windows

```sql
CREATE POLICY "Users can view active clients"
ON clients
FOR SELECT
USING (
  auth.uid() = user_id
  AND status = 'active'
  AND expires_at > now()
);
```

---

## 🛡️ Best Practices

### 1. Enable RLS on ALL Tables

**Rule:** Every table that contains user data should have RLS enabled.

```sql
-- Check which tables don't have RLS
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT IN (
  SELECT tablename 
  FROM pg_tables t
  JOIN pg_class c ON c.relname = t.tablename
  WHERE c.relrowsecurity = true
);
```

### 2. Use `auth.uid()` for User Identification

**Always use:** `auth.uid()` to get the current authenticated user's ID.

**Never use:** User-provided IDs or email addresses (can be spoofed).

### 3. Test Policies Thoroughly

**Test scenarios:**
- ✅ Authenticated user accessing own data (should work)
- ✅ Authenticated user accessing other's data (should fail)
- ✅ Unauthenticated user accessing data (should fail)
- ✅ Admin accessing all data (if applicable)

### 4. Use `USING` vs `WITH CHECK`

- **`USING`** - Controls which rows can be read/updated/deleted
- **`WITH CHECK`** - Controls which rows can be inserted/updated

**Example:**
```sql
CREATE POLICY "Users can update own data"
ON clients
FOR UPDATE
USING (auth.uid() = user_id)        -- Can only update rows they own
WITH CHECK (auth.uid() = user_id);  -- Can only set user_id to their own ID
```

### 5. Combine Multiple Conditions

**Use AND/OR for complex policies:**

```sql
CREATE POLICY "Users can view active own clients"
ON clients
FOR SELECT
USING (
  auth.uid() = user_id
  AND status = 'active'
  AND deleted_at IS NULL
);
```

### 6. Use Policy Templates

**Create reusable policy functions:**

```sql
-- Create a function for common user ownership check
CREATE OR REPLACE FUNCTION user_owns_row(user_id_col UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = user_id_col;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use in policy
CREATE POLICY "Users can view own data"
ON clients
FOR SELECT
USING (user_owns_row(user_id));
```

---

## 🧪 Testing Your RLS Setup

### Test 1: Verify RLS is Enabled

```sql
-- Check if RLS is enabled on a table
SELECT 
  tablename,
  CASE 
    WHEN c.relrowsecurity THEN 'Enabled'
    ELSE 'Disabled'
  END as rls_status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
AND tablename = 'clients';
```

### Test 2: List All Policies

```sql
-- See all policies on a table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'clients';
```

### Test 3: Test as Different Users

```typescript
// Test script
import { supabase } from '@/lib/supabase'

async function testRLS() {
  // Test 1: Unauthenticated
  await supabase.auth.signOut()
  const { data: unauthed } = await supabase.from('clients').select('*')
  console.log('Unauthenticated:', unauthed) // Should be empty or error

  // Test 2: User 1
  await supabase.auth.signInWithPassword({
    email: 'user1@example.com',
    password: 'password1'
  })
  const { data: user1 } = await supabase.from('clients').select('*')
  console.log('User 1:', user1) // Should only see user1's clients

  // Test 3: User 2
  await supabase.auth.signInWithPassword({
    email: 'user2@example.com',
    password: 'password2'
  })
  const { data: user2 } = await supabase.from('clients').select('*')
  console.log('User 2:', user2) // Should only see user2's clients
}
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting to Enable RLS

**Problem:** Table has no RLS, anyone can access all data.

**Solution:** Always enable RLS immediately after creating a table.

### ❌ Mistake 2: Using User-Provided IDs

**Problem:**
```sql
-- WRONG - user can spoof this
USING (user_id = $1)  -- Don't trust user input!
```

**Solution:**
```sql
-- CORRECT - use auth.uid()
USING (auth.uid() = user_id)
```

### ❌ Mistake 3: Too Permissive Policies

**Problem:**
```sql
-- WRONG - allows anyone to see everything
USING (true)
```

**Solution:** Always restrict to specific users/conditions.

### ❌ Mistake 4: Not Testing Policies

**Problem:** Assumes policies work without testing.

**Solution:** Always test with different users and scenarios.

### ❌ Mistake 5: Forgetting WITH CHECK

**Problem:**
```sql
-- Missing WITH CHECK allows users to insert with wrong user_id
CREATE POLICY "Users can insert"
ON clients
FOR INSERT
-- Missing WITH CHECK!
```

**Solution:**
```sql
CREATE POLICY "Users can insert"
ON clients
FOR INSERT
WITH CHECK (auth.uid() = user_id)  -- Always include!
```

---

## 📝 Quick Reference: RLS Commands

### Enable RLS on Table
```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

### Disable RLS (use with caution!)
```sql
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

### Create Policy
```sql
CREATE POLICY "policy_name"
ON table_name
FOR operation  -- SELECT, INSERT, UPDATE, DELETE, or ALL
USING (condition)  -- For SELECT, UPDATE, DELETE
WITH CHECK (condition);  -- For INSERT, UPDATE
```

### Drop Policy
```sql
DROP POLICY "policy_name" ON table_name;
```

### List Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

---

## ✅ Your Action Items

1. **Enable RLS on all tables** that contain user data
2. **Create policies** for each operation (SELECT, INSERT, UPDATE, DELETE)
3. **Test policies** with different users
4. **Review policies** regularly as your app grows
5. **Document policies** so your team understands them

---

## 🎯 Next Steps

After setting up RLS:

1. ✅ Test your policies work correctly
2. ✅ Create authentication pages (sign up, sign in)
3. ✅ Test that users can only see their own data
4. ✅ Set up additional tables with RLS
5. ✅ Monitor Supabase logs for policy violations

---

## 📚 Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [RLS Policy Examples](https://supabase.com/docs/guides/auth/row-level-security#policy-examples)

---

## 🆘 Troubleshooting

### "Policy violation" error
- Check that RLS is enabled
- Verify policy conditions are correct
- Ensure user is authenticated (`auth.uid()` returns a value)

### "No rows returned" when there should be data
- Check policy `USING` clause
- Verify `user_id` matches `auth.uid()`
- Test with service role key (bypasses RLS) to verify data exists

### "Permission denied"
- RLS is working! (This is good)
- Create appropriate policies for the operation
- Check that user has required permissions

---

**Remember:** RLS is your first line of defense. Even if your anon key is exposed, RLS protects your data! 🔒

