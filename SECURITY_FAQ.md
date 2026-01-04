# Security FAQ - Supabase Keys and Best Practices

## 🔐 Anon Key vs Service Role Key

### **Anon/Public Key** (What you're using: `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

**What it is:**
- Public key that can be exposed in client-side code
- Has **limited permissions** based on Row Level Security (RLS) policies
- Safe to use in browser, React components, etc.

**Security:**
- ✅ **Safe to expose** in client-side code
- ✅ **Protected by RLS** - Database policies control what users can access
- ✅ **No admin privileges** - Cannot bypass security policies
- ⚠️ **Must set up RLS** - Without RLS, users could access all data

**When to use:**
- Client-side components
- Browser JavaScript
- Public API calls
- User-facing features

**Example:**
```typescript
// Safe to use in browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ✅ Safe
)
```

### **Service Role Key** (What you're using: `SUPABASE_SERVICE_ROLE_KEY`)

**What it is:**
- **Admin key** with full database access
- **Bypasses Row Level Security** - Has complete control
- **NEVER expose in client-side code**

**Security:**
- ⚠️ **DANGEROUS if exposed** - Full database access
- ⚠️ **Bypasses all security** - No RLS protection
- ✅ **Safe in server-side only** - API routes, server components

**When to use:**
- Server-side API routes only
- Admin operations
- Background jobs
- Server components (Next.js)

**Example:**
```typescript
// ✅ Safe in API route (server-side)
export async function POST() {
  const supabase = createServerClient() // Uses service role key
  // Admin operations here
}

// ❌ NEVER in browser
const supabase = createClient(url, serviceRoleKey) // DANGEROUS!
```

### **Recommendation:**

✅ **Use Anon Key for client-side** - It's designed for this!
- Set up Row Level Security (RLS) policies
- Anon key is safe because RLS protects your data
- This is the correct approach

❌ **Don't use Service Role Key in client**
- Only use in server-side code
- Keep it secret

---

## 🔒 How .env Files Are Secured

### **1. Git Ignore Protection**

Your `.gitignore` file should include:
```
.env
.env.local
.env*.local
```

**How it works:**
- Git **never commits** `.env` files
- They stay on your local machine
- Never pushed to GitHub

**Check your `.gitignore`:**
```bash
cat .gitignore | grep .env
```

### **2. Environment Variable Security**

**Local Development:**
- `.env` file is on your computer only
- Not accessible via web
- Not in version control

**Production (Vercel/Netlify/etc.):**
- Environment variables stored in platform dashboard
- Encrypted at rest
- Only accessible to your application
- Not exposed to client-side (unless `NEXT_PUBLIC_` prefix)

### **3. How Next.js Handles Environment Variables**

**Server-side only** (default):
```env
SUPABASE_SERVICE_ROLE_KEY=secret
```
- ✅ Only accessible in API routes
- ✅ Only accessible in server components
- ✅ Never sent to browser
- ✅ Secure

**Client-side** (requires `NEXT_PUBLIC_` prefix):
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
- ⚠️ Exposed to browser
- ⚠️ Visible in client-side code
- ✅ Safe for anon key (protected by RLS)
- ❌ Never use service role key with `NEXT_PUBLIC_`

### **4. Security Layers**

```
┌─────────────────────────────────────┐
│  Your .env file (local)             │
│  - Not in git                        │
│  - Not accessible via web            │
│  - Encrypted at rest (production)   │
└─────────────────────────────────────┘
           │
           │ Next.js reads at build/runtime
           │
           ▼
┌─────────────────────────────────────┐
│  Server-side code                    │
│  - All env vars available            │
│  - Service role key safe here        │
└─────────────────────────────────────┘
           │
           │ Only NEXT_PUBLIC_* vars
           │
           ▼
┌─────────────────────────────────────┐
│  Client-side code (browser)          │
│  - Only NEXT_PUBLIC_* vars           │
│  - Anon key safe (RLS protected)    │
│  - Service role key NEVER here       │
└─────────────────────────────────────┘
```

---

## 🛡️ GitHub Secrets vs Private Repo

### **GitHub Secrets (What you did)**

