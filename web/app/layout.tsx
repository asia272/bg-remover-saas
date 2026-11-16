import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ResultProvider } from "@/components/ResultProvider";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-outfit-src",
});

export const metadata: Metadata = {
    title: "bg.removal – Remove image backgrounds in seconds",
    description: "Upload an image, remove its background with AI, and download a transparent PNG.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${outfit.variable} flex min-h-screen flex-col antialiased`}>
                    <ResultProvider>
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </ResultProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}