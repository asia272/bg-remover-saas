import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// cache() makes Navbar and the page share one call per request.
export const getOrCreateUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  const cu = await currentUser();
  const email = cu?.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("User has no email");

  try {
    return await prisma.user.create({
      data: { clerkId: userId, email, name: cu.fullName, imageUrl: cu.imageUrl },
    });
  } catch (e) {
    // P2002 = unique constraint: another request created the user first.
    if ((e as { code?: string }).code === "P2002") {
      const again = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (again) return again;
      // Same email but an old clerkId (you deleted and re-created the Clerk user).
      return prisma.user.update({ where: { email }, data: { clerkId: userId } });
    }
    throw e;
  }
});