**What they are:**
- Encrypted storage for sensitive data
- Accessible to GitHub Actions (CI/CD)
- Not visible in code or logs

**When to use:**
- ✅ CI/CD pipelines
- ✅ Automated deployments
- ✅ GitHub Actions workflows
- ✅ Deployment platforms (Vercel, Netlify)

**Security:**
- ✅ Encrypted at rest
- ✅ Only accessible to authorized workflows
- ✅ Not visible in repository
- ✅ Can be rotated easily

**Your setup:**
```yaml
# .github/workflows/deploy.yml
env:
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

### **Private vs Public Repo**

**Private Repo:**
- ✅ **Recommended for production apps**
- ✅ Prevents accidental exposure
- ✅ Limits who can see your code
- ✅ Better for client projects

**Public Repo:**
- ⚠️ Code is visible to everyone
- ⚠️ If secrets accidentally committed, they're exposed
- ✅ Good for open source
- ✅ Good for learning/portfolio

### **Recommendation:**

**For a client dashboard:**
✅ **Make it private** - Not overkill, it's best practice!

**Why:**
1. **Client data protection** - Even if no secrets, code structure reveals security
2. **Business logic** - Your implementation details are proprietary
3. **Security through obscurity** - Not primary security, but helps
4. **Professional** - Clients expect private repos for their projects
5. **Compliance** - Some industries require private repos

**Security layers:**
```
1. Private repo ✅ (You should do this)
2. GitHub secrets ✅ (You already did this)
3. .env in .gitignore ✅ (Standard)
4. RLS policies ✅ (Set up in Supabase)
5. Service role key server-side only ✅ (Code structure)
```

---

## ✅ Security Checklist

### **What You've Done Right:**
- ✅ Using anon key for client-side (correct!)
- ✅ Service role key in .env (not exposed)
- ✅ Added to GitHub secrets (for CI/CD)
- ✅ .env in .gitignore (standard)

### **What You Should Do:**
- [ ] **Make repo private** (recommended for client projects)
- [ ] **Set up Row Level Security (RLS)** in Supabase
- [ ] **Rotate keys periodically** (every 90 days)
- [ ] **Use different keys for dev/staging/prod**
- [ ] **Monitor Supabase dashboard** for suspicious activity
- [ ] **Enable 2FA on GitHub** (if not already)
- [ ] **Review who has repo access**

### **RLS Setup (Critical!)**

Without RLS, anon key users could access all data. Set up policies:

```sql
-- Example: Users can only see their own data
CREATE POLICY "Users can view own data"
ON your_table
FOR SELECT
USING (auth.uid() = user_id);
```

---

## 🚨 What If Secrets Are Exposed?

### **If Service Role Key is Exposed:**

1. **Immediately rotate it:**
   - Supabase Dashboard > Settings > API
   - Generate new service role key
   - Update all environments

2. **Check access logs:**
   - Supabase Dashboard > Logs
   - Look for suspicious activity

3. **Review RLS policies:**
   - Ensure they're properly configured

4. **Notify team:**
   - Update all developers
   - Update deployment platforms

### **If Anon Key is Exposed:**

- ✅ **Less critical** - Protected by RLS
- ⚠️ **Still rotate it** - Best practice
- ✅ **Review RLS policies** - Ensure they're correct
- ✅ **Monitor for abuse** - Check for unusual queries

---

## 📋 Summary

### **Your Current Setup:**
✅ **Correct!** Using anon key for client-side is the right approach.

### **Security:**
- ✅ `.env` files are secure (not in git, not exposed)
- ✅ GitHub secrets are encrypted
- ✅ Service role key only in server-side code
- ✅ Anon key safe because of RLS (set this up!)

### **Recommendations:**
1. ✅ **Make repo private** - Best practice for client projects
2. ✅ **Set up RLS** - Critical for anon key security
3. ✅ **Keep using anon key** - It's designed for client-side
4. ✅ **Service role key server-side only** - You're doing this correctly

### **You're Doing It Right!** 🎉

Your security setup is solid. The anon key is the correct choice for client-side, and as long as you:
- Set up RLS policies
- Keep service role key server-side only
- Make the repo private

You'll have a secure setup!

