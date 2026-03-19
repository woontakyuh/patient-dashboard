"use client";

import { motion } from "framer-motion";

function SpineVisualization() {
  const vertebrae = [
    { size: 28, opacity: 0.9 },
    { size: 32, opacity: 0.85 },
    { size: 36, opacity: 0.8 },
    { size: 38, opacity: 0.75 },
    { size: 36, opacity: 0.7 },
    { size: 34, opacity: 0.65 },
    { size: 30, opacity: 0.6 },
  ];

  return (
    <div className="absolute right-[10%] top-1/2 hidden -translate-y-1/2 lg:block">
      <div className="relative flex flex-col items-center gap-2">
        {vertebrae.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 20 }}
            animate={{ opacity: v.opacity, scale: 1, x: 0 }}
            transition={{
              delay: 0.8 + i * 0.12,
              duration: 0.6,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <div
              className="rounded-full border border-white/20"
              style={{
                width: v.size,
                height: v.size * 0.65,
                background: `radial-gradient(ellipse at 40% 40%, rgba(255,255,255,${v.opacity * 0.3}), rgba(255,255,255,${v.opacity * 0.08}))`,
                boxShadow: `0 0 ${v.size}px rgba(147,197,253,${v.opacity * 0.15})`,
              }}
            />
          </motion.div>
        ))}
        {/* Connecting line */}
        <motion.div
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-white/5 via-white/15 to-white/5"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          style={{ originY: 0 }}
        />
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

      {/* Ambient light effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[300px] -top-[300px] h-[600px] w-[600px] rounded-full bg-blue-500/8 blur-[100px]" />
        <div className="absolute -bottom-[200px] -right-[200px] h-[500px] w-[500px] rounded-full bg-indigo-500/6 blur-[100px]" />
        <div className="absolute left-1/3 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-cyan-500/4 blur-[120px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Spine visualization */}
      <SpineVisualization />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              척추 수술 환자 맞춤형 회복 가이드
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            수술 후 회복,
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              함께 걸어가는 여정
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            수술 전 준비부터 완전한 회복까지.
            <br />
            매일의 회복 여정을 안내하고, 의료진과 연결합니다.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <a
              href="#how-it-works"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition-all hover:shadow-lg hover:shadow-white/10"
            >
              자세히 알아보기
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
            <a
              href="https://dashboard.spinetrack.ai"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white/90 transition-all hover:border-white/30 hover:bg-white/5"
            >
              의료진 로그인
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
            Scroll
          </span>
          <div className="h-8 w-5 rounded-full border border-white/20 p-1">
            <motion.div
              className="mx-auto h-1.5 w-1 rounded-full bg-white/40"
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
