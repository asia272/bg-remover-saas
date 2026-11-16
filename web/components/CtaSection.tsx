import UploadButton from "./UploadButton";

export default function CtaSection() {
  return (
    <section className="container-x py-16 text-center sm:py-24">
      <h2 className="title-grad text-[clamp(28px,4vw,50px)] font-semibold">See the magic. Try now</h2>
      <UploadButton className="mt-10" />
    </section>
  );
}
