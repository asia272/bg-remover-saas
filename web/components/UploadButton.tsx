"use client";

import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useRemoveBg } from "./ResultProvider";

export default function UploadButton({ className = "" }: { className?: string }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();
    const { run, loading, error } = useRemoveBg();

    function onClick() {
        if (!isLoaded) return;
        if (!isSignedIn) return router.push("/sign-up");
        inputRef.current?.click();
    }

    return (
        <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
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
                onClick={onClick}
                disabled={loading}
                className="btn-grad inline-flex h-14 w-[230px] items-center justify-center gap-3 rounded-full text-base font-medium text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70 sm:h-[67px] sm:w-[266px]"
            >
                <Image src="/assets/upload_btn_icon.svg" alt="" width={24} height={24} className="size-6 shrink-0" />
                {loading ? "Removing background..." : "Upload your image"}
            </button>
            {error && (
                <p role="alert" className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}