# bg.removal – AI Background Remover SaaS

![bg.removal preview](web/public/preview.png)

Upload an image, remove its background with AI, and download a transparent PNG. New users get 5 free credits, and more credits can be bought with Stripe.

**[Live demo](https://web-beta-seven-72.vercel.app/)** 

## Demo Access

Test mode only, no real money. You can also sign up with your own email and get 5 free credits.

| Field | Value |
| --- | --- |
| Demo email | |
| Demo password | |

**Stripe test card:** `4242 4242 4242 4242` · any future expiry · any 3-digit CVC

> Image processing only works while my AI service is online. The demo video shows the full flow.

## Features

- Upload JPG, PNG or WebP (up to 4 MB) and download a transparent PNG
- Before/after slider and one-click download
- Clerk authentication
- 5 free credits per new user, 1 credit per removal
- Atomic credit deduction with automatic refund on failure
- Stripe Checkout credit packs ($10 / $50 / $250)
- Signature-verified, idempotent Stripe webhook
- Responsive UI built from a Figma design

## Tech Stack

| Layer | Technology |
| --- | --- |
| Web | Next.js 16, React, TypeScript, Tailwind CSS |
| Auth | Clerk |
| Database | PostgreSQL (Neon) + Prisma |
| Payments | Stripe Checkout + webhooks |
| AI service | Python, FastAPI, rembg |
| Hosting | Vercel (web) + self-hosted AI service via Cloudflare Tunnel |

## How It Works

```
Browser -> Next.js -> /api/remove-bg
   1. Verify user (Clerk)
   2. Atomically take 1 credit (Prisma + Neon)
   3. Send image to FastAPI + rembg
   4. Return transparent PNG (refund credit on failure)

Stripe Checkout -> webhook -> verify signature -> add credits once
```

## Run Locally

```bash
# AI service
cd bg-service
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
API_SECRET=your-secret uvicorn app:app --port 8000

# Web app
cd web
cp .env.example .env   # fill in values
npm install
npx prisma migrate dev
npm run dev

# Stripe webhooks (local)
stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded \
  --forward-to localhost:3000/api/webhooks/stripe
```

`BG_SERVICE_SECRET` (web) must equal `API_SECRET` (AI service).

## Environment Variables

Put these in `web/.env` (never commit real values).

```env
# App
NEXT_PUBLIC_APP_URL=

# Database (Neon)
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AI service
BG_SERVICE_URL=
BG_SERVICE_SECRET=
```

## Known Limitations

- The AI service runs on my own machine, so uploads only work while it is online.
- Stripe runs in test mode.

## Roadmap

- Always-on AI hosting
- Redis rate limiting
- Automated tests