"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <a href="/" className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-500 ${
              scrolled ? "bg-slate-900" : "bg-white/10 backdrop-blur-sm"
            }`}
          >
            <svg
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <circle cx="10" cy="3" r="2" />
              <circle cx="10" cy="7.5" r="1.8" />
              <circle cx="10" cy="11.5" r="1.6" />
              <circle cx="10" cy="15" r="1.4" />
              <circle cx="10" cy="18" r="1.2" />
            </svg>
          </div>
          <span
            className={`text-[15px] font-semibold tracking-tight transition-colors duration-500 ${
              scrolled ? "text-slate-900" : "text-white"
            }`}
          >
            SpineTrack
          </span>
        </a>

        <div className="flex items-center gap-1">
          {[
            { label: "기능", href: "#features" },
            { label: "이용 방법", href: "#how-it-works" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`hidden rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors sm:block ${
                scrolled
                  ? "text-slate-500 hover:text-slate-900"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://dashboard.spinetrack.ai"
            className={`ml-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-300 ${
              scrolled
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            }`}
          >
            의료진 로그인
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
