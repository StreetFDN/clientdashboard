# Testing Guide - Without Using Resources

## 🎯 Testing Strategies That Don't Cost Anything

### Strategy 1: Local Development Testing (Recommended)

**What it costs:** Nothing! All local.

**How it works:**
- Run your Next.js app locally
- Connect to Supabase (uses minimal resources)
- Test authentication and database operations
- No production traffic, no real users

**Setup:**
```bash
# 1. Start your dev server
npm run dev

# 2. Visit http://localhost:3000
# 3. Test your features locally
```

**What counts against quotas:**
- ✅ Database queries (minimal - free tier: 2GB bandwidth/month)
- ✅ Auth API calls (free tier: 50K monthly active users)
- ✅ Storage (if you test file uploads - free tier: 1GB)

**What doesn't count:**
- ✅ Local development server
- ✅ Local testing
- ✅ Code changes

---

### Strategy 2: Supabase Local Development (Advanced)

**What it costs:** Nothing! Runs entirely on your machine.

**How it works:**
- Run Supabase locally using Docker
- No connection to Supabase cloud
- Unlimited testing
- Perfect for development

**Setup:**
```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Initialize Supabase locally
supabase init

# 3. Start local Supabase
supabase start

# 4. Update your .env to use local Supabase
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=(from supabase start output)
```

**Benefits:**
- ✅ Zero cloud resource usage
- ✅ Instant testing
- ✅ Can reset database anytime
- ✅ No rate limits

**Note:** Requires Docker installed on your machine.

---

### Strategy 3: Test Mode / Mock Data

**What it costs:** Nothing! No real database operations.

**How it works:**
- Create mock data in your code
- Test UI and logic without database calls
- Only test database when needed

**Example:**
```typescript
// lib/supabase.ts
export const supabase = process.env.NODE_ENV === 'test' 
  ? createMockClient()  // Mock client for testing
  : createClient(url, key)  // Real client for development
```

---

## 📊 What Actually Uses Resources

### ✅ Free Tier Limits (You Have Plenty!)

**Supabase Free Tier:**
- **Database:** 500MB storage, 2GB bandwidth/month
- **Auth:** 50,000 monthly active users
- **Storage:** 1GB file storage, 2GB bandwidth/month
- **API:** Unlimited requests (within bandwidth limits)

**What counts:**
- Database queries (SELECT, INSERT, UPDATE, DELETE)
- Authentication operations (sign up, sign in, etc.)
- File uploads/downloads
- Real-time subscriptions

**What doesn't count:**
- Local development
- Code changes
- Building your app
- Reading documentation

---

## 🧪 Safe Testing Practices

### 1. Test Authentication Locally

**Cost:** Minimal (auth calls are free up to 50K users/month)

```typescript
// Test sign up (creates 1 user - free!)
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123'
})

// Test sign in (1 auth call - free!)
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'testpassword123'
})
```

**Clean up:**
- Delete test users in Supabase Dashboard > Authentication > Users
- Or use the same test user for all tests

### 2. Test Database Queries Locally

**Cost:** Minimal (2GB bandwidth/month is plenty for testing)

```typescript
// Test reading data (uses minimal bandwidth)
const { data, error } = await supabase
  .from('clients')
  .select('*')
  .limit(10)  // Limit results to save bandwidth

// Test writing data (small operation)
const { data, error } = await supabase
  .from('clients')
  .insert({ name: 'Test Client', user_id: userId })
```

**Best practices:**
- ✅ Use `.limit()` to restrict results
- ✅ Delete test data after testing
- ✅ Use the same test user for multiple tests
- ✅ Test locally before deploying

### 3. Test RLS Policies Safely

**Cost:** Just database queries (minimal)

**Safe testing approach:**
1. Create test data with your user ID
2. Test that you can read your own data
3. Test that you can't read other users' data
4. Delete test data when done

```typescript
// Safe RLS test
async function testRLS() {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Insert test data
  const { data: testClient } = await supabase
    .from('clients')
    .insert({ 
      name: 'Test Client',
      user_id: user.id 
    })
    .select()
    .single()
  
  // Test: Can I read my own data?
  const { data: myClients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
  
  console.log('My clients:', myClients) // Should work
  
  // Clean up: Delete test data
  await supabase
    .from('clients')
    .delete()
    .eq('id', testClient.id)
}
```

---

## 🧹 Clean Up Test Data

### Method 1: Delete via Supabase Dashboard

1. Go to Supabase Dashboard > Table Editor
2. Select your table
3. Find test rows
4. Delete them manually

### Method 2: Delete via SQL

```sql
-- Delete all test data
DELETE FROM clients WHERE name LIKE 'Test%';

-- Delete data older than 1 day (if you timestamp test data)
DELETE FROM clients WHERE created_at < NOW() - INTERVAL '1 day';
```

### Method 3: Delete via Code

```typescript
// Clean up function
async function cleanupTestData() {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Delete all test data for current user
  await supabase
    .from('clients')
    .delete()
    .eq('user_id', user.id)
    .like('name', 'Test%')  // Only delete test entries
}
```

