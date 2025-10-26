# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database (Postgres)
DATABASE_URL="postgresql://user:password@localhost:5432/ecom?schema=public"

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Started

### 1. Database Setup

**Option A: Local Postgres**

1. Install PostgreSQL:
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   
   # Or use Docker
   docker run --name ecom-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

2. Create database:
   ```bash
   createdb ecom
   ```

3. Set DATABASE_URL in `.env.local`:
   ```
   DATABASE_URL="postgresql://localhost:5432/ecom?schema=public"
   ```

**Option B: Hosted Database (Recommended for Production)**

Use any of these services:
- [Neon](https://neon.tech/) - Serverless Postgres (free tier)
- [Supabase](https://supabase.com/) - Free Postgres + more
- [Railway](https://railway.app/) - Easy deployment
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

### 2. Stripe Setup

1. Sign up at [stripe.com](https://stripe.com)
2. Get your test API keys from [Dashboard → API Keys](https://dashboard.stripe.com/test/apikeys)
3. For webhooks:
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # Login
   stripe login
   
   # Forward webhooks (get signing secret from output)
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### 3. Run Prisma Migrations

After setting up your database:

```bash
# Generate Prisma Client
pnpm dlx prisma generate

# Run migrations (creates tables)
pnpm dlx prisma migrate dev --name init

# Open Prisma Studio to view data
pnpm dlx prisma studio
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `STRIPE_SECRET_KEY` | Server-side Stripe key (starts with `sk_`) | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe key (starts with `pk_`) | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (starts with `whsec_`) | `whsec_...` |
| `NEXT_PUBLIC_APP_URL` | Your app's URL | `http://localhost:3000` |
| `RESEND_API_KEY` | Resend API key for sending emails (starts with `re_`) | `re_...` |

## T3 Env Validation

This project uses [@t3-oss/env-nextjs](https://env.t3.gg/) for type-safe environment variables with runtime validation.

Benefits:
- ✅ TypeScript autocomplete for env vars
- ✅ Runtime validation (app won't start with invalid env)
- ✅ Separate client/server env vars
- ✅ Build-time checks

See `src/env.js` for the schema.

## Production Deployment

When deploying to production (Vercel, Railway, etc.):

1. Add all environment variables to your hosting platform
2. Use **production** Stripe keys (not test keys)
3. Set up production webhook endpoint in Stripe Dashboard
4. Ensure `DATABASE_URL` points to your production database

## Troubleshooting

**"Invalid environment variables" error?**
- Check all required vars are in `.env.local`
- Restart dev server after adding/changing vars
- Run `pnpm dev` to see which vars are missing

**Database connection errors?**
- Verify DATABASE_URL is correct
- Ensure Postgres is running
- Check network/firewall settings

**Stripe webhook not working?**
- Ensure Stripe CLI is running (`stripe listen`)
- Copy the webhook secret from CLI output
- Restart dev server after updating STRIPE_WEBHOOK_SECRET

## Quick Reference

```bash
# View current env vars schema
cat src/env.js

# Test database connection
pnpm dlx prisma db pull

# Reset database (WARNING: deletes all data)
pnpm dlx prisma migrate reset

# View database in browser
pnpm dlx prisma studio

# Generate Prisma types after schema changes
pnpm dlx prisma generate
```

