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
      "입원부터 완전 회복까지, 나의 수술 여정을 한눈에. 오늘 해야 할 일과 다음 단계를 안내합니다.",
    accent: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: ClipboardCheck,
    title: "맞춤 회복 설문",
    description:
      "통증과 기능 회복 정도를 정기적으로 기록하면, 수치로 회복 경과를 확인할 수 있습니다.",
    accent: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: Activity,
    title: "회복 추이 차트",
    description:
      "제출한 설문 결과가 시각적 차트로. 내 회복이 잘 진행되고 있는지 객관적으로 확인하세요.",
    accent: "from-violet-500/20 to-violet-600/5",
    iconBg: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: BookOpen,
    title: "단계별 교육",
    description:
      "수술 전 준비사항, 퇴원 후 주의점, 재활 운동 등 회복 단계에 맞는 교육 자료를 제공합니다.",
    accent: "from-amber-500/20 to-amber-600/5",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: MessageCircle,
    title: "AI 건강 상담",
    description:
      "궁금한 점을 AI에게 물어보세요. 긴급 상황은 자동 트리아지로 의료진에게 전달됩니다.",
    accent: "from-rose-500/20 to-rose-600/5",
    iconBg: "bg-rose-500/10 text-rose-400",
  },
  {
    icon: Bell,
    title: "오늘의 할 일",
    description:
      "매일 확인해야 할 체크리스트와 다가오는 외래 일정을 놓치지 않도록 알려드립니다.",
    accent: "from-cyan-500/20 to-cyan-600/5",
    iconBg: "bg-cyan-500/10 text-cyan-400",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-white py-28">
      {/* Subtle top gradient blend */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
            Features
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            회복의 모든 순간을 함께
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-slate-500">
            수술 후 불안하지 않도록, SpineTrack이 매일 함께합니다
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-300 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Hover gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="relative">
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