---

## 📈 Monitor Your Usage

### Check Your Usage in Supabase Dashboard

1. Go to **Settings** > **Usage**
2. See your current usage:
   - Database size
   - Bandwidth used
   - Auth users
   - Storage used

### Set Up Usage Alerts

1. Go to **Settings** > **Billing**
2. Set up alerts for:
   - 80% of free tier limit
   - 100% of free tier limit

---

## 🎯 Recommended Testing Workflow

### Phase 1: Local Development (Free)
```bash
# 1. Start dev server
npm run dev

# 2. Test features locally
# - Create test user
# - Test authentication
# - Test database operations
# - Test RLS policies

# 3. Clean up test data
```

### Phase 2: Test Specific Features (Minimal Cost)
```typescript
// Test one feature at a time
// Delete test data after each test
// Use same test user for multiple tests
```

### Phase 3: Integration Testing (When Ready)
```typescript
// Test full user flows
// Still use test data
// Clean up after testing
```

---

## 💡 Tips to Minimize Resource Usage

### 1. Reuse Test Users
```typescript
// Instead of creating new users for each test
// Use the same test user
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123'
}
```

### 2. Use Limits
```typescript
// Always limit queries
.select('*')
.limit(10)  // Don't fetch everything
```

### 3. Delete Test Data Regularly
```typescript
// Clean up after each test session
await cleanupTestData()
```

### 4. Test Locally First
```bash
# Test in local dev before testing with real Supabase
npm run dev  # Local testing
```

### 5. Use Supabase Local (Advanced)
```bash
# Run Supabase locally - zero cloud usage
supabase start
```

---

## 🚨 What to Avoid

### ❌ Don't:
- Create hundreds of test users
- Insert thousands of test rows
- Run tests in production
- Leave test data in database
- Test file uploads with large files repeatedly

### ✅ Do:
- Use one test user
- Create minimal test data
- Delete test data after testing
- Test locally first
- Monitor your usage

---

## 📊 Realistic Usage Estimates

### For Development/Testing:

**Typical usage:**
- **Database queries:** ~100-500 queries/day (well under 2GB/month)
- **Auth operations:** ~10-50 operations/day (well under 50K/month)
- **Storage:** ~10-50MB for testing (well under 1GB)

**You have plenty of room!** The free tier is very generous for development.

---

## 🧪 Quick Test Script

Here's a safe test script you can run:

```typescript
// test-supabase.ts
import { supabase } from './lib/supabase'

async function safeTest() {
  console.log('🧪 Starting safe Supabase test...')
  
  // 1. Test authentication
  console.log('1. Testing authentication...')
  const { data: { user }, error: authError } = await supabase.auth.signUp({
    email: `test-${Date.now()}@example.com`,  // Unique email
    password: 'testpassword123'
  })
  
  if (authError) {
    console.error('Auth error:', authError)
    return
  }
  
  console.log('✅ User created:', user?.email)
  
  // 2. Test database (if you have a table)
  // Uncomment when you have a table set up
  /*
  console.log('2. Testing database...')
  const { data: testData, error: dbError } = await supabase
    .from('clients')
    .insert({ 
      name: 'Test Client',
      user_id: user?.id 
    })
    .select()
    .single()
  
  if (dbError) {
    console.error('DB error:', dbError)
  } else {
    console.log('✅ Data inserted:', testData)
    
    // 3. Clean up
    console.log('3. Cleaning up...')
    await supabase
      .from('clients')
      .delete()
      .eq('id', testData.id)
    console.log('✅ Test data deleted')
  }
  */
  
  // 4. Clean up test user (optional)
  // You can keep the test user for future tests
  console.log('✅ Test complete!')
}

// Run test
safeTest().catch(console.error)
```

---

## 🎯 Summary

### Best Practices:
1. ✅ **Test locally** - `npm run dev` (no cloud usage)
2. ✅ **Use one test user** - Reuse for all tests
3. ✅ **Limit queries** - Use `.limit()` and specific selects
4. ✅ **Clean up** - Delete test data after testing
5. ✅ **Monitor usage** - Check Supabase dashboard regularly

### What You Can Test Safely:
- ✅ Authentication (sign up, sign in, sign out)
- ✅ Database queries (with limits)
- ✅ RLS policies
- ✅ UI components
- ✅ API routes

### Free Tier is Generous:
- **50K monthly active users** - You won't hit this testing
- **2GB bandwidth/month** - Plenty for development
- **500MB database** - More than enough for testing
- **1GB storage** - Sufficient for file testing

**Bottom line:** You can test extensively without worrying about hitting limits! 🎉

---

## 🚀 Quick Start Testing

```bash
# 1. Start your app
npm run dev

# 2. Visit http://localhost:3000

# 3. Test features:
#    - Sign up a test user
#    - Sign in
#    - Test database operations
#    - Test RLS policies

# 4. Check usage in Supabase Dashboard
#    Settings > Usage

# 5. Clean up test data when done
```

**You're all set!** Start testing - the free tier is very generous for development. 🎉

