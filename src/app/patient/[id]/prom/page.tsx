"use client";

import { useState, useEffect } from "react";
import { odiSections, eq5dDimensions, joaItems } from "@/data/prom-instruments";
import type { PromResult } from "@/lib/types";

const STORAGE_KEY = "prom-history-v2";

const tabs = [
  { id: "vas", label: "VAS" },
  { id: "odi", label: "ODI" },
  { id: "joa", label: "JOA" },
  { id: "eq5d", label: "EQ-5D" },
  { id: "eqvas", label: "EQ-VAS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function getVasEmoji(value: number) {
  if (value <= 1) return "\u{1F60A}";
  if (value <= 3) return "\u{1F642}";
  if (value <= 5) return "\u{1F610}";
  if (value <= 7) return "\u{1F623}";
  return "\u{1F622}";
}

function getHistory(): PromResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: PromResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function PromPage({ params: _params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabId>("vas");
  const [vasBack, setVasBack] = useState(0);
  const [vasLeg, setVasLeg] = useState(0);
  const [odiScores, setOdiScores] = useState<Record<string, number>>({});
  const [joaScores, setJoaScores] = useState<Record<string, number>>({});
  const [eq5dScores, setEq5dScores] = useState<Record<string, number>>({});
  const [eqVas, setEqVas] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<PromResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const odiCompleted = Object.keys(odiScores).length;
  const odiTotal = Object.values(odiScores).reduce((a, b) => a + b, 0);
  const odiPercent = odiCompleted === 10 ? Math.round((odiTotal / 50) * 100) : 0;

  const joaCompleted = Object.keys(joaScores).length;
  const joaTotal = Object.values(joaScores).reduce((a, b) => a + b, 0);

  const eq5dCompleted = Object.keys(eq5dScores).length;
  const eq5dCode = eq5dDimensions.map((d) => eq5dScores[d.id] ?? 0).join("");

  const allComplete = odiCompleted === 10 && joaCompleted === joaItems.length && eq5dCompleted === 5;

  function handleSubmit() {
    const entry: PromResult = {
      patientId: "P001",
      date: new Date().toISOString().slice(0, 10),
      vas_back: vasBack,
      vas_leg: vasLeg,
      odi_scores: odiSections.map((s) => odiScores[s.id] ?? 0),
      odi_total_percent: odiPercent,
      joa_score: joaTotal,
      joa_recovery_rate: null,
      eq5d_dimensions: eq5dDimensions.map((d) => eq5dScores[d.id] ?? 1),
      eq5d_code: eq5dCode,
      eq_vas: eqVas,
      timestamp: new Date().toISOString(),
    };
    const updated = [...history, entry];
    saveHistory(updated);
    setHistory(updated);
    setSubmitted(true);
  }

  function handleReset() {
    setVasBack(0);
    setVasLeg(0);
    setOdiScores({});
    setJoaScores({});
    setEq5dScores({});
    setEqVas(50);
    setSubmitted(false);
    setActiveTab("vas");
  }

  if (submitted) {
    return (
      <div className="animate-fade-in space-y-5 pb-24">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-4xl mb-3">&#10004;&#65039;</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">설문이 제출되었습니다</h1>
          <p className="text-sm text-gray-500 mb-4">감사합니다. 결과가 저장되었습니다.</p>

          <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2">
            <p><span className="text-gray-400">허리 VAS</span> <span className="font-semibold">{vasBack}/10</span></p>
            <p><span className="text-gray-400">다리 VAS</span> <span className="font-semibold">{vasLeg}/10</span></p>
            <p><span className="text-gray-400">ODI</span> <span className="font-semibold">{odiPercent}%</span></p>
            <p><span className="text-gray-400">JOA</span> <span className="font-semibold">{joaTotal}점</span></p>
            <p><span className="text-gray-400">EQ-5D</span> <span className="font-semibold">{eq5dCode}</span></p>
            <p><span className="text-gray-400">EQ-VAS</span> <span className="font-semibold">{eqVas}/100</span></p>
          </div>

          <button
            onClick={handleReset}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            새 설문 작성
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4 pb-24">
      <h1 className="text-xl font-bold text-gray-900 px-1">PROM 설문</h1>

      {/* Tab Bar */}
      <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 gap-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          let done = false;
          if (tab.id === "vas") done = true;
          if (tab.id === "odi") done = odiCompleted === 10;
          if (tab.id === "joa") done = joaCompleted === joaItems.length;
          if (tab.id === "eq5d") done = eq5dCompleted === 5;
          if (tab.id === "eqvas") done = true;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors relative ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {done && !isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* VAS Tab */}
      {activeTab === "vas" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            VAS 통증 수준
          </h2>

          {/* Back pain */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">허리 통증</label>
              <span className="text-2xl">{getVasEmoji(vasBack)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={vasBack}
              onChange={(e) => setVasBack(Number(e.target.value))}
              className="w-full vas-slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>0 (통증 없음)</span>
              <span className="text-lg font-bold text-blue-600">{vasBack}</span>
              <span>10 (극심한 통증)</span>
            </div>
          </div>

          {/* Leg pain */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">다리 통증 / 저림</label>
              <span className="text-2xl">{getVasEmoji(vasLeg)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={vasLeg}
              onChange={(e) => setVasLeg(Number(e.target.value))}
              className="w-full vas-slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>0 (통증 없음)</span>
              <span className="text-lg font-bold text-blue-600">{vasLeg}</span>
              <span>10 (극심한 통증)</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("odi")}
            className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
          >
            다음: ODI &rarr;
          </button>
        </div>
      )}

      {/* ODI Tab */}
      {activeTab === "odi" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              ODI 장애 지수
            </h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {odiCompleted}/10 완료
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-5">
            각 항목에서 오늘 본인의 상태에 가장 가까운 것을 하나만 선택해 주세요.
          </p>

          <div className="space-y-6">
            {odiSections.map((section) => (
              <div key={section.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-gray-800 mb-2.5">
                  {section.title}
                </p>
                <div className="space-y-1.5">
                  {section.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                        odiScores[section.id] === i
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`odi-${section.id}`}
                        checked={odiScores[section.id] === i}
                        onChange={() =>
                          setOdiScores((prev) => ({ ...prev, [section.id]: i }))
                        }
                        className="accent-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700 leading-snug">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {odiCompleted === 10 && (
            <div className="mt-5 p-3 bg-blue-50 rounded-xl text-center">
              <p className="text-sm text-gray-600">
                ODI 점수: <span className="font-bold text-blue-700">{odiTotal}/50 ({odiPercent}%)</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {odiPercent <= 20 ? "최소 장애" :
                 odiPercent <= 40 ? "중등도 장애" :
                 odiPercent <= 60 ? "중증 장애" :
                 odiPercent <= 80 ? "심각한 장애" : "완전 장애"}
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setActiveTab("vas")}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              &larr; VAS
            </button>
            <button
              onClick={() => setActiveTab("joa")}
              className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              JOA &rarr;
            </button>
          </div>
        </div>
      )}

      {/* JOA Tab */}
      {activeTab === "joa" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              JOA 점수
            </h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {joaCompleted}/{joaItems.length} 완료
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-5">
            현재 상태에 가장 가까운 것을 선택해 주세요.
          </p>

          <div className="space-y-6">
            {joaItems.map((item) => (
              <div key={item.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-gray-800 mb-2.5">
                  {item.title}
                </p>
                <div className="space-y-1.5">
                  {item.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                        joaScores[item.id] === opt.score
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`joa-${item.id}`}
                        checked={joaScores[item.id] === opt.score}
                        onChange={() =>
                          setJoaScores((prev) => ({ ...prev, [item.id]: opt.score }))
                        }
                        className="accent-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {joaCompleted === joaItems.length && (
            <div className="mt-5 p-3 bg-blue-50 rounded-xl text-center">
              <p className="text-sm text-gray-600">
                JOA 점수: <span className="font-bold text-blue-700">{joaTotal}점</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                (정상 29점 만점 기준, 높을수록 양호)
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setActiveTab("odi")}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              &larr; ODI
            </button>
            <button
              onClick={() => setActiveTab("eq5d")}
              className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              EQ-5D &rarr;
            </button>
          </div>
        </div>
      )}

      {/* EQ-5D-5L Tab */}
      {activeTab === "eq5d" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              EQ-5D-5L 건강 상태
            </h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {eq5dCompleted}/5 완료
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-5">
            오늘 본인의 건강 상태에 가장 가까운 것을 각 항목에서 하나씩 선택해 주세요.
          </p>

          <div className="space-y-6">
            {eq5dDimensions.map((dim) => (
              <div key={dim.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-gray-800 mb-2.5">
                  {dim.title}
                </p>
                <div className="space-y-1.5">
                  {dim.levels.map((level, i) => (
                    <label
                      key={i}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                        eq5dScores[dim.id] === i + 1
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`eq5d-${dim.id}`}
                        checked={eq5dScores[dim.id] === i + 1}
                        onChange={() =>
                          setEq5dScores((prev) => ({ ...prev, [dim.id]: i + 1 }))
                        }
                        className="accent-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {eq5dCompleted === 5 && (
            <div className="mt-5 p-3 bg-blue-50 rounded-xl text-center">
              <p className="text-sm text-gray-600">
                EQ-5D 코드: <span className="font-bold text-blue-700">{eq5dCode}</span>
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setActiveTab("joa")}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              &larr; JOA
            </button>
            <button
              onClick={() => setActiveTab("eqvas")}
              className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              EQ-VAS &rarr;
            </button>
          </div>
        </div>
      )}

      {/* EQ-VAS Tab */}
      {activeTab === "eqvas" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            EQ-VAS 건강 온도계
          </h2>

          <p className="text-xs text-gray-400 mb-6">
            오늘 본인의 전반적인 건강 상태를 0~100 사이에서 표시해 주세요.
          </p>

          <div className="flex items-center justify-center gap-8">
            {/* Vertical thermometer */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-green-600 font-semibold mb-2">100 (최상)</span>
              <input
                type="range"
                min={0}
                max={100}
                value={eqVas}
                onChange={(e) => setEqVas(Number(e.target.value))}
                className="eq-vas-slider"
              />
              <span className="text-xs text-red-500 font-semibold mt-2">0 (최악)</span>
            </div>

            {/* Value display */}
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600">{eqVas}</div>
              <p className="text-sm text-gray-400 mt-1">/ 100</p>
              <p className="text-xs text-gray-500 mt-3 max-w-[140px]">
                {eqVas >= 80 ? "매우 좋은 상태" :
                 eqVas >= 60 ? "양호한 상태" :
                 eqVas >= 40 ? "보통" :
                 eqVas >= 20 ? "좋지 않은 상태" :
                 "매우 좋지 않은 상태"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-8">
            <button
              onClick={() => setActiveTab("eq5d")}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              &larr; EQ-5D
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!allComplete}
        className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {!allComplete
          ? `미완료 항목이 있습니다 (ODI ${odiCompleted}/10, JOA ${joaCompleted}/${joaItems.length}, EQ-5D ${eq5dCompleted}/5)`
          : "설문 제출"}
      </button>
    </div>
  );
}
