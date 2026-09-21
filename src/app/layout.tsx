import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "JulesBraids & Hairs | Luxury Hair Storefront",
  description: "Production-quality luxury hair storefront and merchant dashboard for JulesBraids & Hairs.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.jpg" },
      { url: "/logo.jpg" }
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body suppressHydrationWarning className="min-h-screen bg-warm-white text-obsidian selection:bg-champagne selection:text-white">
        {children}
      </body>
    </html>
  );
}
