"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";

type Images = { original: string | null; result: string | null };
type Ctx = Images & { setImages: (original: string, result: string) => void };

const ResultContext = createContext<Ctx | null>(null);

export function ResultProvider({ children }: { children: React.ReactNode }) {
    const [images, setState] = useState<Images>({ original: null, result: null });

    const setImages = useCallback((original: string, result: string) => {
        setState((prev) => {
            if (prev.original) URL.revokeObjectURL(prev.original);
            if (prev.result) URL.revokeObjectURL(prev.result);
            return { original, result };
        });
    }, []);

    return <ResultContext.Provider value={{ ...images, setImages }}>{children}</ResultContext.Provider>;
}

export function useResult() {
    const ctx = useContext(ResultContext);
    if (!ctx) throw new Error("useResult must be used inside ResultProvider");
    return ctx;
}

const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024;

export function useRemoveBg() {
    const router = useRouter();
    const { setImages } = useResult();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const run = useCallback(
        async (file: File) => {
            setError(null);
            if (!TYPES.includes(file.type)) return setError("Please use a JPG, PNG or WebP image.");
            if (file.size > MAX_SIZE) return setError("Image must be under 4MB.");

            setLoading(true);
            try {
                const body = new FormData();
                body.append("image", file);
                const res = await fetch("/api/remove-bg", { method: "POST", body });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    if (data.error === "NO_CREDITS") return router.push("/pricing");
                    throw new Error(data.message ?? "Something went wrong. Please try again.");
                }

                const blob = await res.blob();
                setImages(URL.createObjectURL(file), URL.createObjectURL(blob));
                router.push("/result");
                router.refresh(); // updates "Credits left" in the navbar
            } catch (e) {
                setError(e instanceof Error ? e.message : "Something went wrong.");
            } finally {
                setLoading(false);
            }
        },
        [router, setImages]
    );

    return { run, loading, error };
}