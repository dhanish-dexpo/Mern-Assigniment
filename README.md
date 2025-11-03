## Expert Feedback System

HR can record consultation feedback for users. On submission, feedback is saved to MongoDB and an email is sent to the user with a secure link to view their feedback.

### Stack
- Frontend: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- Backend: Next.js Route Handlers (API), NextAuth (Google), Mongoose
- DB: MongoDB Atlas
- Email: Resend (or SMTP alternative)

---

## Local Setup

1) Install deps
```bash
npm install
```

2) Create `.env.local`
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=REPLACE_WITH_RANDOM_BASE64_32
APP_BASE_URL=http://localhost:3000

# Comma-separated: exact emails or domains prefixed with @
HR_ALLOWED_EMAILS=hr@example.com,@yourcompany.com

# Google OAuth (for HR sign-in)
GOOGLE_CLIENT_ID=REPLACE_ME
GOOGLE_CLIENT_SECRET=REPLACE_ME

# MongoDB
MONGODB_URI=REPLACE_ME
MONGODB_DB=expert-feedback

# Resend (emails)
RESEND_API_KEY=REPLACE_ME
EMAIL_FROM=no-reply@yourdomain.com
```

3) Run
```bash
npm run dev
# http://localhost:3000
```

---

## Usage
- HR Login: `/hr/login`
- HR Feedback Form: `/hr/feedback/new`
- User View (tokenized): `/view/[token]`

Flow:
1. HR signs in with a Google account allowed by `HR_ALLOWED_EMAILS`.
2. HR submits the feedback form.
3. App saves to MongoDB and emails the user a secure link.
4. User opens `/view/[token]` to read-only view their feedback.

---

## Deployment

Recommend Vercel. Set the same env vars in Vercel Project Settings.

Required envs in production:
- NEXTAUTH_URL=https://<your-vercel-domain>
- NEXTAUTH_SECRET
- APP_BASE_URL=https://<your-vercel-domain>
- HR_ALLOWED_EMAILS
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- MONGODB_URI / MONGODB_DB
- RESEND_API_KEY / EMAIL_FROM

---

## Email Provider
Default integration is Resend. Verify sending domain or use `onboarding@resend.dev` for testing.

Alternative: configure SMTP + Nodemailer and update the API route accordingly.

---

## Demo Credentials (fill in before sharing)
- HR: hr@example.com
- User: user@example.com

---

## Security Notes
- HR-only routes enforced by NextAuth + allowlist.
- User access is tokenized (`/view/[token]`).
- Server-side validation with zod and API checks.

