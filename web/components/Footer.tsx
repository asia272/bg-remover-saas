import Image from "next/image";

const socials = [
  { icon: "/assets/facebook_icon.svg", label: "Facebook" },
  { icon: "/assets/twitter_icon.svg", label: "Twitter" },
  { icon: "/assets/google_plus_icon.svg", label: "Google Plus" },
];

export default function Footer() {
  return (
    <footer className="container-x mt-20 flex flex-col items-center justify-between gap-5 py-8 sm:flex-row">
      <div className="flex items-center gap-4 sm:gap-6">
        <Image src="/assets/logo.svg" alt="bg.removal" width={180} height={33} className="h-7 sm:h-8" style={{ width: "auto" }} />
        <span className="hidden h-8 w-px bg-gray-300 sm:block" />
        <p className="text-xs text-muted sm:text-sm">All right reserved. Copyright @bg removal</p>
      </div>
      <div className="flex gap-3">
        {socials.map((s) => (
          <button
            key={s.label}
            aria-label={s.label}
            className="flex size-10 items-center justify-center rounded-full bg-white shadow-md transition hover:-translate-y-0.5"
          >
            <Image src={s.icon} alt="" width={18} height={18} />
          </button>
        ))}
      </div>
    </footer>
  );
}
