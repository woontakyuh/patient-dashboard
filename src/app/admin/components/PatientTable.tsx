"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Search } from "lucide-react";
import type { PatientRow } from "@/lib/types/admin";
import PromStatusBadge from "./PromStatusBadge";

export default function PatientTable() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDebouncedQuery(value), 400);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["patients", debouncedQuery],
    queryFn: async () => {
      const url = debouncedQuery
        ? `/api/admin/patients?q=${encodeURIComponent(debouncedQuery)}`
        : "/api/admin/patients";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.patients as PatientRow[];
    },
  });

  const patients = data || [];

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="환자 이름으로 검색..."
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600"
        />
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                환자
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                수술
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                수술일
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                PROM
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-zinc-500"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-zinc-500"
                >
                  {debouncedQuery ? "검색 결과 없음" : "환자 데이터 없음"}
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr
                  key={p.pageId}
                  className="cursor-pointer border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/50"
                  onClick={() =>
                    (window.location.href = `/admin/patients/${p.pageId}`)
                  }
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{p.name}</div>
                    <div className="text-xs text-zinc-500">
                      {p.ptNo} · {p.sex}/{p.age} · {p.hospital}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{p.opName}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.opDate}</td>
                  <td className="px-4 py-3">
                    <PromStatusBadge status={p.promStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && patients.length > 0 && (
        <p className="mt-3 text-xs text-zinc-500">총 {patients.length}명</p>
      )}
    </div>
  );
}
