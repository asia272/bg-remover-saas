import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/get-user";


const MAX_SIZE = 4 * 1024 * 1024; // 4MB (Vercel's request body limit is 4.5MB)
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Please sign in." }, { status: 401 });
  }

  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Please sign in." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "BAD_REQUEST", message: "No image uploaded." }, { status: 400 });
  }
  if (!TYPES.includes(file.type)) {
    return NextResponse.json({ error: "BAD_TYPE", message: "Use a JPG, PNG or WebP image." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "TOO_LARGE", message: "Image must be under 4MB." }, { status: 400 });
  }
  // Basic rate limit: max 6 requests per minute per user.
  const recent = await prisma.imageJob.count({
    where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60_000) } },
  });
  if (recent >= 6) {
    return NextResponse.json(
      { error: "RATE_LIMITED", message: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }
  // Atomic: take 1 credit only if the user has at least 1 (no double-spend).
  const claimed = await prisma.user.updateMany({
    where: { id: user.id, credits: { gt: 0 } },
    data: { credits: { decrement: 1 } },
  });
  if (claimed.count === 0) {
    return NextResponse.json({ error: "NO_CREDITS", message: "You are out of credits." }, { status: 402 });
  }

  const fail = async (message: string, status = 502) => {
    // Refund the credit and log the failed attempt.
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { credits: { increment: 1 } } }),
      prisma.imageJob.create({
        data: {
          userId: user.id,
          status: "FAILED",
          originalName: file.name,
          sizeBytes: file.size,
          creditUsed: false,
          errorMessage: message,
        },
      }),
    ]);
    return NextResponse.json({ error: "PROCESSING_FAILED", message }, { status });
  };

  try {
    const serviceUrl = process.env.BG_SERVICE_URL;
    const serviceSecret = process.env.BG_SERVICE_SECRET;
    if (!serviceUrl || !serviceSecret) {
      console.error("BG_SERVICE_URL or BG_SERVICE_SECRET is missing");
      return fail("Service is not configured.", 500);
    }

    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`${serviceUrl}/remove`, {
      method: "POST",
      headers: { "x-api-secret": serviceSecret },
      body,
      signal: AbortSignal.timeout(60_000), // free hosts can be slow to wake up
    });

    if (!res.ok) {
      console.error("bg-service error", res.status, await res.text());
      return fail(
        res.status === 422
          ? "Could not process this image. Try another one."
          : "Service is busy right now. Please try again later."
      );
    }

    const png = await res.arrayBuffer();

    await prisma.imageJob.create({
      data: {
        userId: user.id,
        status: "SUCCESS",
        originalName: file.name,
        sizeBytes: file.size,
        creditUsed: true,
      },
    });

    return new Response(png, {
      status: 200,
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error(e);
    return fail("Something went wrong. Please try again.", 500);
  }
}
