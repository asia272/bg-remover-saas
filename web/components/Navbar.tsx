import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getOrCreateUser } from "@/lib/get-user";

async function NavActions() {
  const user = await getOrCreateUser();

  if (!user) {
    return (
      <Link
        href="/sign-up"
        className="flex h-11 items-center gap-2 rounded-full bg-[#313131] px-6 text-sm font-medium text-white transition hover:bg-black sm:h-[57px] sm:px-10 sm:text-base"
      >
        Get started
        <Image src="/assets/arrow_icon.svg" alt="" width={16} height={16} className="size-4 shrink-0" />
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link
        href="/pricing"
        className="flex items-center gap-2 rounded-full bg-[#d6eaff] px-3 py-2 text-xs font-medium text-[#4b5563] sm:px-5 sm:py-2.5 sm:text-sm"
      >
        <Image src="/assets/credit_icon.png" alt="" width={20} height={20} />
        Credits left: {user.credits}
      </Link>
      <span className="hidden text-sm text-[#4b5563] sm:block">
        Hi! {user.name?.split(" ")[0] ?? "there"}
      </span>
      <UserButton />
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="container-x flex h-20 items-center justify-between sm:h-24">
      <Link href="/" aria-label="bg.removal home">
        <Image
          src="/assets/logo.svg"
          alt="bg.removal"
          width={224}
          height={41}
          priority
          className="h-8 sm:h-[41px]" style={{ width: "auto" }}
        />
      </Link>
      <Suspense fallback={<div className="h-11 w-32 animate-pulse rounded-full bg-black/5" />}>
        <NavActions />
      </Suspense>
    </header>
  );
}
