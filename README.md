# bg.removal – AI Background Remover SaaS

Full-stack SaaS: upload an image, remove its background with AI, download a transparent PNG.
New users get 5 free credits, and more credits are bought through Stripe.

## Structure
- `web/` – Next.js 16, TypeScript, Tailwind, Clerk (auth), Prisma + Neon Postgres, Stripe
- `bg-service/` – Python FastAPI service running the open-source rembg model

## How it works
1. The user signs in with Clerk and uploads an image.
2. The Next.js API route atomically deducts 1 credit in the database.
3. The route sends the image to the Python service, protected by a shared secret.
4. The service returns a transparent PNG. On failure the credit is refunded.

## Run locally
**Python service**
    cd bg-service && python3 -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    API_SECRET=local-dev-secret uvicorn app:app --port 8000

**Web app** (copy `web/.env.example` to `web/.env` and fill in the values)
    cd web && npm install && npx prisma migrate dev && npm run dev


