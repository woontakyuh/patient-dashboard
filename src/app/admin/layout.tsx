"use client";

import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [queryClient] = useState(() => new QueryClient());

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-zinc-950 text-white">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </QueryClientProvider>
  );
}
