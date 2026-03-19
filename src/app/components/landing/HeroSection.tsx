"use client";

import { motion } from "framer-motion";

function AnimatedSpine() {
  // 7 vertebrae from C to L, sizes growing then shrinking
  const vertebrae = [
    { w: 32, h: 14, rx: 6 },
    { w: 38, h: 16, rx: 7 },
    { w: 44, h: 18, rx: 8 },
    { w: 50, h: 20, rx: 9 },
    { w: 48, h: 19, rx: 8 },
    { w: 42, h: 17, rx: 7 },
    { w: 36, h: 15, rx: 6 },
  ];

  return (
    <div className="absolute right-[8%] top-1/2 hidden -translate-y-1/2 lg:block xl:right-[12%]">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        {/* Spinal canal line */}
        <motion.div
          className="absolute left-1/2 top-4 -translate-x-1/2"
          style={{ height: "calc(100% - 32px)", width: 2 }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="h-full w-full bg-gradient-to-b from-sky-300/0 via-sky-300/40 to-sky-300/0" />
        </motion.div>

        {vertebrae.map((v, i) => (
          <motion.div
            key={i}
            className="relative my-[3px]"
            initial={{ opacity: 0, scale: 0.3, rotateX: 90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{
              delay: 0.7 + i * 0.15,
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <div
              style={{ width: v.w, height: v.h, borderRadius: v.rx }}
              className="border border-sky-300/30 bg-gradient-to-b from-sky-200/15 to-sky-400/10 shadow-[0_0_20px_rgba(56,189,248,0.08)] backdrop-blur-sm"
            />
            {/* Transverse processes */}
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: -v.w * 0.35, width: v.w * 0.3, height: 3 }}
            >
              <div className="h-full rounded-full bg-gradient-to-l from-sky-300/20 to-transparent" />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ right: -v.w * 0.35, width: v.w * 0.3, height: 3 }}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-sky-300/20 to-transparent" />
            </div>
          </motion.div>
        ))}

        {/* Pulse ring around middle vertebra */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/20"
          style={{ width: 120, height: 120 }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      {/* Dark background with subtle warmth */}
      <div className="absolute inset-0 bg-[#0a0f1a]" />

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[20%] top-[10%] h-[600px] w-[600px] rounded-full bg-blue-900/20 blur-[150px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-indigo-900/15 blur-[120px]" />
      </div>

      {/* Fine dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(rgba(148,163,184,0.08) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Animated spine */}
      <AnimatedSpine />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32">
        <div className="max-w-xl">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-8 bg-sky-400/60" />
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-sky-400/80">
              Patient Recovery Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="mt-7 text-[2.5rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            수술 후 회복,
            <br />
            <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
              함께 걸어가는 여정
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-6 max-w-md text-[15px] leading-[1.7] text-slate-400"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            SpineTrack은 척추 수술 환자를 위한 맞춤형 회복 가이드입니다.
            수술 전 준비부터 완전한 회복까지, 매일의 여정을 안내하고
            의료진과 연결합니다.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/20"
            >
              자세히 알아보기
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </a>
            <a
              href="https://dashboard.spinetrack.ai"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:text-white"
            >
              의료진 로그인
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-14 flex gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {[
              { value: "6종", label: "수술 유형 지원" },
              { value: "5가지", label: "PROM 설문" },
              { value: "365일", label: "회복 추적" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
