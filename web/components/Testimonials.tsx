import Image from "next/image";

const items = [
  { name: "Richard Nelson", role: "WEB DEVELOPER", img: "/assets/profile_img_1.png" },
  { name: "Donald Jackman", role: "UI DESIGNER", img: "/assets/profile_img_2.png" },
];

export default function Testimonials() {
  return (
    <section className="container-x py-16 sm:py-24">
      <h2 className="title-grad text-center text-[clamp(28px,4vw,50px)] font-semibold">Customer Testimonials</h2>
      <div className="mx-auto mt-12 grid max-w-[1000px] gap-6 md:grid-cols-2">
        {items.map((t) => (
          <figure key={t.name} className="card-shadow rounded-xl border border-line bg-white p-6 sm:p-8">
            <span className="text-3xl font-bold leading-none text-[#333]">&rdquo;</span>
            <blockquote className="mt-2 text-sm leading-6 text-[#555]">
              I&apos;ve been using bg.removal for nearly two years, primarily for Instagram, and it has been
              incredibly user-friendly, making my work much easier.
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Image src={t.img} alt={t.name} width={40} height={40} className="size-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium text-black">{t.name}</p>
                <p className="text-[10px] tracking-wide text-muted">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
