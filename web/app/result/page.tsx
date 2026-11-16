"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRemoveBg, useResult } from "@/components/ResultProvider";

export default function ResultPage() {
    const router = useRouter();
    const { original, result } = useResult();
    const { run, loading, error } = useRemoveBg();
    const inputRef = useRef<HTMLInputElement>(null);

    // A page refresh clears the in-memory images, so go back home.
    useEffect(() => {
        if (!original || !result) router.replace("/");
    }, [original, result, router]);

    if (!original || !result) return null;

    return (
        <section className="container-x py-6 sm:py-10">
            <div className="card-shadow rounded-xl bg-white p-6 sm:p-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <p className="mb-4 text-sm font-semibold text-[#333]">Original</p>
                        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={original} alt="Original" className="absolute inset-0 size-full object-contain" />
                        </div>
                    </div>
                    <div>
                        <p className="mb-4 text-sm font-semibold text-[#333]">Background Removed</p>
                        <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-gray-300">
                            <Image src="/assets/bg_layer.png" alt="" fill sizes="(max-width: 1024px) 100vw, 1000px" className="object-cover" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={result} alt="Background removed" className="absolute inset-0 size-full object-contain" />
                        </div>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="mt-4 text-right text-sm text-red-500">
                        {error}
                    </p>
                )}

                <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) run(file);
                            e.target.value = "";
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={loading}
                        className="flex h-12 items-center justify-center rounded-full border border-[#7648ff] px-8 text-sm font-medium text-[#7648ff] transition hover:bg-[#7648ff]/5 disabled:opacity-60"
                    >
                        {loading ? "Processing..." : "Try another image"}
                    </button>
                    <a
                        href={result}
                        download="bg-removed.png"
                        className="btn-grad flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        Download image
                    </a>
                </div>
            </div>
        </section>
    );
}