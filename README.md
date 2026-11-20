# Humanize

Paste an AI-written script, pick a tone (natural, funny, inspiring, threatening, dramatic, sarcastic, warm, authoritative), get a human-sounding rewrite. Next.js 14 + Tailwind + SQLite, email/password auth, Stripe subscriptions (free: 5 rewrites/month, Pro: unlimited).

## Run locally
1. `npm install`
2. `cp .env.example .env.local` and fill in the variables below.
3. `npm run dev` then open http://localhost:3000

## Environment variables
| Name | Purpose |
|---|---|
| `AUTH_SECRET` | Long random string signing session cookies (`openssl rand -hex 32`) |
| `ANTHROPIC_API_KEY` | From console.anthropic.com |
| `ANTHROPIC_MODEL` | Optional, default `claude-sonnet-4-6` |
| `STRIPE_SECRET_KEY` | Stripe test key (`sk_test_...`) |
| `STRIPE_PRICE_ID` | Recurring price ID (create a $12/mo product in Stripe test mode) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from the webhook step below |
| `APP_URL` | `http://localhost:3000` locally, your domain in production |
| `DATABASE_PATH` | SQLite file path (default `data.db`) |

## Stripe test mode
1. Create a product with a monthly recurring price; copy the price ID.
2. Locally run `stripe listen --forward-to localhost:3000/api/stripe/webhook` and copy the printed `whsec_...`.
3. Pay with card `4242 4242 4242 4242`, any future date, any CVC. The webhook flips the user to Pro.

## Deploy
SQLite needs a persistent disk, so use a host with volumes (not Vercel serverless):
- **Railway / Fly.io / Render:** connect the repo, build `npm run build`, start `npm start`, mount a volume at `/data`, set `DATABASE_PATH=/data/data.db`, add all env vars, set `APP_URL` to your public URL.
- In Stripe (Developers > Webhooks) add `https://YOUR_DOMAIN/api/stripe/webhook` for `checkout.session.completed` and `customer.subscription.deleted`.
- To use Vercel instead, swap `lib/db.js` for Postgres (Neon, Supabase or Turso).

## Before charging real money
Switch to live Stripe keys, add rate limiting, password reset, email verification and a billing-portal link.
