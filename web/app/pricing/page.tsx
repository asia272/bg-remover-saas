import { Suspense } from "react";
import Image from "next/image";
import BuyButton from "@/components/BuyButton";
import PaymentBanner from "@/components/PaymentBanner";
import { PACKS } from "@/lib/packs";

export default function PricingPage() {
  return (
    <section className="container-x py-10 text-center sm:py-16">
      <span className="inline-block rounded-full border border-gray-300 px-10 py-2 text-xs tracking-wide text-[#555]">
        OUR PLANS
      </span>
      <h1 className="title-grad mt-6 text-[clamp(24px,3.5vw,36px)] font-semibold">
        Choose the plan that&apos;s right for you
      </h1>

      <Suspense fallback={null}>
        <PaymentBanner />
      </Suspense>

      <div className="mx-auto mt-12 grid max-w-[1200px] justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PACKS.map((p) => (
          <div
            key={p.id}
            className="mx-auto flex min-h-[434px] w-full max-w-[363px] flex-col rounded-[30px] border border-line bg-white p-8 text-left shadow-[0px_2px_2px_0px_#00000014]"
          >
            <Image src="/assets/logo_icon.svg" alt="" width={32} height={32} className="size-8" />
            <p className="mt-6 text-base font-medium text-black">{p.name}</p>
            <p className="mt-1 text-xs text-[#555]">{p.desc}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-[40px] font-medium leading-none text-[#333]">${p.priceCents / 100}</span>
              <span className="text-xs text-[#555]">/ {p.credits} credits</span>
            </p>
            <BuyButton packId={p.id} label={p.cta} />
          </div>
        ))}
      </div>
    </section>
  );
}