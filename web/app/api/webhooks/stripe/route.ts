import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getPack } from "@/lib/packs";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response("Missing signature or secret", { status: 400 });
  }

  // The raw body is required to verify the signature.
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      try {
        await fulfill(event, session);
      } catch (e) {
        console.error("fulfillment failed", e);
        // A 500 makes Stripe retry later.
        return new Response("Fulfillment failed", { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function fulfill(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const pack = getPack(session.metadata?.packId);

  if (!userId || !pack) {
    console.error("Webhook missing metadata", session.id);
    return; // returning normally means no retry
  }

  // Safety check: the amount paid must match our own price list.
  if (session.amount_total !== pack.priceCents || session.currency !== "usd") {
    console.error("Webhook amount mismatch", session.id, session.amount_total, session.currency);
    return;
  }

  try {
    // All three succeed together or none do.
    await prisma.$transaction([
      prisma.stripeEvent.create({ data: { id: event.id, type: event.type } }),
      prisma.creditPurchase.create({
        data: {
          userId,
          stripeSessionId: session.id,
          packId: pack.id,
          credits: pack.credits,
          amountCents: pack.priceCents,
          currency: "usd",
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: pack.credits } },
      }),
    ]);
  } catch (e) {
    // P2002 = unique constraint: this event or session was already processed.
    if ((e as { code?: string }).code === "P2002") return;
    throw e;
  }
}
