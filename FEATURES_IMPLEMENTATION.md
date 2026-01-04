# Security Features Implementation Guide

## ✅ Implemented Features

### 1. Rate Limiting ✅

**Location:** `lib/rate-limit.ts`

**What it does:**
- Prevents brute force attacks
- Limits login attempts (5 per 15 minutes)
- Limits API requests (60 per minute)
- Limits password reset requests (3 per hour)

**Usage:**
```typescript
import { withRateLimit, loginRateLimit } from '@/lib/rate-limit'

// In API route
export const POST = withRateLimit(async (req) => {
  // Your handler
}, loginRateLimit)
```

**Configuration:**
- Login: 5 attempts per 15 minutes
- API: 60 requests per minute
- Password reset: 3 requests per hour

**For production:** Consider using Redis for distributed rate limiting across multiple servers.

---

### 2. Email Verification ✅

**Location:** `lib/email.ts`

**How it works:**
1. User signs up → Generate verification token
2. Send email with verification link
3. User clicks link → Verify token
4. Mark email as verified

**Email Service Options:**

#### Option A: Resend (Recommended)
```bash
npm install resend
```

```env
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

**Free tier:** 3,000 emails/month

#### Option B: SendGrid
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

**Free tier:** 100 emails/day

#### Option C: AWS SES
```bash
npm install @aws-sdk/client-ses
```

```env
EMAIL_SERVICE=aws-ses
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

**Cost:** $0.10 per 1,000 emails

**Implementation Example:**
```typescript
import { sendEmail, generateVerificationEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Generate verification token
const token = crypto.randomBytes(32).toString('hex')
const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

// Save to database
await prisma.user.update({
  where: { id: userId },
  data: {
    emailVerificationToken: token,
    emailVerificationExpires: expires,
  },
})

// Send email
const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`
await sendEmail({
  to: user.email,
  subject: 'Verify your email address',
  html: generateVerificationEmail(verificationUrl),
})
```

---

### 3. Account Lockout ✅

**Location:** `lib/auth.ts` (already implemented)

**How it works:**
1. Track failed login attempts in database
2. After 5 failed attempts → Lock account for 15 minutes
3. Reset attempts on successful login
4. User sees clear error message

**Configuration:**
- Max attempts: 5
- Lockout duration: 15 minutes
- Auto-unlock: Yes (after lockout period)

**Database fields:**
- `failedLoginAttempts` - Count of failed attempts
- `lockedUntil` - Timestamp when account unlocks

**Customization:**
You can adjust in `lib/auth.ts`:
```typescript
const maxAttempts = 5 // Change this
const lockoutDuration = 15 * 60 * 1000 // 15 minutes - change this
```

---

### 4. Two-Factor Authentication (2FA) ✅

**Location:** `lib/two-factor.ts`

**How it works:**
1. User enables 2FA → Generate secret
2. Show QR code → User scans with authenticator app
3. User verifies with code → Enable 2FA
4. On login → Require 2FA code

**Compatible with:**
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Any TOTP app

**Implementation Steps:**

#### Step 1: Enable 2FA
```typescript
import { generateSecret, generateQRCode } from '@/lib/two-factor'

// Generate secret
const { secret, otpAuthUrl } = generateSecret(user.email, 'Client Dashboard')

// Generate QR code
const qrCodeDataUrl = await generateQRCode(otpAuthUrl)

// Save secret to database (encrypted if possible)
await prisma.user.update({
  where: { id: userId },
  data: {
    twoFactorSecret: secret, // Store encrypted in production
  },
})
```

#### Step 2: Verify 2FA Code
```typescript
import { verifyToken } from '@/lib/two-factor'

// User enters 6-digit code
const isValid = verifyToken(userEnteredCode, user.twoFactorSecret)

if (!isValid) {
  throw new Error('Invalid 2FA code')
}
```

#### Step 3: Require 2FA on Login
Update `lib/auth.ts` to check for 2FA:
```typescript
// After password verification
if (user.twoFactorEnabled) {
  // Require 2FA code in credentials
  if (!credentials.twoFactorCode) {
    throw new Error('2FA code required')
  }
  
  if (!verifyToken(credentials.twoFactorCode, user.twoFactorSecret)) {
    throw new Error('Invalid 2FA code')
  }
}
```

**Security Notes:**
- Store 2FA secret encrypted in production
- Generate backup codes for account recovery
- Allow disabling 2FA with backup code

---

## 📋 Implementation Checklist

### Rate Limiting:
- [x] Rate limit middleware created
- [x] Login rate limiting configured
- [ ] Apply to login endpoint
- [ ] Apply to password reset endpoint
- [ ] Consider Redis for production

### Email Verification:
- [x] Email service utilities created
- [x] Email templates created
- [ ] Signup flow with email verification
- [ ] Verification endpoint
- [ ] Resend verification email
- [ ] Require email verification for login (optional)

### Account Lockout:
- [x] Database fields added
- [x] Lockout logic implemented
- [x] Auto-unlock after timeout
- [ ] Admin unlock functionality
- [ ] Email notification on lockout

### 2FA:
- [x] TOTP utilities created
- [x] QR code generation
- [ ] Enable 2FA UI
- [ ] Disable 2FA UI
- [ ] Require 2FA on login
- [ ] Backup codes generation
- [ ] Encrypt 2FA secrets in database

---

## 🔧 Next Steps

1. **Create API endpoints:**
   - `/api/auth/signup` - With email verification
   - `/api/auth/verify-email` - Verify email token
   - `/api/auth/enable-2fa` - Enable 2FA
   - `/api/auth/verify-2fa` - Verify 2FA code

2. **Create UI pages:**
   - `/auth/signup` - Registration with email verification
   - `/auth/verify-email` - Email verification page
   - `/settings/security` - 2FA setup page
   - `/auth/2fa` - 2FA code entry page

3. **Update Prisma schema:**
   ```bash
   npx prisma migrate dev --name add-security-features
   ```

4. **Test all features:**
   - Test rate limiting
   - Test email verification flow
   - Test account lockout
   - Test 2FA setup and login

---

## 🚀 Production Considerations

### Rate Limiting:
- Use Redis for distributed rate limiting
- Consider different limits for different endpoints
- Monitor rate limit hits

### Email:
- Set up SPF, DKIM, DMARC records
- Monitor email deliverability
- Handle bounces and complaints
- Use dedicated IP for high volume

### Account Lockout:
- Consider progressive lockout (longer each time)
- Send email notification on lockout
- Admin unlock capability
- Log all lockout events

### 2FA:
- Encrypt 2FA secrets at rest
- Generate and store backup codes
- Allow recovery via backup codes
- Consider SMS 2FA as alternative (less secure)

---

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Resend Documentation](https://resend.com/docs)
- [TOTP RFC 6238](https://tools.ietf.org/html/rfc6238)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

