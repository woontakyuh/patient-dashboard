"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, ClipboardList, LineChart } from "lucide-react";

function getPatientId(pathname: string): string | null {
  const patientPath = pathname.match(/^\/patient\/([^/]+)/);
  if (patientPath?.[1]) return patientPath[1];

  const rootPath = pathname.match(/^\/([^/]+)/);
  const firstSegment = rootPath?.[1];
  if (!firstSegment) return null;
  if (["patient", "qr", "_next"].includes(firstSegment)) return null;

  return firstSegment;
}

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/qr/")) {
    return null;
  }

  const patientId = getPatientId(pathname);
  if (!patientId) {
    return null;
  }

  const navItems = [
    {
      label: "홈",
      href: `/${patientId}`,
      icon: Home,
      matchPrefix: `/${patientId}`,
      exact: true,
    },
    {
      label: "설문",
      href: `/patient/${patientId}/prom`,
      icon: ClipboardList,
      matchPrefix: `/patient/${patientId}/prom`,
    },
    {
      label: "추이",
      href: `/patient/${patientId}/progress`,
      icon: LineChart,
      matchPrefix: `/patient/${patientId}/progress`,
    },
    {
      label: "안내",
      href: `/patient/${patientId}/timeline`,
      icon: BarChart3,
      matchPrefix: `/patient/${patientId}/timeline`,
    },
  ];

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) {
      return pathname === item.href;
    }
    const prefix = item.matchPrefix ?? item.href;
    return pathname.startsWith(prefix);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16 max-w-[480px] mx-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors relative ${
                active ? "text-teal-600" : "text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2 : 1.5} />
              <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
              {active && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-teal-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
