import Image from "next/image";

const steps = [
  { icon: "/assets/upload_icon.svg", title: "Upload image" },
  { icon: "/assets/remove_bg_icon.svg", title: "Remove background" },
  { icon: "/assets/download_icon.svg", title: "Download image" },
];

export default function Steps() {
  return (
    <section className="container-x py-16 sm:py-24">
      <h2 className="title-grad mx-auto max-w-[652px] text-center text-[clamp(28px,4vw,50px)] font-semibold leading-tight">
        Steps to remove background image in seconds
      </h2>
      <div className="mx-auto mt-12 grid max-w-[1400px] gap-6 md:grid-cols-3 lg:mt-20">
        {steps.map((s) => (
          <div
            key={s.title}
            className="card-shadow flex min-h-[187px] flex-col justify-center gap-3 rounded-lg border border-line bg-white p-7"
          >
            <div className="flex items-center gap-3">
              <Image src={s.icon} alt="" width={36} height={36} />
              <h3 className="text-xl font-medium text-black sm:text-2xl">{s.title}</h3>
            </div>
            <p className="text-base leading-6 text-muted">
              This is a demo text, will replace it later. This is a demo..
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
