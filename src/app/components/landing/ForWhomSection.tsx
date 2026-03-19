"use client";

import { motion } from "framer-motion";
import { User, Stethoscope } from "lucide-react";

const cards = [
  {
    icon: User,
    title: "환자분께",
    gradient: "from-blue-50 to-indigo-50",
    iconStyle: "bg-blue-100 text-blue-600",
    checkColor: "text-blue-500",
    items: [
      "수술 후 뭘 해야 하는지, 뭘 하면 안 되는지 매일 안내",
      "회복이 잘 되고 있는지 객관적 수치로 확인",
      "병원에 전화하기 애매한 질문은 AI에게",
      "다음 외래까지 남은 기간과 준비사항 안내",
    ],
  },
  {
    icon: Stethoscope,
    title: "의료진께",
    gradient: "from-emerald-50 to-teal-50",
    iconStyle: "bg-emerald-100 text-emerald-600",
    checkColor: "text-emerald-500",
    items: [
      "환자별 PROM 데이터 실시간 수집 및 추이 확인",
      "설문 미응답 환자 파악 및 응답률 관리",
      "환자 질문에 대한 트리아지 및 우선순위 관리",
      "수술 유형별 Outcome 분석 대시보드",
    ],
  },
];

export default function ForWhomSection() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
            For Everyone
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            누구를 위한 서비스인가요?
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className={`rounded-3xl bg-gradient-to-br ${card.gradient} p-8 sm:p-10`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconStyle}`}
              >
                <card.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-slate-900">
                {card.title}
              </h3>
              <ul className="mt-5 space-y-3.5">
                {card.items.map((item, j) => (
                  <motion.li
                    key={j}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-600"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + j * 0.08 }}
                  >
                    <svg
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${card.checkColor}`}
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
