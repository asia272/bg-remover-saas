import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/get-user";
import { getPack } from "@/lib/packs";

export async function POST(req: Request) {
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Please sign in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const pack = getPack(body?.packId);
  if (!pack) {
    return NextResponse.json({ error: "BAD_REQUEST", message: "Unknown plan." }, { status: 400 });
  }

  try {
    // Create the Stripe customer once, then reuse it.
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: pack.priceCents,
            product_data: {
              name: `${pack.name} – ${pack.credits} credits`,
              description: "Background removal credits for bg.removal",
            },
          },
        },
      ],
      metadata: { userId: user.id, packId: pack.id },
      success_url: `${appUrl}/pricing?success=1`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("checkout error", e);
    return NextResponse.json(
      { error: "CHECKOUT_FAILED", message: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
