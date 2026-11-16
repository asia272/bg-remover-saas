import Image from "next/image";
import UploadButton from "./UploadButton";

export default function Hero() {
  return (
    <section className="container-x grid items-center gap-10 pt-6 pb-10 lg:grid-cols-[1fr_auto] lg:pt-10 lg:pb-20">
      <div className="text-center lg:max-w-[748px] lg:text-left">
        <h1 className="text-[44px] font-semibold leading-none text-[#3a3a3a] sm:text-[56px] xl:text-[70px]">
          Remove the <br />
          <span className="text-grad-brand font-extrabold">background</span> from <br />
          images for free.
        </h1>
        <p className="mx-auto mt-10 max-w-[430px] text-xs leading-5 text-[#333] sm:text-sm lg:mx-0">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry&apos;s standard dummy text ever.
        </p>
        <UploadButton className="mt-10 lg:mt-14" />
      </div>
      <div className="flex justify-center lg:justify-end lg:pr-16">
        <Image
          src="/assets/header_img.png"
          alt="Woman with background removed"
          width={638}
          height={638}
          priority
          className="h-auto w-full max-w-[380px] sm:max-w-[500px] xl:max-w-[638px]"
        />
      </div>
    </section>
  );
}
