import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);

        if (evt.type === "user.created") {
            const d = evt.data;
            const email = d.email_addresses[0]?.email_address;
            if (email) {
                await prisma.user.upsert({
                    where: { clerkId: d.id },
                    update: {},
                    create: {
                        clerkId: d.id,
                        email,
                        name: [d.first_name, d.last_name].filter(Boolean).join(" ") || null,
                        imageUrl: d.image_url,
                    },
                });
            }
        }

        if (evt.type === "user.deleted" && evt.data.id) {
            await prisma.user.deleteMany({ where: { clerkId: evt.data.id } });
        }

        return new Response("ok", { status: 200 });
    } catch {
        return new Response("Invalid webhook", { status: 400 });
    }
}