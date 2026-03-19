"use client";

import { usePathname, useRouter } from "next/navigation";
import { Users, BarChart3, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "환자 목록", icon: Users },
  {
    href: "/admin/analytics",
    label: "Outcome 분석",
    icon: BarChart3,
    disabled: true,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
          <svg
            className="h-3.5 w-3.5 text-zinc-900"
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
        <div>
          <div className="text-sm font-semibold text-white">SpineTrack</div>
          <div className="text-[10px] text-zinc-500">Dashboard</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.disabled ? undefined : item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                item.disabled
                  ? "cursor-not-allowed text-zinc-600"
                  : active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.disabled && (
                <span className="ml-auto text-[9px] uppercase tracking-wider text-zinc-600">
                  Soon
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-zinc-800 px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
