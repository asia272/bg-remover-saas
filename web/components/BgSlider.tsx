"use client";

import Image from "next/image";
import { useState } from "react";

export default function BgSlider() {
  const [pos, setPos] = useState(50);

  return (
    <section className="container-x py-16 sm:py-24">
      <h2 className="title-grad mx-auto max-w-[720px] text-center text-[clamp(28px,4vw,50px)] font-semibold leading-tight">
        Remove Background With High Quality and Accuracy
      </h2>

      <div className="relative mx-auto mt-12 aspect-[16/10] w-full max-w-[1000px] select-none overflow-hidden rounded-2xl">
        {/* Right side: transparent result on checkerboard */}
        <Image src="/assets/bg_layer.png" alt="" fill className="object-cover" />
        <Image src="/assets/image_wo_bg.png" alt="Background removed" fill className="object-cover" />

        {/* Left side: original, clipped by slider */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src="/assets/image_w_bg.png" alt="Original" fill className="object-cover" />
        </div>

        {/* Divider + handle */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
            <Image src="/assets/slide_icon.svg" alt="" width={20} height={20} />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare original and background removed image"
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
    </section>
  );
}
