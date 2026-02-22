import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

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
  title: "다보스 병원 환자 가이드",
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
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
          <div className="max-w-[480px] mx-auto px-4 h-14 flex items-center justify-between">
            <span className="text-base font-bold text-blue-600 tracking-tight">
              다보스 병원
            </span>
          </div>
        </header>

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
