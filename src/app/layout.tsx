import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SpineTrack — 나의 수술 여정",
  description: "척추 수술 환자를 위한 개인 맞춤형 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AppHeader />

        {/* Main */}
        <main className="max-w-[480px] mx-auto px-4 py-5 pb-24 md:pb-8">
          {children}
        </main>

        {/* Bottom Nav (mobile only) */}
        <BottomNav />
      </body>
    </html>
  );
}
