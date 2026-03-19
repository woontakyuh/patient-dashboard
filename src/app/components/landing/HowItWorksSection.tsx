"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "QR 코드 스캔",
    description:
      "입원 시 받은 QR 코드를 스캔하면 나만의 대시보드가 열립니다. 생년월일 6자리로 간편하게 인증하세요.",
  },
  {
    number: "02",
    title: "매일 회복 체크",
    description:
      "오늘의 할 일을 확인하고, 1분이면 완료되는 간편 설문으로 통증과 기능 회복 정도를 기록합니다.",
  },
  {
    number: "03",
    title: "회복 추이 확인",
    description:
      "기록한 설문 결과가 차트로 시각화됩니다. 나의 회복 추이를 한눈에 파악하고, 의료진도 함께 확인합니다.",
  },
  {
    number: "04",
    title: "궁금한 건 AI에게",
    description:
      "재활 운동, 일상 복귀, 통증 관리 등 궁금한 점을 물어보세요. 긴급 시 자동으로 의료진에게 연결됩니다.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-slate-50 py-28">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-100/30 blur-[100px]" />

      <div className="relative mx-auto max-w-4xl px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            간단한 4단계
          </h2>
        </motion.div>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute left-[27px] top-0 hidden h-full w-px bg-gradient-to-b from-blue-200 via-blue-300 to-blue-100 sm:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative flex gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                {/* Number */}
                <div className="flex-shrink-0">
                  <div className="relative flex h-14 w-14 items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl bg-white shadow-sm shadow-blue-100 ring-1 ring-blue-100/50" />
                    <span className="relative text-lg font-bold text-blue-600">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
