"use client";

import { useState, useEffect, useRef } from "react";
import { getPatientById } from "@/data/mock-patient";
import { computeJourneyStage } from "@/data/journey-stages";
import { getQuickQuestions } from "@/data/chatbot-faq";
import type { ChatMessage, TriageLevel } from "@/lib/types";
import {
  Send,
  MessageCircle,
  AlertTriangle,
  AlertOctagon,
  Phone,
  Bot,
  Loader2,
} from "lucide-react";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

const STAGE_LABELS: Record<string, string> = {
  decision: "수술 전 준비",
  surgery: "수술 당일",
  immediate: "수술 직후 (1-3일)",
  early_recovery: "초기 회복 (1-2주)",
  mid_recovery: "중기 회복 (1-3개월)",
  full_recovery: "완전 회복",
};

const TRIAGE_STYLES: Record<
  TriageLevel,
  { bg: string; border: string; icon: React.ElementType; label: string }
> = {
  green: {
    bg: "bg-white",
    border: "border-gray-100",
    icon: Bot,
    label: "",
  },
  yellow: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: AlertTriangle,
    label: "의사 확인 권장",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: AlertOctagon,
    label: "응급 — 즉시 연락",
  },
};

// API base URL — Worker in production, local proxy in dev
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "";

export default function ChatClient({ id }: { id: string }) {
  const patient = getPatientById(id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const STORAGE_KEY = `chat-history-${id}`;
  const currentStage = patient ? computeJourneyStage(patient.surgery.date) : "decision";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([
          {
            id: generateId(),
            role: "assistant",
            content: `안녕하세요, ${patient?.name ?? ""}님! SpineTrack AI 상담입니다.\n\n수술과 회복에 대해 궁금한 점을 물어보세요. 일반적인 안내를 드리며, 위험 신호 감지 시 즉시 안내해 드립니다.`,
            triage: "green",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      /* ignore */
    }
  }, [STORAGE_KEY, patient?.name]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Save messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, STORAGE_KEY]);

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">환자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const quickQuestions = getQuickQuestions(currentStage);

  async function callChatApi(
    chatMessages: { role: "user" | "assistant"; content: string }[]
  ): Promise<{ content: string; triage: TriageLevel }> {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: chatMessages,
        patientContext: {
          name: patient!.name,
          surgeryType: patient!.surgery.nameKo,
          surgeryDate: patient!.surgery.date,
          currentStage: STAGE_LABELS[currentStage] || currentStage,
          diagnosis: patient!.diagnosis.nameKo,
          surgerySchedule: patient!.surgery.schedule,
          surgeryAbbreviation: patient!.surgery.abbreviation,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  }

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;

    const patientMsg: ChatMessage = {
      id: generateId(),
      role: "patient",
      content: msg,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, patientMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation for API (last 10 messages for context)
      const recentMessages = [...messages, patientMsg]
        .filter((m) => m.role === "patient" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({
          role: (m.role === "patient" ? "user" : "assistant") as "user" | "assistant",
          content: m.content,
        }));

      const result = await callChatApi(recentMessages);

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: result.content,
        triage: result.triage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat API error:", err);
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content:
          "죄송합니다, 일시적인 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        triage: "green",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-5 h-5 text-teal-500" />
        <h1 className="text-lg font-bold text-gray-900">AI 상담</h1>
        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
          Gemini Flash
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 -mx-1 px-1">
        {messages.map((msg) => {
          if (msg.role === "patient") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[80%] bg-teal-500 text-white rounded-2xl rounded-br-sm px-3.5 py-2.5">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          }

          const triageStyle = TRIAGE_STYLES[msg.triage ?? "green"];
          const TriageIcon = triageStyle.icon;

          return (
            <div key={msg.id} className="flex justify-start">
              <div
                className={`max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border ${triageStyle.bg} ${triageStyle.border}`}
              >
                {triageStyle.label && (
                  <div
                    className={`flex items-center gap-1 mb-1.5 ${
                      msg.triage === "red"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  >
                    <TriageIcon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">
                      {triageStyle.label}
                    </span>
                  </div>
                )}
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {msg.content}
                </p>
                {msg.triage === "red" && (
                  <div className="mt-2 flex gap-2">
                    <a
                      href="tel:119"
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold"
                    >
                      <Phone className="w-3 h-3" />
                      119 전화
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-gray-100 bg-white">
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">답변을 생성하고 있습니다...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Questions */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {quickQuestions.map((q) => (
          <button
            key={q.label}
            onClick={() => handleSend(q.message)}
            disabled={isLoading}
            className="flex-shrink-0 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-40"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 pt-2 border-t border-gray-100">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="궁금한 점을 입력하세요..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none bg-gray-100 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:opacity-60"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 bg-teal-500 text-white rounded-xl flex items-center justify-center hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
