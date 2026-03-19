"use client";

import { motion } from "framer-motion";

export default function ForWhomSection() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-6">
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
              For Everyone
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-slate-900 sm:text-4xl">
            누구를 위한 서비스인가요?
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {/* For Patients */}
          <motion.div
            className="overflow-hidden rounded-2xl bg-[#0a0f1a] p-8 sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-400">
              For Patients
            </span>
            <h3 className="mt-4 text-2xl font-bold text-white">
              환자분께
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              수술 후 회복 과정에서 불안하지 않도록
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "매일 해야 할 것, 하지 말아야 할 것 안내",
                "회복 정도를 수치로 객관적 확인",
                "애매한 질문은 AI에게 24시간 상담",
                "다음 외래 일정과 준비사항 알림",
              ].map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-3 text-[13px] leading-[1.6] text-slate-300"
                >
                  <span className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-[10px] text-sky-400">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Doctors */}
          <motion.div
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              For Clinicians
            </span>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              의료진께
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              환자 데이터를 체계적으로 수집하고 관리
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "환자별 PROM 실시간 수집 및 추이 차트",
                "설문 미응답 환자 파악, 응답률 관리",
                "환자 질문 트리아지 및 우선순위 관리",
                "수술 유형별 Outcome 분석 대시보드",
              ].map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-3 text-[13px] leading-[1.6] text-slate-600"
                >
                  <span className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
