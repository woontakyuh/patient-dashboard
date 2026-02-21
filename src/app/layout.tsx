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
            <a href="/patient/P001" className="text-base font-bold text-blue-600 tracking-tight hover:text-blue-700 transition-colors">
              다보스 병원
            </a>
            {/* Desktop nav handled by BottomNav on mobile, or visible always */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-500">
              <a href="/patient/P001" className="hover:text-blue-600 transition-colors">홈</a>
              <a href="/patient/P001/timeline" className="hover:text-blue-600 transition-colors">타임라인</a>
              <a href="/patient/P001/instructions/pod1" className="hover:text-blue-600 transition-colors">안내</a>
              <a href="/patient/P001/prom" className="hover:text-blue-600 transition-colors">PROM</a>
              <a href="/patient/P001/progress" className="hover:text-blue-600 transition-colors">추이</a>
            </nav>
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
