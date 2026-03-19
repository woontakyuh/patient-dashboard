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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div
              className={`absolute inset-0 rounded-xl transition-colors duration-500 ${
                scrolled
                  ? "bg-slate-900"
                  : "bg-white/15 backdrop-blur-sm"
              }`}
            />
            <svg
              className={`relative h-5 w-5 transition-colors duration-500 ${
                scrolled ? "text-white" : "text-white"
              }`}
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
            className={`text-lg font-semibold tracking-tight transition-colors duration-500 ${
              scrolled ? "text-slate-900" : "text-white"
            }`}
          >
            SpineTrack
          </span>
        </a>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {[
            { label: "기능", href: "#features" },
            { label: "이용 방법", href: "#how-it-works" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`hidden rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-300 sm:block ${
                scrolled
                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://dashboard.spinetrack.ai"
            className={`ml-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              scrolled
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
            }`}
          >
            의료진 로그인
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
