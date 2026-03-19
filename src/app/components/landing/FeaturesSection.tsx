"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  ClipboardCheck,
  MessageCircle,
  BookOpen,
  Activity,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "수술 여정 타임라인",
    description:
      "입원부터 완전 회복까지. 오늘 해야 할 일과 다음 단계를 한눈에.",
    tag: "Timeline",
  },
  {
    icon: ClipboardCheck,
    title: "맞춤 회복 설문",
    description:
      "통증과 기능 회복을 정기적으로 기록하면, 수치로 경과를 확인합니다.",
    tag: "PROM",
  },
  {
    icon: Activity,
    title: "회복 추이 차트",
    description:
      "제출한 설문 결과가 차트로. 회복이 잘 되고 있는지 한눈에.",
    tag: "Analytics",
  },
  {
    icon: BookOpen,
    title: "단계별 교육",
    description:
      "수술 전 준비, 퇴원 후 주의점, 재활 운동 — 시기별 맞춤 콘텐츠.",
    tag: "Education",
  },
  {
    icon: MessageCircle,
    title: "AI 건강 상담",
    description:
      "궁금한 점을 AI에게. 긴급 시 자동 트리아지로 의료진 연결.",
    tag: "AI Chat",
  },
  {
    icon: Bell,
    title: "오늘의 할 일",
    description:
      "체크리스트와 외래 일정을 놓치지 않도록.",
    tag: "Tasks",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-slate-300" />
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">
              Features
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-slate-900 sm:text-4xl">
            회복의 모든 순간을
            <br />
            함께합니다
          </h2>
        </motion.div>

        {/* Feature grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-150 bg-white p-6 transition-all duration-300 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              {/* Tag */}
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-300">
                {feature.tag}
              </span>

              {/* Icon */}
              <div className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition-transform duration-300 group-hover:scale-105">
                <feature.icon className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>

              <h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-slate-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
