"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("비밀번호가 올바르지 않습니다");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <svg
              className="h-4 w-4 text-zinc-900"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <circle cx="10" cy="3" r="2" />
              <circle cx="10" cy="7.5" r="1.8" />
              <circle cx="10" cy="11.5" r="1.6" />
              <circle cx="10" cy="15" r="1.4" />
              <circle cx="10" cy="18" r="1.2" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">SpineTrack</span>
        </div>

        <h1 className="mt-6 text-xl font-bold text-white">관리자 로그인</h1>
        <p className="mt-1 text-sm text-zinc-400">
          관리자 비밀번호를 입력하세요
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="mt-6 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500"
          autoFocus
        />

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-4 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
