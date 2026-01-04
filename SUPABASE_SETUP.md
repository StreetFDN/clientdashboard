# Supabase Setup Guide

## What You Need to Provide

To complete the Supabase integration, I need the following from you:

### 1. **Supabase Project Credentials**

After creating your Supabase project, you'll need:

1. **Project URL**
   - Format: `https://xxxxx.supabase.co`
   - Found in: Supabase Dashboard > Settings > API > Project URL

2. **Anon/Public Key**
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Found in: Supabase Dashboard > Settings > API > Project API keys > `anon` `public`
   - Safe to expose in client-side code

3. **Service Role Key** (Keep Secret!)
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Found in: Supabase Dashboard > Settings > API > Project API keys > `service_role` `secret`
   - ⚠️ **NEVER expose this in client-side code!**
   - Only use in server-side API routes

### 2. **Environment Variables**

Once you have the credentials, add them to your `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth.js (still needed for session management)
NEXTAUTH_SECRET=generate-a-random-32-char-string
NEXTAUTH_URL=http://localhost:3000
```

### 3. **Generate NEXTAUTH_SECRET**

```bash
openssl rand -base64 32
```

Or using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Step-by-Step Setup

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up (GitHub, Google, or email)

### Step 2: Create New Project

1. Click "New Project"
2. Fill in:
   - **Name:** `client-dashboard` (or your preferred name)
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free (to start)
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

### Step 3: Get Your Credentials

1. In Supabase Dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Step 4: Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider (already enabled by default)
3. Configure email settings:
   - **Enable email confirmations:** ON (recommended)
   - **Secure email change:** ON
4. (Optional) Enable OAuth providers:
   - Google, GitHub, etc. (one-click setup)

### Step 5: Set Up Environment Variables

1. Create `.env` file in project root (if not exists):
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Test the Setup

```bash
npm run dev
```

Visit `http://localhost:3000` - your app should be running!

---

## What Supabase Handles for You

✅ **Authentication**
- Email/password signup and login
- Email verification
- Password reset
- OAuth providers (Google, GitHub, etc.)
- Magic links (passwordless)
- Session management

✅ **Database**
- PostgreSQL database
- Automatic backups
- SSL/TLS encryption
- Connection pooling

✅ **Security**
- Password hashing (bcrypt)
- JWT token management
- Rate limiting (basic)
- Row Level Security (RLS)

---

## Next Steps After Setup

1. **Set up Row Level Security (RLS)**
   - Go to Supabase Dashboard > Authentication > Policies
   - Create policies to control data access

2. **Configure Email Templates**
   - Go to Authentication > Email Templates
   - Customize verification and reset emails

3. **Set up OAuth Providers** (optional)
   - Go to Authentication > Providers
   - Enable Google, GitHub, etc.

4. **Create Database Tables**
   - Use Supabase Dashboard > Table Editor
   - Or use SQL Editor for migrations

---

## Troubleshooting

### "Missing Supabase environment variables"
- Check that all three Supabase variables are in `.env`
- Restart your dev server after adding variables

### "Invalid API key"
- Verify you copied the correct keys
- Check for extra spaces or line breaks

### "Connection refused"
- Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that your Supabase project is active

### Authentication not working
- Check Supabase Dashboard > Authentication > Providers
- Verify email provider is enabled
- Check email templates are configured

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git (already in `.gitignore`)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side operations
- Use `SUPABASE_SERVICE_ROLE_KEY` only in API routes

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## Ready to Go!

Once you provide the three Supabase credentials, I can:
1. Update the code with your credentials
2. Test the integration
3. Set up any additional features you need

**Just share:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

And we're ready to go! 🚀

