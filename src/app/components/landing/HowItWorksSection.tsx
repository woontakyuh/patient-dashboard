"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "QR 코드 스캔",
    description: "입원 시 받은 QR 코드를 스캔하면 나만의 대시보드가 열립니다.",
    detail: "생년월일 6자리로 간편 인증",
  },
  {
    number: "02",
    title: "매일 회복 체크",
    description: "오늘의 할 일을 확인하고, 1분 간편 설문으로 회복 정도를 기록합니다.",
    detail: "VAS, ODI, NDI, EQ-5D 지원",
  },
  {
    number: "03",
    title: "회복 추이 확인",
    description: "기록한 결과가 차트로 시각화됩니다. 의료진도 함께 모니터링합니다.",
    detail: "수술 전 대비 회복률 추적",
  },
  {
    number: "04",
    title: "궁금한 건 AI에게",
    description: "재활, 일상 복귀, 통증 관리 — 언제든 물어보세요.",
    detail: "긴급 시 자동 의료진 연결",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-slate-50/80 py-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-slate-300" />
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">
              How It Works
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-slate-900 sm:text-4xl">
            간단한 4단계
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative rounded-2xl border border-slate-100 bg-white p-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              {/* Number */}
              <span className="text-[40px] font-bold leading-none text-slate-100">
                {step.number}
              </span>

              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-slate-500">
                {step.description}
              </p>

              {/* Detail tag */}
              <div className="mt-4 inline-flex rounded-full bg-slate-50 px-3 py-1">
                <span className="text-[11px] font-medium text-slate-400">
                  {step.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
